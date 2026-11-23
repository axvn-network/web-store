import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dbService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = readDb();
    const order = db.orders.find((o) => o.id === id || o.code === id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const db = readDb();
    const order = db.orders.find((o) => o.id === id || o.code === id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    const statusMap: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      PROCESSING: 'Đang đóng gói',
      SHIPPING: 'Đang vận chuyển',
      COMPLETED: 'Đã hoàn thành',
      CANCELED: 'Đã hủy',
    };

    if (status && statusMap[status]) {
      order.status = status;
      order.statusText = statusMap[status];
    }

    writeDb(db);

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
