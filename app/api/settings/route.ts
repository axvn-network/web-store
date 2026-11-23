import { NextResponse } from 'next/server';
import { readAdminDb } from '@/lib/adminDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readAdminDb();
    const settings: any = db.settings || {};
    return NextResponse.json({
      success: true,
      data: {
        storeName: settings.storeName || 'BETASHOP – TỔNG KHO ĐỒ GIA DỤNG VIỆT NAM',
        hotline: settings.hotline || '1900 8237',
        email: settings.email || 'cskh@betashop.vn',
        address: settings.address || 'Số 18 đường Phạm Hùng, P. Mỹ Đình 2, Q. Nam Từ Liêm, TP. Hà Nội',
        bankName: settings.bankName || 'Vietcombank',
        bankAccount: settings.bankAccount || '9999 8888 6666',
        bankAccountName: settings.bankAccountName || 'CONG TY CO PHAN BETASHOP VIET NAM',
        primaryColor: settings.primaryColor || '#f53d2d',
        themePreset: settings.themePreset || 'orange',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      data: {
        storeName: 'BETASHOP – TỔNG KHO ĐỒ GIA DỤNG VIỆT NAM',
        hotline: '1900 8237',
        primaryColor: '#f53d2d',
        themePreset: 'orange',
      },
    });
  }
}
