import { NextResponse } from 'next/server';
import { XvpsApiService } from '@/lib/xvpsApi';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const vpsList = await XvpsApiService.getListVps();
    return NextResponse.json({ success: true, data: vpsList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
