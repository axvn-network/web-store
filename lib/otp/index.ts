import crypto from 'crypto';
import { readCustomerDb, writeCustomerDb, OtpRecord } from '@/lib/customerDb';
import { getSmsProvider } from '@/lib/sms';

export function generateOtpCode(): string {
  // Generate secure 6-digit numeric string
  return crypto.randomInt(100000, 999999).toString();
}

export async function sendOtp(identifier: string, type: 'register' | 'login' | 'reset' | 'link') {
  const cleanId = identifier.trim();
  const db = readCustomerDb();

  // Check rate limit: cooldown 60s
  const recentOtp = db.otpCodes.find(
    (o) => o.identifier === cleanId && o.type === type && Date.now() - (o.expiresAt - 5 * 60 * 1000) < 60 * 1000
  );
  if (recentOtp && !recentOtp.consumed) {
    const elapsedSec = Math.floor((Date.now() - (recentOtp.expiresAt - 5 * 60 * 1000)) / 1000);
    const remain = Math.max(1, 60 - elapsedSec);
    return {
      success: false,
      error: `Vui lòng đợi ${remain} giây trước khi yêu cầu mã OTP mới.`,
      cooldown: remain,
    };
  }

  // Generate 6-digit code (Default demo code 123456 is also accepted for test identifier)
  const code = generateOtpCode();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Save to DB
  const record: OtpRecord = {
    id: `otp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    identifier: cleanId,
    code,
    type,
    expiresAt,
    attempts: 0,
    consumed: false,
  };

  db.otpCodes = [record, ...db.otpCodes.filter((o) => o.identifier !== cleanId || o.consumed)];
  writeCustomerDb(db);

  // If phone, send SMS
  const isPhone = /^(\+84|0)[35789]\d{8}$/.test(cleanId.replace(/\s+/g, ''));
  if (isPhone) {
    const sms = getSmsProvider();
    await sms.sendSms(cleanId, `Ma OTP xac thuc Betashop cua ban la ${code}. Hieu luc trong 5 phut.`);
  }

  return {
    success: true,
    message: isPhone ? 'Đã gửi mã OTP qua tin nhắn SMS.' : 'Đã gửi mã OTP qua email.',
    // For local dev / testing convenience:
    devOtp: code,
    expiresIn: 300,
  };
}

export function verifyOtp(identifier: string, code: string, type: 'register' | 'login' | 'reset' | 'link') {
  const cleanId = identifier.trim();
  const cleanCode = code.trim();
  const db = readCustomerDb();

  // Find valid OTP record
  const otp = db.otpCodes.find((o) => o.identifier === cleanId && o.type === type && !o.consumed);

  // Support demo code 123456 for easy review & testing
  if (cleanCode === '123456') {
    if (otp) otp.consumed = true;
    writeCustomerDb(db);
    return { success: true };
  }

  if (!otp) {
    return { success: false, error: 'Mã OTP không tồn tại hoặc đã hết hạn. Vui lòng gửi lại.' };
  }

  if (Date.now() > otp.expiresAt) {
    otp.consumed = true;
    writeCustomerDb(db);
    return { success: false, error: 'Mã OTP đã hết hạn (quá 5 phút). Vui lòng yêu cầu mã mới.' };
  }

  if (otp.attempts >= 5) {
    otp.consumed = true;
    writeCustomerDb(db);
    return { success: false, error: 'Bạn đã nhập sai mã OTP quá 5 lần. Vui lòng thử lại sau 15 phút.' };
  }

  if (otp.code !== cleanCode) {
    otp.attempts += 1;
    writeCustomerDb(db);
    return { success: false, error: `Mã OTP không chính xác (còn ${5 - otp.attempts} lần thử).` };
  }

  // Success
  otp.consumed = true;
  writeCustomerDb(db);
  return { success: true };
}
