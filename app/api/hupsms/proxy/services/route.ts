import { NextResponse } from 'next/server';
import { getHupSmsProxyServices } from '@/lib/hupSmsService';

export async function GET() {
  try {
    const data = await getHupSmsProxyServices();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
