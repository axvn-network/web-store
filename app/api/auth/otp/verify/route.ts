import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp';
import { readCustomerDb, writeCustomerDb, CustomerUser } from '@/lib/customerDb';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, code, type = 'login', name } = body;

    if (!identifier || !code) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin xác thực OTP.' },
        { status: 400 }
      );
    }

    const check = verifyOtp(identifier, code, type);
    if (!check.success) {
      return NextResponse.json(check, { status: 400 });
    }

    // If verification succeeded: find or create customer
    const db = readCustomerDb();
    const cleanId = identifier.trim();
    const isPhone = /^(\+84|0)[35789]\d{8}$/.test(cleanId.replace(/\s+/g, ''));

    let user = db.users.find(
      (u) =>
        (isPhone && u.phone === cleanId) ||
        (!isPhone && u.email?.toLowerCase() === cleanId.toLowerCase())
    );

    if (!user) {
      // Auto create new customer
      user = {
        id: `usr-${Date.now()}`,
        name: name || (isPhone ? `Khách hàng ${cleanId.slice(-4)}` : cleanId.split('@')[0]),
        email: isPhone ? undefined : cleanId,
        emailVerified: !isPhone,
        phone: isPhone ? cleanId : undefined,
        phoneVerified: isPhone,
        role: 'customer',
        status: 'active',
        tier: 'COPPER',
        totalSpent: 0,
        points: 50, // welcome bonus 50 points
        linkedAccounts: [
          {
            provider: isPhone ? 'phone' : 'email',
            providerId: cleanId,
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
      message: 'Xác thực OTP thành công!',
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
