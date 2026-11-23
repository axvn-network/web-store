import { NextResponse } from 'next/server';
import { getTaiKhoanProfile } from '@/lib/taiKhoanService';

export async function GET() {
  try {
    const profile = await getTaiKhoanProfile();
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'warning',
        msg: error.message || 'Không thể lấy thông tin tài khoản đối tác',
        data: {
          username: 'hoangbom98',
          money: '0.00',
          notice: 'Để kết nối trực tiếp từ Netlify, hãy để trống hoặc cấu hình IP Whitelist trên taikhoan.site/client/document-api',
        },
      },
      { status: 200 }
    );
  }
}
