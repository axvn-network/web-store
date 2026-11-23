import { NextResponse } from 'next/server';
import { getHupSmsProxyOrders } from '@/lib/hupSmsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const serviceId = searchParams.get('serviceId')
      ? Number(searchParams.get('serviceId'))
      : undefined;
    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : undefined;
    const limit = searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : undefined;

    const data = await getHupSmsProxyOrders({ status, serviceId, page, limit });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
