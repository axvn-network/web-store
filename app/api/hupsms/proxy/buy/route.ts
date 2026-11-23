import { NextResponse } from 'next/server';
import { buyHupSmsProxy } from '@/lib/hupSmsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = Number(searchParams.get('serviceId'));
    const days = Number(searchParams.get('days'));
    const quantity = searchParams.get('quantity')
      ? Number(searchParams.get('quantity'))
      : 1;
    const type = (searchParams.get('type') as any) || 'HTTP';

    if (!serviceId || !days) {
      return NextResponse.json(
        { status: 'error', message: 'Thiếu serviceId hoặc days' },
        { status: 400 }
      );
    }

    const data = await buyHupSmsProxy({ serviceId, days, quantity, type });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
