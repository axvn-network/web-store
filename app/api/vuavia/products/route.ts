import { NextResponse } from 'next/server';
import { getVuaViaProducts } from '@/lib/vuaViaService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    const categoryId = searchParams.get('categoryId')
      ? Number(searchParams.get('categoryId'))
      : undefined;
    const page = searchParams.get('page')
      ? Number(searchParams.get('page'))
      : undefined;
    const size = searchParams.get('size')
      ? Number(searchParams.get('size'))
      : undefined;
    const sort = (searchParams.get('sort') as any) || undefined;

    const data = await getVuaViaProducts({ q, categoryId, page, size, sort });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
