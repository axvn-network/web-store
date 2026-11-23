import { NextResponse } from 'next/server';
import { sendOtp } from '@/lib/otp';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, type = 'login' } = body;

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp Số điện thoại hoặc Email hợp lệ.' },
        { status: 400 }
      );
    }

    const res = await sendOtp(identifier, type);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
