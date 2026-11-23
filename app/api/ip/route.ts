import { NextResponse } from 'next/server';

export async function GET() {
  try {
    let ip = '';
    try {
      const res = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
      const data = await res.json();
      ip = data.ip;
    } catch {
      const res2 = await fetch('https://ifconfig.me/ip', { cache: 'no-store' });
      ip = (await res2.text()).trim();
    }

    return NextResponse.json({
      status: 'success',
      ip,
      clientDoc: 'https://taikhoan.site/client/document-api',
      note: 'Dùng IP này để gán vào mục Danh sách IP Whitelist trên taikhoan.site nếu bạn muốn giới hạn truy cập. Nếu để trống trên taikhoan.site, hệ thống cho phép tất cả IP truy cập bằng API Key.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
