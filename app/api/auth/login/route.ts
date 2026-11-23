import { NextResponse } from 'next/server';
import { readCustomerDb, writeCustomerDb, CustomerUser, LoginLogItem } from '@/lib/customerDb';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method = 'email', email, phone, password, googleProfile } = body;
    const db = readCustomerDb();

    let user: CustomerUser | undefined;

    if (method === 'email') {
      if (!email || !password) {
        return NextResponse.json({ success: false, error: 'Vui lòng nhập đầy đủ email và mật khẩu.' }, { status: 400 });
      }
      user = db.users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        return NextResponse.json({ success: false, error: 'Tài khoản email này chưa được đăng ký.' }, { status: 404 });
      }
      // Demo password accept 123456 or any password for registered users
      if (password !== '123456' && password !== '12345678' && user.passwordHash) {
        // accept demo
      }
    } else if (method === 'google') {
      const gEmail = googleProfile?.email;
      if (!gEmail) {
        return NextResponse.json({ success: false, error: 'Không nhận được thông tin từ Google.' }, { status: 400 });
      }
      user = db.users.find((u) => u.email?.toLowerCase() === gEmail.toLowerCase());
      if (user) {
        // Ensure google account is linked
        if (!user.linkedAccounts?.some((a) => a.provider === 'google')) {
          user.linkedAccounts = [
            ...(user.linkedAccounts || []),
            { provider: 'google', providerId: googleProfile.id || gEmail, connectedAt: new Date().toLocaleDateString('vi-VN') },
          ];
          writeCustomerDb(db);
        }
      } else {
        // Auto create customer
        user = {
          id: `usr-${Date.now()}`,
          name: googleProfile.name || gEmail.split('@')[0],
          email: gEmail,
          emailVerified: true,
          image: googleProfile.picture || googleProfile.image,
          role: 'customer',
          status: 'active',
          tier: 'COPPER',
          totalSpent: 0,
          points: 50,
          linkedAccounts: [
            { provider: 'google', providerId: googleProfile.id || gEmail, connectedAt: new Date().toLocaleDateString('vi-VN') },
          ],
          createdAt: new Date().toLocaleString('vi-VN'),
        };
        db.users.unshift(user);
        writeCustomerDb(db);
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'Đăng nhập không thành công.' }, { status: 401 });
    }

    // Record login log
    const log: LoginLogItem = {
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      method,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      success: true,
      createdAt: new Date().toLocaleString('vi-VN'),
    };
    db.loginLogs.unshift(log);
    writeCustomerDb(db);

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
