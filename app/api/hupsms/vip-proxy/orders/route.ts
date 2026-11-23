import { NextResponse } from 'next/server';
import { getHupSmsVipProxyOrders } from '@/lib/hupSmsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : undefined;
    const limit = searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : undefined;

    const data = await getHupSmsVipProxyOrders({ status, page, limit });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
