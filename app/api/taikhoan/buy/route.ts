import { NextResponse } from 'next/server';
import { buyTaiKhoanProduct } from '@/lib/taiKhoanService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, amount = 1, coupon } = body;

    if (!id) {
      return NextResponse.json(
        { status: 'error', msg: 'Vui lòng cung cấp ID sản phẩm cần mua' },
        { status: 400 }
      );
    }

    const result = await buyTaiKhoanProduct({
      id,
      amount: Number(amount),
      coupon,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', msg: error.message || 'Lỗi khi đặt hàng qua đối tác' },
      { status: 500 }
    );
  }
}
