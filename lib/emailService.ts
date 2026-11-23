/**
 * Transactional Email Service via Resend / SMTP Fallback
 */
export class EmailService {
  private static getApiKey() {
    return process.env.RESEND_API_KEY || 're_mock_api_key';
  }

  /**
   * Sends order receipt with payment confirmation and digital credentials delivery.
   */
  static async sendOrderReceipt(
    toEmail: string,
    orderCode: string,
    productName: string,
    totalAmount: number,
    deliveredKeys?: string[]
  ) {
    const apiKey = this.getApiKey();

    const keysHtml = deliveredKeys && deliveredKeys.length > 0
      ? `
        <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="color: #0f172a; margin-top: 0;">Thông tin tài khoản / Key bản quyền của bạn:</h3>
          <ul style="list-style: none; padding-left: 0; font-family: monospace; font-size: 14px;">
            ${deliveredKeys.map((k) => `<li style="background: #e2e8f0; padding: 8px 12px; margin-bottom: 6px; border-radius: 4px;"><code>${k}</code></li>`).join('')}
          </ul>
        </div>
      `
      : '';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #f53d2d; border-bottom: 2px solid #f53d2d; padding-bottom: 8px;">Xác nhận đơn hàng #${orderCode} - BetaShop</h2>
        <p>Xin chào quý khách,</p>
        <p>Cảm ơn bạn đã tin tưởng và giao dịch tại <strong>BetaShop</strong>. Đơn hàng của bạn đã được thanh toán thành công và kích hoạt tự động 24/7.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Mã đơn hàng:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${orderCode}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Sản phẩm / Dịch vụ:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${productName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Tổng thanh toán:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #f53d2d; font-weight: bold;">${totalAmount.toLocaleString('vi-VN')} ₫</td>
          </tr>
        </table>

        ${keysHtml}

        <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Nếu cần hỗ trợ kỹ thuật hoặc bảo hành, vui lòng liên hệ hotline hoặc Zalo CSKH của BetaShop.</p>
      </div>
    `;

    if (apiKey === 're_mock_api_key') {
      console.log(`[Email Emulated to ${toEmail}] Order ${orderCode} delivered.`);
      return { success: true, emulated: true };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BetaShop <no-reply@betashop.vn>',
          to: [toEmail],
          subject: `[BetaShop] Đơn hàng #${orderCode} - Giao dịch thành công`,
          html,
        }),
      });

      const data = await res.json().catch(() => ({}));
      return { success: res.ok, data };
    } catch (err: any) {
      console.error('Failed to send transactional email:', err.message);
      return { success: false, error: err.message };
    }
  }
}
