/**
 * Telegram Bot Alert Service for BetaShop Admin Operations
 */
export class TelegramAlertService {
  private static getBotConfig() {
    return {
      botToken: process.env.TELEGRAM_BOT_TOKEN || 'mock_telegram_bot_token',
      chatId: process.env.TELEGRAM_ADMIN_CHAT_ID || 'mock_admin_chat_id',
    };
  }

  /**
   * Sends an operational alert to Admin Telegram Channel/Chat.
   */
  static async sendAlert(title: string, message: string, severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO') {
    const { botToken, chatId } = this.getBotConfig();
    const icon = severity === 'CRITICAL' ? '🚨' : severity === 'WARNING' ? '⚠️' : 'ℹ️';

    const text = `${icon} *[BETASHOP ALERT - ${severity}]* ${title}\n\n${message}\n\n⏱️ _Thời gian: ${new Date().toLocaleString('vi-VN')}_`;

    if (botToken === 'mock_telegram_bot_token') {
      console.log(`[Telegram Alert Emulated] ${title}: ${message}`);
      return { success: true, emulated: true };
    }

    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      });

      const data = await res.json().catch(() => ({}));
      return { success: res.ok, data };
    } catch (err: any) {
      console.error('Failed to send Telegram alert:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Alerts when an upstream provider goes down or degraded.
   */
  static async alertProviderDown(providerName: string, latencyMs: number, errorMessage?: string) {
    return this.sendAlert(
      `Sự cố Nhà cung cấp: ${providerName}`,
      `Nhà cung cấp *${providerName}* vừa chuyển sang trạng thái DOWN/DEGRADED.\n- Độ trễ: ${latencyMs}ms\n- Lỗi: ${errorMessage || 'Timeout không phản hồi'}\n- Hệ thống đã tự động kích hoạt định tuyến dự phòng (Failover Router).`,
      'CRITICAL'
    );
  }

  /**
   * Alerts when digital key stock is critically low.
   */
  static async alertLowStock(productName: string, remainingKeys: number) {
    return this.sendAlert(
      `Cảnh báo Tồn kho Key: ${productName}`,
      `Sản phẩm *${productName}* sắp hết hàng trong kho key nội bộ.\n- Tồn kho khả dụng hiện tại: *${remainingKeys}* keys.\n- Vui lòng nhập thêm lô key mới (Batch) để tránh gián đoạn giao dịch khách hàng.`,
      'WARNING'
    );
  }

  /**
   * Alerts when a chargeback / dispute is initiated.
   */
  static async alertChargeback(orderCode: string, amount: number, gateway: string) {
    return this.sendAlert(
      `Cảnh báo Khiếu nại (Dispute): Đơn ${orderCode}`,
      `Cổng thanh toán *${gateway}* vừa gửi thông báo khiếu nại giao dịch.\n- Mã đơn: *${orderCode}*\n- Số tiền: *${amount.toLocaleString('vi-VN')} ₫*\n- Vui lòng truy cập trang quản trị để xuất Gói Bằng Chứng (Evidence Pack) phản hồi.`,
      'CRITICAL'
    );
  }
}
