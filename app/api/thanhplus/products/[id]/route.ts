import { NextResponse } from 'next/server';
import { getThanhPlusProductDetail } from '@/lib/thanhPlusService';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { status: 'error', msg: 'Thiếu id sản phẩm' },
        { status: 400 }
      );
    }

    const data = await getThanhPlusProductDetail(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', msg: error.message },
      { status: 500 }
    );
  }
}
