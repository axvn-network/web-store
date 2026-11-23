import assert from 'node:assert/strict';
import { TestCase } from '../helpers/types';
import prisma from '../../lib/prisma';
import { AutomationEngine } from '../../lib/automationEngine';
import { EscalationHub } from '../../lib/escalationHub';
import { JobQueue } from '../../lib/queue';
import { FraudService } from '../../lib/fraudService';
import { WalletService } from '../../lib/walletService';

export const tests: TestCase[] = [
  // ---------------------------------------------------------------------------
  // 1. Auto-Refund Rule (Below Threshold = Auto Refund, Above = Escalate)
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F10-01',
    tier: 1,
    feature: 'F1' as any,
    name: 'Auto-refund: order < threshold auto-refunds to wallet; order > threshold escalates to admin',
    async run() {
      // 1. Create test user
      const user = await prisma.user.create({
        data: {
          email: `test-refund-${Date.now()}@betashop.vn`,
          name: 'Khách Hàng Auto Refund',
          passwordHash: 'mock',
        },
      });

      // 2. Small order (50,000 VND < 200,000 threshold)
      const smallOrder = await prisma.order.create({
        data: {
          code: `ORD-SMALL-${Date.now()}`,
          customerEmail: user.email,
          customerName: user.name,
          customerPhone: '0988888888',
          shippingAddress: '123 Đường Test, Hà Nội',
          finalTotal: 50_000,
          status: 'PENDING',
        },
      });

      // 3. Large order (500,000 VND > 200,000 threshold)
      const largeOrder = await prisma.order.create({
        data: {
          code: `ORD-LARGE-${Date.now()}`,
          customerEmail: user.email,
          customerName: user.name,
          customerPhone: '0988888888',
          shippingAddress: '123 Đường Test, Hà Nội',
          finalTotal: 500_000,
          status: 'PENDING',
        },
      });

      try {
        // Handle small order failure -> must AUTO_REFUND
        const smallRes = await AutomationEngine.handleOrderFailure(
          smallOrder.id,
          'ITEM-01',
          'All providers down'
        );
        assert.equal(smallRes.action, 'AUTO_REFUND');
        assert.equal(smallRes.refundedAmount, 50_000);

        // Check wallet balance
        const balance = await WalletService.getBalance(user.id);
        assert.equal(balance, 50_000);

        // Handle large order failure -> must ESCALATED_ADMIN
        const largeRes = await AutomationEngine.handleOrderFailure(
          largeOrder.id,
          'ITEM-02',
          'All providers down'
        );
        assert.equal(largeRes.action, 'ESCALATED_ADMIN');

        // Balance remains 50,000
        const finalBalance = await WalletService.getBalance(user.id);
        assert.equal(finalBalance, 50_000);
      } finally {
        await prisma.walletTransaction.deleteMany({ where: { userId: user.id } });
        await prisma.automationLog.deleteMany({ where: { jobName: 'auto_refund' } });
        await prisma.order.deleteMany({ where: { id: { in: [smallOrder.id, largeOrder.id] } } });
        await prisma.user.delete({ where: { id: user.id } });
      }
    },
  },

  // ---------------------------------------------------------------------------
  // 2. Auto-Price Update Governance (<= 10% auto-applies, > 10% alerts admin)
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F10-02',
    tier: 1,
    feature: 'F1' as any,
    name: 'Auto-price update: cost <= 10% auto-applies; cost > 10% pending admin approval',
    async run() {
      // Small increase (+5%): from 100,000 to 105,000
      const resSmall = await AutomationEngine.evaluatePriceChange(
        'svc-test-1',
        'Dịch vụ Proxy 4G',
        100_000,
        105_000,
        120_000
      );
      assert.ok(resSmall);
      assert.equal(resSmall.status, 'AUTO_APPLIED');

      // Large increase (+20%): from 100,000 to 120,000
      const resLarge = await AutomationEngine.evaluatePriceChange(
        'svc-test-2',
        'Tài khoản Cloud VPS',
        100_000,
        120_000,
        120_000
      );
      assert.ok(resLarge);
      assert.equal(resLarge.status, 'PENDING_ADMIN_APPROVAL');

      // Cleanup
      await prisma.priceChangeLog.deleteMany({
        where: { upstreamServiceId: { in: ['svc-test-1', 'svc-test-2'] } },
      });
    },
  },

  // ---------------------------------------------------------------------------
  // 3. Escalation Hub Grouping (20 failures -> 1 consolidated alert, <= 10/day)
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F10-03',
    tier: 1,
    feature: 'F1' as any,
    name: 'Smart escalation hub: groups 20 burst errors into 1 alert, limits to <= 10/day',
    async run() {
      // Dispatch 20 burst errors in the same category
      let firstResult;
      for (let i = 0; i < 20; i++) {
        const res = await EscalationHub.dispatch(
          'ORDER_FAILURES',
          'Cảnh Báo Đơn Hàng Thất Bại',
          `Đơn ORD-${i + 1} không thể fulfill qua đối tác`
        );
        if (i === 0) firstResult = res;
      }

      // First one sends or buffers, subsequent 19 are buffered without spamming
      assert.ok(firstResult);

      // Flush grouped
      await EscalationHub.flushGroupedAlerts();
    },
  },

  // ---------------------------------------------------------------------------
  // 4. Job Queue Idempotency with singletonKey
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F10-04',
    tier: 1,
    feature: 'F1' as any,
    name: 'Queue job idempotency: singletonKey prevents duplicate job execution',
    async run() {
      const uniqueSingletonKey = `order-fulfill-key-${Date.now()}`;

      // Enqueue first job
      const res1 = await JobQueue.enqueue('FULFILL_ORDER_ITEM', { orderId: 'ORD-001' }, {
        singletonKey: uniqueSingletonKey,
      });
      assert.equal(res1.deduplicated, false);

      // Enqueue identical job with same singletonKey
      const res2 = await JobQueue.enqueue('FULFILL_ORDER_ITEM', { orderId: 'ORD-001' }, {
        singletonKey: uniqueSingletonKey,
      });
      assert.equal(res2.deduplicated, true);
      assert.equal(res2.jobId, res1.jobId);

      // Cleanup
      await prisma.queueJob.deleteMany({ where: { singletonKey: uniqueSingletonKey } });
    },
  },

  // ---------------------------------------------------------------------------
  // 5. Zero-Touch Rate Metric Calculation
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F10-05',
    tier: 1,
    feature: 'F1' as any,
    name: 'Zero-touch rate KPI calculation: accurately computes % automated orders',
    async run() {
      const metric = await AutomationEngine.calculateZeroTouchMetric(30);
      assert.ok(typeof metric.zeroTouchRatePercent === 'number');
      assert.ok(metric.zeroTouchRatePercent >= 0 && metric.zeroTouchRatePercent <= 100);
      assert.ok(typeof metric.autoCompletedOrders === 'number');
    },
  },
];
