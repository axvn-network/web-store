import { NextResponse } from 'next/server';
import { rerentHupSmsZalo } from '@/lib/hupSmsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    if (!phone) {
      return NextResponse.json(
        { status: 'error', message: 'Thiếu số điện thoại' },
        { status: 400 }
      );
    }

    const data = await rerentHupSmsZalo(phone);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
