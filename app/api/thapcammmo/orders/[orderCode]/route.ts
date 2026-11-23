import { NextResponse } from 'next/server';
import { getThapCamOrderDetail } from '@/lib/thapCamMmoService';

export async function GET(
  _request: Request,
  { params }: { params: { orderCode: string } }
) {
  try {
    const { orderCode } = params;
    if (!orderCode) {
      return NextResponse.json(
        { success: false, message: 'Thiếu orderCode' },
        { status: 400 }
      );
    }

    const data = await getThapCamOrderDetail(orderCode);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
