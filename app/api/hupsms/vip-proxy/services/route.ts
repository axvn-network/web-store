import { NextResponse } from 'next/server';
import { getHupSmsVipProxyServices } from '@/lib/hupSmsService';

export async function GET() {
  try {
    const data = await getHupSmsVipProxyServices();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
