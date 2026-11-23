import { NextResponse } from 'next/server';
import { XvpsApiService } from '@/lib/xvpsApi';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, ...extraParams } = body;

    if (!['start', 'stop', 'restart', 'rebuild', 'renew'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Hành động không hợp lệ.' }, { status: 400 });
    }

    const result = await XvpsApiService.actionVps(id, action, extraParams);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
