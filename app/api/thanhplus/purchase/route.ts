import { NextResponse } from 'next/server';
import { purchaseThanhPlusProduct } from '@/lib/thanhPlusService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.productid) {
      return NextResponse.json(
        { status: 'error', msg: 'Thiếu productid' },
        { status: 400 }
      );
    }

    const data = await purchaseThanhPlusProduct({
      productid: body.productid,
      quantity: body.quantity ? Number(body.quantity) : 1,
      service_info: body.service_info || 'order@store.vn',
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', msg: error.message },
      { status: 500 }
    );
  }
}
