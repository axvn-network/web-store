import { NextResponse } from 'next/server';
import { getThanhPlusUserInfo } from '@/lib/thanhPlusService';

export async function GET() {
  try {
    const data = await getThanhPlusUserInfo();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', msg: error.message },
      { status: 500 }
    );
  }
}
