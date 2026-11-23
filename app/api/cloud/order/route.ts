import { NextResponse } from 'next/server';
import { XvpsApiService } from '@/lib/xvpsApi';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, osId, hostname, cycle = '1_month', rootPassword, customerName, customerPhone, customerEmail } = body;

    if (!planId) {
      return NextResponse.json({ success: false, error: 'Vui lòng chọn gói dịch vụ.' }, { status: 400 });
    }

    if (!customerPhone && !customerEmail) {
      return NextResponse.json({ success: false, error: 'Vui lòng cung cấp số điện thoại hoặc email nhận thông tin máy chủ.' }, { status: 400 });
    }

    const result = await XvpsApiService.createOrder({
      planId,
      osId,
      hostname: hostname || 'cloud.betashop.vn',
      cycle,
      rootPassword,
      customerName: customerName || 'Khách hàng VIP',
      customerPhone: customerPhone || '0901234567',
      customerEmail,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
