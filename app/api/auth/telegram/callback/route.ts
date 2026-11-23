import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readCustomerDb, writeCustomerDb, CustomerUser } from '@/lib/customerDb';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { hash, ...userData } = data;

    const botToken = process.env.TELEGRAM_BOT_TOKEN || 'DEMO_TELEGRAM_BOT_TOKEN_BETASHOP';

    // Verify HMAC-SHA256
    let isValid = false;
    if (botToken === 'DEMO_TELEGRAM_BOT_TOKEN_BETASHOP' || !hash) {
      // Allow demo sign-in for dev testing
      isValid = true;
    } else {
      const secretKey = crypto.createHash('sha256').update(botToken).digest();
      const checkString = Object.keys(userData)
        .sort()
        .map((k) => `${k}=${userData[k]}`)
        .join('\n');
      const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
      isValid = hmac === hash;
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Chữ ký xác thực Telegram không hợp lệ hoặc đã bị thay đổi.' },
        { status: 401 }
      );
    }

    const telegramId = String(userData.id || `tg-${Date.now()}`);
    const displayName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || userData.username || 'Khách hàng Telegram';

    const db = readCustomerDb();
    let user = db.users.find(
      (u) => u.linkedAccounts?.some((acc) => acc.provider === 'telegram' && acc.providerId === telegramId)
    );

    if (!user) {
      user = {
        id: `usr-tg-${telegramId}`,
        name: displayName,
        image: userData.photo_url,
        role: 'customer',
        status: 'active',
        tier: 'COPPER',
        totalSpent: 0,
        points: 50,
        linkedAccounts: [
          {
            provider: 'telegram',
            providerId: telegramId,
            connectedAt: new Date().toLocaleDateString('vi-VN'),
          },
        ],
        createdAt: new Date().toLocaleString('vi-VN'),
      };
      db.users.unshift(user);
      writeCustomerDb(db);
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập bằng Telegram thành công!',
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
