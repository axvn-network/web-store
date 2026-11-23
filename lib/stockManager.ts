import prisma from './prisma';
import { encrypt, decrypt, hashSha256, mask } from './crypto';

export interface BulkImportResult {
  totalLines: number;
  successCount: number;
  duplicateCount: number;
  errorCount: number;
  batchId: string;
  errors: string[];
}

export interface AllocatedKeyResult {
  stockItemId: string;
  decryptedPayload: string;
  batchId?: string | null;
}

/**
 * Atomic Stock Item Manager
 * Manages key/account storage with AES-256-GCM encryption and SHA-256 hash deduplication.
 */
export class StockManager {
  /**
   * Bulk import keys/accounts for a product from raw text lines.
   * Auto-encrypts each key with AES-256-GCM and deduplicates using SHA-256 hash.
   */
  static async bulkImportKeys(
    productId: string,
    rawKeysText: string,
    batchId?: string,
    variantId?: string
  ): Promise<BulkImportResult> {
    const lines = rawKeysText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const generatedBatchId = batchId || `BATCH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Pre-fetch existing hashes for quick deduplication check
    const existingItems = await prisma.stockItem.findMany({
      select: { payloadHash: true },
    });
    const existingHashSet = new Set(existingItems.map((i) => i.payloadHash));

    for (const [index, line] of lines.entries()) {
      try {
        const hash = hashSha256(line);

        if (existingHashSet.has(hash)) {
          duplicateCount++;
          errors.push(`Dòng ${index + 1}: Trùng lặp key (hash: ${hash.slice(0, 8)}...)`);
          continue;
        }

        const encrypted = encrypt(line);

        await prisma.stockItem.create({
          data: {
            productId,
            variantId: variantId || null,
            encryptedPayload: encrypted,
            payloadHash: hash,
            status: 'available',
            batchId: generatedBatchId,
          },
        });

        existingHashSet.add(hash);
        successCount++;
      } catch (err: any) {
        errorCount++;
        errors.push(`Dòng ${index + 1}: Lỗi lưu key (${err.message})`);
      }
    }

    return {
      totalLines: lines.length,
      successCount,
      duplicateCount,
      errorCount,
      batchId: generatedBatchId,
      errors,
    };
  }

  /**
   * Atomically allocates an available key for an order item using Prisma transactions.
   * Prevents race condition / double-selling.
   */
  static async allocateKeyAtomic(
    productId: string,
    orderItemId: string
  ): Promise<AllocatedKeyResult> {
    return await prisma.$transaction(async (tx) => {
      // Find one available key
      const availableItem = await tx.stockItem.findFirst({
        where: {
          productId,
          status: 'available',
        },
        orderBy: { createdAt: 'asc' },
      });

      if (!availableItem) {
        throw new Error('Sản phẩm đã hết hàng trong kho key nội bộ');
      }

      // Mark reserved/delivered atomically
      const updated = await tx.stockItem.update({
        where: { id: availableItem.id },
        data: {
          status: 'delivered',
          orderItemId,
          deliveredAt: new Date(),
        },
      });

      const decryptedPayload = decrypt(updated.encryptedPayload);

      return {
        stockItemId: updated.id,
        decryptedPayload,
        batchId: updated.batchId,
      };
    });
  }

  /**
   * Retrieves stock overview by product ID with masked payloads.
   */
  static async getProductStockSummary(productId: string) {
    const items = await prisma.stockItem.findMany({
      where: { productId },
      select: {
        id: true,
        productId: true,
        status: true,
        batchId: true,
        deliveredAt: true,
        createdAt: true,
        encryptedPayload: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const counts = await prisma.stockItem.groupBy({
      by: ['status'],
      where: { productId },
      _count: { status: true },
    });

    const statusMap: Record<string, number> = {
      available: 0,
      reserved: 0,
      delivered: 0,
      invalid: 0,
      refunded: 0,
    };

    for (const c of counts) {
      statusMap[c.status] = c._count.status;
    }

    return {
      available: statusMap.available,
      delivered: statusMap.delivered,
      reserved: statusMap.reserved,
      total: items.length,
      recentItems: items.map((i) => ({
        id: i.id,
        status: i.status,
        batchId: i.batchId,
        maskedKey: mask(decrypt(i.encryptedPayload)),
        createdAt: i.createdAt,
        deliveredAt: i.deliveredAt,
      })),
    };
  }
}
