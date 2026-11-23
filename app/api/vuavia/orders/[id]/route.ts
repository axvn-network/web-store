import { NextResponse } from 'next/server';
import { getVuaViaOrderDetail } from '@/lib/vuaViaService';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Thiếu mã đơn hàng' },
        { status: 400 }
      );
    }

    const data = await getVuaViaOrderDetail(orderId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
