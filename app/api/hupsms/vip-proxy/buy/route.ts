import { NextResponse } from 'next/server';
import { buyHupSmsVipProxy } from '@/lib/hupSmsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = Number(searchParams.get('serviceId'));
    const expire = Number(searchParams.get('expire') || 1);
    const quantity = searchParams.get('quantity')
      ? Number(searchParams.get('quantity'))
      : 1;

    if (!serviceId) {
      return NextResponse.json(
        { status: 'error', message: 'Thiếu serviceId' },
        { status: 400 }
      );
    }

    const data = await buyHupSmsVipProxy({ serviceId, expire, quantity });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
