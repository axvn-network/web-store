import { NextResponse } from 'next/server';
import { cancelHupSmsZalo } from '@/lib/hupSmsService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Thiếu id đơn Zalo' },
        { status: 400 }
      );
    }

    const data = await cancelHupSmsZalo(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
