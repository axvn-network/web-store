import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dbService';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({
      success: true,
      data: {
        categories: db.categories,
        brands: db.brands,
        shops: db.shops,
        units: db.units,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { type, value } = await request.json();
    if (!type || !value || !value.trim()) {
      return NextResponse.json({ success: false, error: 'Thiếu loại hoặc giá trị cần thêm' }, { status: 400 });
    }

    const db = readDb();
    const cleanVal = value.trim();

    if (type === 'shop') {
      if (!db.shops.includes(cleanVal)) db.shops.push(cleanVal);
    } else if (type === 'unit') {
      if (!db.units.includes(cleanVal)) db.units.push(cleanVal);
    } else if (type === 'brand') {
      if (!db.brands.includes(cleanVal)) db.brands.push(cleanVal);
    } else if (type === 'category') {
      const slug = cleanVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!db.categories.some((c) => c.title === cleanVal)) {
        db.categories.push({ id: Date.now(), title: cleanVal, slug, itemCount: 0 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Loại dữ liệu không hỗ trợ' }, { status: 400 });
    }

    writeDb(db);
    return NextResponse.json({ success: true, data: { type, value: cleanVal } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
