// SMS Adapter Pattern (ESMS, Viettel, Twilio, Mock)

export interface SmsProvider {
  name: string;
  sendSms: (phone: string, message: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export class MockSmsProvider implements SmsProvider {
  name = 'MOCK_SMS';
  async sendSms(phone: string, message: string) {
    console.log(`[SMS-MOCK] 📱 Gửi SMS tới ${phone}: "${message}"`);
    return { success: true, messageId: `mock-${Date.now()}` };
  }
}

export class EsmsProvider implements SmsProvider {
  name = 'ESMS_VN';
  async sendSms(phone: string, message: string) {
    const apiKey = process.env.ESMS_API_KEY;
    const secretKey = process.env.ESMS_SECRET_KEY;
    const brandname = process.env.ESMS_BRANDNAME || 'BETASHOP';

    if (!apiKey || !secretKey) {
      console.warn('[ESMS] Thiếu cấu hình ESMS_API_KEY / ESMS_SECRET_KEY, chuyển sang mock');
      return new MockSmsProvider().sendSms(phone, message);
    }

    try {
      const formattedPhone = phone.replace(/^0/, '84');
      const url = `http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?Phone=${formattedPhone}&Content=${encodeURIComponent(
        message
      )}&ApiKey=${apiKey}&SecretKey=${secretKey}&IsUnicode=0&Brandname=${brandname}&SmsType=2`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.CodeResult === '100') {
        return { success: true, messageId: data.SMSID };
      }
      return { success: false, error: data.ErrorMessage || 'Gửi tin nhắn qua ESMS thất bại' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

export function getSmsProvider(): SmsProvider {
  const providerType = process.env.SMS_PROVIDER || 'mock';
  if (providerType === 'esms') {
    return new EsmsProvider();
  }
  return new MockSmsProvider();
}
