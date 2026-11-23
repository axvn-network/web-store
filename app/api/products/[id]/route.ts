import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dbService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = readDb();
    const product = db.products.find((p) => String(p.id) === id || p.slug === id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const db = readDb();
    const index = db.products.findIndex((p) => String(p.id) === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm để cập nhật' },
        { status: 404 }
      );
    }

    db.products[index] = { ...db.products[index], ...body };
    writeDb(db);

    return NextResponse.json({ success: true, data: db.products[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = readDb();
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => String(p.id) !== id);

    if (db.products.length === initialLen) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy sản phẩm để xóa' },
        { status: 404 }
      );
    }

    writeDb(db);
    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
