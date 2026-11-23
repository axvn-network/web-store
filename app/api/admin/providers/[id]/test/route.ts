import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProviderHealthChecker } from '@/lib/providerHealth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/providers/[id]/test
 * Tests live connection, measures latency, and returns health status & balance.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const provider = await prisma.provider.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
    });

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy nhà cung cấp' },
        { status: 404 }
      );
    }

    const report = await ProviderHealthChecker.checkSingle(provider);

    return NextResponse.json({
      success: report.isSuccess,
      message: report.isSuccess
        ? `Kết nối thành công tới ${provider.name} (Độ trễ: ${report.latencyMs}ms)`
        : `Kết nối thất bại tới ${provider.name} (${report.errorMessage})`,
      data: report,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
