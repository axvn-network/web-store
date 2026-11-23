import { NextResponse } from 'next/server';
import { readDb, writeDb, Order } from '@/lib/dbService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const db = readDb();
    let orders = db.orders || [];

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.code.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }

    return NextResponse.json({ success: true, data: orders, total: orders.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, totalPrice, shippingFee, finalTotal, paymentMethod } = body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin người nhận (Họ tên, SĐT, Địa chỉ)' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Giỏ hàng trống' },
        { status: 400 }
      );
    }

    const db = readDb();
    const orderId = `ord-${Date.now()}`;
    const code = `BS${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newOrder: Order = {
      id: orderId,
      code,
      customerName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      province: customer.province || 'Hà Nội',
      district: customer.district || '',
      note: customer.note,
      items: items.map((i: any) => ({
        productId: i.product?.id || i.productId,
        title: i.product?.title || i.title,
        price: Number(i.product?.price || i.price),
        quantity: Number(i.quantity || 1),
        image: i.product?.image || i.image || '',
      })),
      totalAmount: Number(totalPrice),
      shippingFee: Number(shippingFee || 0),
      finalTotal: Number(finalTotal || totalPrice),
      status: 'PENDING',
      statusText: 'Chờ xác nhận',
      paymentMethod: (paymentMethod || 'COD').toUpperCase(),
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    db.orders.unshift(newOrder);

    // Reduce stock for products
    for (const item of newOrder.items) {
      const prod = db.products.find((p) => String(p.id) === String(item.productId));
      if (prod) {
        prod.sold = (prod.sold || 0) + item.quantity;
        if (prod.quantity) {
          prod.quantity = Math.max(0, prod.quantity - item.quantity);
        }
      }
    }

    writeDb(db);

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
