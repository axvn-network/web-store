import { NextResponse } from 'next/server';
import { readCustomerDb, writeCustomerDb, CustomerUser } from '@/lib/customerDb';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập họ và tên của bạn.' }, { status: 400 });
    }

    const db = readCustomerDb();

    // Check if email already registered
    if (email) {
      const existEmail = db.users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
      if (existEmail) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email này đã được đăng ký tài khoản. Bạn có thể đăng nhập hoặc liên kết tài khoản.',
            canLink: true,
            existingProvider: existEmail.linkedAccounts?.[0]?.provider || 'email',
          },
          { status: 409 }
        );
      }
    }

    // Check if phone already registered
    if (phone) {
      const existPhone = db.users.find((u) => u.phone === phone.trim());
      if (existPhone) {
        return NextResponse.json(
          {
            success: false,
            error: 'Số điện thoại này đã được sử dụng. Vui lòng đăng nhập bằng mã OTP.',
          },
          { status: 409 }
        );
      }
    }

    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email ? email.trim() : undefined,
      emailVerified: false,
      phone: phone ? phone.trim() : undefined,
      phoneVerified: false,
      passwordHash: password ? 'hashed_' + password : '',
      role: 'customer',
      status: 'active',
      tier: 'COPPER',
      totalSpent: 0,
      points: 100, // 100 bonus points on registration
      linkedAccounts: [
        ...(email ? [{ provider: 'email' as const, providerId: email.trim(), connectedAt: new Date().toLocaleDateString('vi-VN') }] : []),
        ...(phone ? [{ provider: 'phone' as const, providerId: phone.trim(), connectedAt: new Date().toLocaleDateString('vi-VN') }] : []),
      ],
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    db.users.unshift(newUser);
    writeCustomerDb(db);

    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Tặng ngay 100 điểm thưởng chào mừng.',
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
