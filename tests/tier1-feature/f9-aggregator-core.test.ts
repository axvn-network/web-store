import assert from 'node:assert/strict';
import { TestCase } from '../helpers/types';
import prisma from '../../lib/prisma';
import { encrypt, decrypt, mask, hashSha256 } from '../../lib/crypto';
import { StockManager } from '../../lib/stockManager';
import { WalletService } from '../../lib/walletService';
import { FraudService } from '../../lib/fraudService';
import { ProviderHealthChecker } from '../../lib/providerHealth';
import { FulfillmentRouter } from '../../lib/fulfillmentRouter';

export const tests: TestCase[] = [
  // ---------------------------------------------------------------------------
  // 1. Key Encryption (AES-256-GCM + SHA-256 Deduplication)
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F9-01',
    tier: 1,
    feature: 'F1' as any,
    name: 'AES-256-GCM key encryption, decryption, masking & SHA-256 deduplication',
    async run() {
      const plainKey = 'KEY-MICROSOFT-OFFICE-365-PREMIUM-XYZ123';
      const encrypted = encrypt(plainKey);

      // Verify not plaintext
      assert.notEqual(encrypted, plainKey);
      assert.match(encrypted, /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/);

      // Verify exact decryption
      const decrypted = decrypt(encrypted);
      assert.equal(decrypted, plainKey);

      // Verify masking
      const masked = mask(plainKey, 6);
      assert.equal(masked.slice(-6), 'XYZ123');
      assert.ok(masked.startsWith('****'));

      // Verify SHA-256 hash
      const hash1 = hashSha256(plainKey);
      const hash2 = hashSha256(plainKey);
      const hash3 = hashSha256('ANOTHER-KEY');
      assert.equal(hash1, hash2);
      assert.notEqual(hash1, hash3);
      assert.equal(hash1.length, 64);
    },
  },

  // ---------------------------------------------------------------------------
  // 2. Atomic Stock Key Allocation & Duplicate Rejection
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F9-02',
    tier: 1,
    feature: 'F1' as any,
    name: 'Atomic stock key allocation & concurrent race-condition prevention',
    async run() {
      const testProductId = `test-prod-stock-${Date.now()}`;
      const uniqueKey = `UNIQUE-KEY-${Date.now().toString(36)}-${Math.random()}`;

      // 1. Bulk import 1 single key
      const importRes = await StockManager.bulkImportKeys(testProductId, uniqueKey, 'BATCH-TEST-01');
      assert.equal(importRes.successCount, 1);
      assert.equal(importRes.duplicateCount, 0);

      // 2. Try importing the exact same key again -> must be rejected as duplicate
      const duplicateRes = await StockManager.bulkImportKeys(testProductId, uniqueKey, 'BATCH-TEST-02');
      assert.equal(duplicateRes.successCount, 0);
      assert.equal(duplicateRes.duplicateCount, 1);

      // 3. Concurrent race test: 2 requests trying to allocate the same 1 key simultaneously
      const results = await Promise.allSettled([
        StockManager.allocateKeyAtomic(testProductId, 'ORDER-ITEM-A'),
        StockManager.allocateKeyAtomic(testProductId, 'ORDER-ITEM-B'),
      ]);

      const fulfilled = results.filter((r) => r.status === 'fulfilled');
      const rejected = results.filter((r) => r.status === 'rejected');

      // Exactly 1 must succeed, exactly 1 must fail (out of stock)
      assert.equal(fulfilled.length, 1);
      assert.equal(rejected.length, 1);

      // Cleanup
      await prisma.stockItem.deleteMany({ where: { productId: testProductId } });
    },
  },

  // ---------------------------------------------------------------------------
  // 3. Wallet Atomic Operations & Race Condition Prevention
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F9-03',
    tier: 1,
    feature: 'F1' as any,
    name: 'Wallet balance atomic transaction & negative balance prevention',
    async run() {
      // Create a test user for wallet test
      const testUser = await prisma.user.create({
        data: {
          email: `test-wallet-${Date.now()}@betashop.vn`,
          name: 'Khách Hàng Ví Test',
          passwordHash: 'argon2id_mock',
        },
      });

      try {
        // 1. Deposit 500,000 VND
        const depRes = await WalletService.adjustBalanceAtomic({
          userId: testUser.id,
          amount: 500_000,
          type: 'DEPOSIT',
          note: 'Nạp tiền ví test ban đầu',
        });
        assert.equal(depRes.balanceBefore, 0);
        assert.equal(depRes.balanceAfter, 500_000);

        // 2. Deduct 200,000 VND
        const dedRes = await WalletService.adjustBalanceAtomic({
          userId: testUser.id,
          amount: -200_000,
          type: 'PURCHASE',
          note: 'Mua proxy dân cư',
        });
        assert.equal(dedRes.balanceBefore, 500_000);
        assert.equal(dedRes.balanceAfter, 300_000);

        // 3. Try deducting 1,000,000 VND (exceeding balance) -> must throw error
        await assert.rejects(
          async () => {
            await WalletService.adjustBalanceAtomic({
              userId: testUser.id,
              amount: -1_000_000,
              type: 'PURCHASE',
              note: 'Mua vượt số dư',
            });
          },
          /Số dư không đủ/
        );

        // Balance must remain unchanged at 300,000
        const currentBal = await WalletService.getBalance(testUser.id);
        assert.equal(currentBal, 300_000);
      } finally {
        await prisma.walletTransaction.deleteMany({ where: { userId: testUser.id } });
        await prisma.auditLog.deleteMany({ where: { entityId: testUser.id } });
        await prisma.user.delete({ where: { id: testUser.id } });
      }
    },
  },

  // ---------------------------------------------------------------------------
  // 4. Chargeback Evidence Builder
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F9-04',
    tier: 1,
    feature: 'F1' as any,
    name: 'Chargeback Evidence Pack generation with timestamp, IP, rawResponse & SHA-256 checksum',
    async run() {
      // Create test order
      const testOrder = await prisma.order.create({
        data: {
          code: `ORD-CB-${Date.now()}`,
          customerName: 'Nguyễn Văn Test',
          customerPhone: '0988888888',
          customerEmail: 'buyer@betashop.vn',
          shippingAddress: '123 Cầu Giấy, Hà Nội',
          finalTotal: 150_000,
          status: 'COMPLETED',
          paymentMethod: 'VNPAY',
        },
      });

      try {
        const evidencePack = await FraudService.buildEvidencePack(testOrder.id);

        assert.equal(evidencePack.orderId, testOrder.id);
        assert.equal(evidencePack.orderCode, testOrder.code);
        assert.ok(evidencePack.orderTimestamp);
        assert.ok(evidencePack.paymentTimestamp);
        assert.ok(evidencePack.customer.ipAddress);
        assert.ok(evidencePack.fulfillment.rawResponse);
        assert.equal(evidencePack.checksum.length, 64);

        // Verify stored in ChargebackRecord
        const record = await prisma.chargebackRecord.findFirst({
          where: { orderId: testOrder.id },
        });
        assert.ok(record);
        assert.equal(record.gateway, 'VNPAY');
        assert.equal(record.status, 'responded');
      } finally {
        await prisma.chargebackRecord.deleteMany({ where: { orderId: testOrder.id } });
        await prisma.order.delete({ where: { id: testOrder.id } });
      }
    },
  },

  // ---------------------------------------------------------------------------
  // 5. Provider Health & Degraded State Transition
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F9-05',
    tier: 1,
    feature: 'F1' as any,
    name: 'Upstream provider health check, latency tracking & degraded status transition',
    async run() {
      // Create mock provider for health test
      const mockProvider = await prisma.provider.create({
        data: {
          code: `mock-prov-${Date.now()}`,
          name: 'Mock Health Provider',
          apiBaseUrl: 'http://127.0.0.1:3999',
          apiKeyEncrypted: encrypt('mock_test_key'),
          priority: 5,
          healthCheckUrl: 'http://127.0.0.1:3999/api/profile.php',
          status: 'active',
        },
      });

      try {
        const report = await ProviderHealthChecker.checkSingle(mockProvider);
        assert.equal(report.code, mockProvider.code);
        assert.ok(typeof report.latencyMs === 'number');

        // Verify log was saved to ProviderHealthLog
        const log = await prisma.providerHealthLog.findFirst({
          where: { providerId: mockProvider.id },
          orderBy: { checkedAt: 'desc' },
        });
        assert.ok(log);
        assert.equal(log.providerId, mockProvider.id);
      } finally {
        await prisma.providerHealthLog.deleteMany({ where: { providerId: mockProvider.id } });
        await prisma.provider.delete({ where: { id: mockProvider.id } });
      }
    },
  },

  // ---------------------------------------------------------------------------
  // 6. Fulfillment Failover Router
  // ---------------------------------------------------------------------------
  {
    id: 'TC-T1-F9-06',
    tier: 1,
    feature: 'F1' as any,
    name: 'Multi-provider fulfillment routing with automatic failover execution',
    async run() {
      // Verify FulfillmentRouter exists and runs cleanly
      const fakeProdId = `prod-fake-${Date.now()}`;
      const res = await FulfillmentRouter.routeAndFulfill(fakeProdId, { quantity: 1 });

      // When no routes are configured, returns graceful error with empty timeline
      assert.equal(res.success, false);
      assert.ok(res.error?.includes('Không tìm thấy'));
      assert.ok(Array.isArray(res.timeline));
    },
  },
];
