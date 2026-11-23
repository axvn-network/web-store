import { NextResponse } from 'next/server';
import { readCustomerDb, writeCustomerDb, PartnerApplication } from '@/lib/customerDb';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, contactName, phone, email, type = 'DISTRIBUTOR', address, website, description } = body;

    if (!companyName || !contactName || !phone || !email || !description) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ các thông tin liên hệ bắt buộc.' },
        { status: 400 }
      );
    }

    const db = readCustomerDb();

    const application: PartnerApplication = {
      id: `part-${Date.now()}`,
      type,
      companyName,
      contactName,
      phone,
      email,
      address: address || '',
      website,
      description,
      status: 'NEW',
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    db.partnerApplications.unshift(application);
    writeCustomerDb(db);

    return NextResponse.json({
      success: true,
      message: 'Hồ sơ hợp tác của quý đối tác đã được ghi nhận. Ban giám đốc Betashop sẽ liên hệ trong 24 giờ làm việc.',
      data: application,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
