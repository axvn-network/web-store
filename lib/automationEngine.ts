import prisma from './prisma';
import { WalletService } from './walletService';
import { EmailService } from './emailService';
import { TelegramAlertService } from './telegramService';

export interface ZeroTouchReport {
  totalOrders: number;
  autoCompletedOrders: number;
  manualOrders: number;
  autoRefundedOrders: number;
  zeroTouchRatePercent: number;
  periodDays: number;
}

/**
 * Enterprise Automation Engine
 * Implements "Automate the predictable, escalate the exceptional, self-healing first".
 */
export class AutomationEngine {
  /**
   * Retrieves an automation rule configuration from database with fallback.
   */
  static async getRule<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const rule = await prisma.automationRule.findUnique({
        where: { key },
      });
      if (rule && rule.isEnabled && rule.value) {
        return JSON.parse(rule.value) as T;
      }
    } catch (e) {
      console.warn(`Failed to read automation rule ${key}, using default:`, e);
    }
    return defaultValue;
  }

  /**
   * Logs an automation decision for auditing and observability.
   */
  static async logDecision(
    jobName: string,
    decision: string,
    input: any,
    output: any,
    status = 'SUCCESS'
  ) {
    try {
      await prisma.automationLog.create({
        data: {
          jobName,
          decision,
          input: input ? JSON.stringify(input) : null,
          output: output ? JSON.stringify(output) : null,
          status,
        },
      });
    } catch (e) {
      console.error('Failed to log automation decision:', e);
    }
  }

  /**
   * Automatically handles failed order items after all retries and failovers are exhausted.
   * - If order amount <= threshold and auto-refund enabled: auto-refund to user wallet + send apology email.
   * - If order amount > threshold: escalate to admin queue with actionable alert.
   */
  static async handleOrderFailure(orderId: string, orderItemId: string, failureReason: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) return { handled: false, error: 'Order not found' };

    const rule = await this.getRule('auto_refund_max_threshold', {
      maxAmount: 200000,
      sendApologyEmail: true,
      voucherPercent: 5,
    });

    const isUnderThreshold = order.finalTotal <= rule.maxAmount;

    if (isUnderThreshold) {
      // 1. AUTO-REFUND to customer wallet
      try {
        const user = order.customerEmail
          ? await prisma.user.findUnique({ where: { email: order.customerEmail } })
          : (order.customerId ? await prisma.user.findUnique({ where: { id: order.customerId } }) : null);

        if (user) {
          await WalletService.adjustBalanceAtomic({
            userId: user.id,
            amount: order.finalTotal,
            type: 'REFUND',
            note: `Tự động hoàn tiền đơn hàng #${order.code} do đối tác kỹ thuật gián đoạn`,
            referenceId: order.id,
            performedBy: 'AUTOMATION_ENGINE',
          });
        }

        // 2. Update order status to REFUNDED
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'RETURNED', // Refunded/Returned
            internalNote: `[AUTO-REFUND] Đã tự động hoàn trả ${order.finalTotal.toLocaleString('vi-VN')} ₫ về ví. Lý do: ${failureReason}`,
          },
        });

        // 3. Send notification email
        if (rule.sendApologyEmail && (order.customerEmail || order.customer?.email)) {
          const targetEmail = order.customerEmail || order.customer?.email || '';
          await EmailService.sendOrderReceipt(
            targetEmail,
            order.code,
            'Hoàn Tiền Tự Động (Auto-Refund)',
            order.finalTotal
          );
        }

        await this.logDecision(
          'auto_refund',
          'AUTO_REFUND',
          { orderId, code: order.code, amount: order.finalTotal, failureReason },
          { refundedAmount: order.finalTotal, destination: 'WALLET' },
          'AUTO_REFUND'
        );

        return { handled: true, action: 'AUTO_REFUND', refundedAmount: order.finalTotal };
      } catch (err: any) {
        console.error('Auto refund failed:', err.message);
      }
    }

    // 2. ESCALATE TO ADMIN: if above threshold or wallet error
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PENDING',
        internalNote: `[ESCALATED_ADMIN] Cần can thiệp thủ công: ${failureReason} (Số tiền: ${order.finalTotal.toLocaleString('vi-VN')} ₫)`,
      },
    });

    await this.logDecision(
      'fulfillment_escalation',
      'ESCALATED_ADMIN',
      { orderId, code: order.code, amount: order.finalTotal, failureReason },
      { reason: 'Exceeded auto-refund threshold or manual review required' },
      'ESCALATED'
    );

    // Send actionable alert to Telegram
    await TelegramAlertService.sendAlert(
      `Đơn #${order.code} Cần Duyệt Thủ Công`,
      `Đơn hàng trị giá *${order.finalTotal.toLocaleString('vi-VN')} ₫* đã thử hết chuỗi nhà cung cấp và cần admin xử lý.\n- Lý do: ${failureReason}\n- Thao tác nhanh: [Duyệt Hoàn Tiền] hoặc [Gán Key Thủ Công] trong Dashboard.`,
      'WARNING'
    );

    return { handled: true, action: 'ESCALATED_ADMIN' };
  }

  /**
   * Evaluates cost price updates from upstream services.
   * - Cost decrease -> auto-recalculate & apply lower retail price (beneficial for customers).
   * - Cost increase <= 10% -> auto-recalculate.
   * - Cost increase > 10% -> requires admin approval (prevent sudden price spike).
   */
  static async evaluatePriceChange(
    upstreamServiceId: string,
    serviceName: string,
    oldCost: number,
    newCost: number,
    currentRetailPrice: number,
    markupPercent = 20
  ) {
    if (oldCost <= 0 || newCost <= 0 || oldCost === newCost) return;

    const percentChange = ((newCost - oldCost) / oldCost) * 100;
    const rule = await this.getRule('price_change_governance', {
      maxPercentIncrease: 10,
      autoApplyDecrease: true,
      roundToThousand: true,
    });

    const suggestedPrice = Math.round((newCost * (1 + markupPercent / 100)) / 1000) * 1000;

    // Case 1: Cost decreased or increase <= maxPercentIncrease -> Auto-apply
    if (percentChange <= 0 || percentChange <= rule.maxPercentIncrease) {
      await prisma.priceChangeLog.create({
        data: {
          upstreamServiceId,
          serviceName,
          oldCost,
          newCost,
          percentChange,
          suggestedPrice,
          status: 'AUTO_APPLIED',
        },
      });

      await this.logDecision(
        'price_sync',
        'AUTO_APPLIED',
        { serviceName, oldCost, newCost, percentChange },
        { newRetailPrice: suggestedPrice },
        'SUCCESS'
      );

      return { status: 'AUTO_APPLIED', suggestedPrice, percentChange };
    }

    // Case 2: Cost increased > 10% -> Escalate for approval
    await prisma.priceChangeLog.create({
      data: {
        upstreamServiceId,
        serviceName,
        oldCost,
        newCost,
        percentChange,
        suggestedPrice,
        status: 'PENDING_ADMIN_APPROVAL',
      },
    });

    await this.logDecision(
      'price_sync',
      'PENDING_ADMIN_APPROVAL',
      { serviceName, oldCost, newCost, percentChange },
      { alertSent: true },
      'ESCALATED'
    );

    await TelegramAlertService.sendAlert(
      `Biến Động Giá Lớn: ${serviceName}`,
      `Giá vốn upstream của *${serviceName}* tăng vọt *+${percentChange.toFixed(1)}%* (Từ ${oldCost.toLocaleString('vi-VN')} ₫ ➔ ${newCost.toLocaleString('vi-VN')} ₫).\n- Giá bán đề xuất: *${suggestedPrice.toLocaleString('vi-VN')} ₫*.\n- Hệ thống đã giữ nguyên giá cũ và chờ bạn phê duyệt tại trang Quản trị.`,
      'WARNING'
    );

    return { status: 'PENDING_ADMIN_APPROVAL', suggestedPrice, percentChange };
  }

  /**
   * Computes the "Zero-Touch Rate" KPI: percentage of orders completed completely automatically.
   */
  static async calculateZeroTouchMetric(days = 30): Promise<ZeroTouchReport> {
    const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const totalOrders = await prisma.order.count({
      where: {
        createdAt: { gte: sinceDate },
      },
    });

    const manualOrders = await prisma.order.count({
      where: {
        createdAt: { gte: sinceDate },
        internalNote: { contains: '[MANUAL' },
      },
    });

    const autoRefundedOrders = await prisma.order.count({
      where: {
        createdAt: { gte: sinceDate },
        internalNote: { contains: '[AUTO-REFUND]' },
      },
    });

    const autoCompletedOrders = Math.max(0, totalOrders - manualOrders);
    const zeroTouchRatePercent =
      totalOrders > 0 ? Number(((autoCompletedOrders / totalOrders) * 100).toFixed(1)) : 100.0;

    return {
      totalOrders,
      autoCompletedOrders,
      manualOrders,
      autoRefundedOrders,
      zeroTouchRatePercent,
      periodDays: days,
    };
  }
}
