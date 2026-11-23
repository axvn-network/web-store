import { NextResponse } from 'next/server';
import { FraudService } from '@/lib/fraudService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/orders/[id]/evidence
 * Exports the Chargeback Evidence Pack for an order to submit to payment gateways.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const evidencePack = await FraudService.buildEvidencePack(id);

    return NextResponse.json({
      success: true,
      data: evidencePack,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
