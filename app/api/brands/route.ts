import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dbService';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ success: true, data: db.brands });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Tên thương hiệu không được để trống' }, { status: 400 });
    }

    const db = readDb();
    const brandName = name.trim();
    if (!db.brands.includes(brandName)) {
      db.brands.push(brandName);
      writeDb(db);
    }

    return NextResponse.json({ success: true, data: brandName }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
