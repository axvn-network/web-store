import { NextResponse } from 'next/server';
import { getTaiKhoanOrderDetail } from '@/lib/taiKhoanService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order');

    if (!orderId) {
      return NextResponse.json(
        { status: 'error', msg: 'Vui lòng cung cấp mã đơn hàng (order)' },
        { status: 400 }
      );
    }

    const data = await getTaiKhoanOrderDetail(orderId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', msg: error.message || 'Lỗi tra cứu đơn hàng' },
      { status: 500 }
    );
  }
}
