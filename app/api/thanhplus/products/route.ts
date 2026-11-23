import { NextResponse } from 'next/server';
import { getThanhPlusProducts } from '@/lib/thanhPlusService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') as any) || 'all';

    const data = await getThanhPlusProducts(type);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', msg: error.message },
      { status: 500 }
    );
  }
}
