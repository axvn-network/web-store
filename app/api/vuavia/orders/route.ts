import { NextResponse } from 'next/server';
import { buyVuaViaProduct, getVuaViaOrders } from '@/lib/vuaViaService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
    const size = searchParams.get('size') ? Number(searchParams.get('size')) : undefined;

    const data = await getVuaViaOrders({ page, size });
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
    if (!body.productId || !body.quantity) {
      return NextResponse.json(
        { success: false, message: 'Thiếu productId hoặc quantity' },
        { status: 400 }
      );
    }

    const data = await buyVuaViaProduct({
      productId: Number(body.productId),
      quantity: Number(body.quantity),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
