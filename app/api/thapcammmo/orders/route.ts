import { NextResponse } from 'next/server';
import { createThapCamOrder, getThapCamOrders } from '@/lib/thapCamMmoService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
    const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : undefined;
    const status = searchParams.get('status') || undefined;
    const serviceType = searchParams.get('serviceType') || undefined;

    const data = await getThapCamOrders({ page, pageSize, status, serviceType });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.serviceId) {
      return NextResponse.json(
        { success: false, message: 'Thiếu serviceId' },
        { status: 400 }
      );
    }

    const data = await createThapCamOrder(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
