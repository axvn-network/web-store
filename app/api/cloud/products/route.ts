import { NextResponse } from 'next/server';
import { XvpsApiService } from '@/lib/xvpsApi';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const products = await XvpsApiService.getProducts(category);

    return NextResponse.json({
      success: true,
      data: products,
      categories: [
        { id: 'all', name: 'Tất cả dịch vụ Cloud', count: products.length },
        { id: 'cloud-hosting', name: 'Cloud Hosting NVMe', count: products.filter((p) => p.category === 'cloud-hosting').length },
        { id: 'vps-vmware', name: 'VPS VMware Enterprise', count: products.filter((p) => p.category === 'vps-vmware').length },
        { id: 'vps-kvm', name: 'Cloud VPS KVM Cao Cấp', count: products.filter((p) => p.category === 'vps-kvm').length },
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
