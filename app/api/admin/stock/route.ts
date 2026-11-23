import { NextResponse } from 'next/server';
import { StockManager } from '@/lib/stockManager';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/stock?productId=...
 * Retrieves stock summary & recent stock items.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu tham số productId' },
        { status: 400 }
      );
    }

    const summary = await StockManager.getProductStockSummary(productId);
    return NextResponse.json({ success: true, data: summary });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/stock
 * Bulk import keys with AES-256-GCM encryption & SHA-256 deduplication.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rawKeys, batchId, variantId } = body;

    if (!productId || !rawKeys) {
      return NextResponse.json(
        { success: false, error: 'Thiếu productId hoặc danh sách keys' },
        { status: 400 }
      );
    }

    const result = await StockManager.bulkImportKeys(productId, rawKeys, batchId, variantId);

    return NextResponse.json({
      success: true,
      message: `Đã nhập thành công ${result.successCount}/${result.totalLines} keys (Trùng lặp: ${result.duplicateCount}, Lỗi: ${result.errorCount})`,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
