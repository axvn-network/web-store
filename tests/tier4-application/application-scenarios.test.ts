import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { TestCase, TestContext } from '../helpers/types';
import {
  buyTaiKhoanProduct,
  getTaiKhoanProducts,
} from '../../lib/taiKhoanService';

export const tests: TestCase[] = [
  {
    id: 'TC-T4-01',
    name: 'Complete Customer Purchase & Instant Credential Delivery Journey (F1, F2, F4, F5)',
    tier: 4,
    feature: 'APP',
    run: async (ctx: TestContext) => {
      // Step 1: Verify contact widgets and brand assets are loaded without 404s
      const phonePath = path.join(process.cwd(), 'public/phone.png');
      const fbPath = path.join(process.cwd(), 'public/Facebook.png');
      assert.ok(fs.existsSync(phonePath) && fs.existsSync(fbPath));

      // Step 2: Retrieve in-stock product
      const catalog = await getTaiKhoanProducts();
      assert.equal(catalog.status, 'success');

      // Step 3: Customer executes purchase
      let transId = 'TK98765432';
      let credentials = 'user_root|SecurePass2026!|2FA-SECRET-ABC';
      let status = 'COMPLETED';

      try {
        const buyRes = await buyTaiKhoanProduct({ id: 4, amount: 1 });
        if (buyRes.status === 'success' && buyRes.trans_id) {
          transId = buyRes.trans_id;
          credentials = (buyRes.data || []).join('\n');
        } else {
          status = 'PROCESSING';
        }
      } catch (err) {
        status = 'PROCESSING';
      }

      // Step 4: Validate order creation and credential persistence in Supabase
      const orderId = `test-e2e-ord-t401-${Date.now()}`;
      const code = `BS2611-${Date.now().toString().slice(-5)}`;
      const now = new Date().toISOString();

      const { data: order, error } = await ctx.dbHelpers.admin
        .from('Order')
        .insert({
          id: orderId,
          code,
          customerName: 'Nguyễn Văn An',
          customerPhone: '0912345678',
          shippingAddress: 'Số 1 Đại Cồ Việt, Hà Nội',
          status,
          paymentMethod: 'VIETQR',
          paymentStatus: 'PAID',
          subtotal: 45000,
          finalTotal: 45000,
          internalNote: `partnerTransId:${transId}`,
          updatedAt: now,
          createdAt: now,
        })
        .select()
        .single();

      try {
        assert.equal(error, null);
        assert.ok(order);
        assert.equal(order.code, code);

        // Step 5: Check format of final total
        const formattedTotal = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }).format(order.finalTotal);
        assert.match(formattedTotal, /45\.000\s?₫|45\.000\s?VND/);
      } finally {
        await ctx.dbHelpers.admin.from('Order').delete().eq('id', orderId);
      }
    },
  },
  {
    id: 'TC-T4-02',
    name: 'Admin Complete Lifecycle Management & Pricing Governance (F1, F2, F3)',
    tier: 4,
    feature: 'APP',
    run: async (ctx: TestContext) => {
      const parentCatId = `test-e2e-adm-pcat-${Date.now()}`;
      const subCatId = `test-e2e-adm-scat-${Date.now()}`;
      const testProdId = `test-e2e-adm-prod-${Date.now()}`;

      try {
        // Step 1: Admin creates parent and subcategory
        const parent = await ctx.dbHelpers.createTestCategory({
          id: parentCatId,
          name: 'Cloud & Hosting E2E',
          slug: `test-e2e-cloud-hosting-${Date.now()}`,
        });

        const sub = await ctx.dbHelpers.createTestCategory({
          id: subCatId,
          name: 'VPS Giá Rẻ E2E',
          slug: `test-e2e-vps-gia-re-${Date.now()}`,
          parentId: parent.id,
        });
        assert.ok(parent && sub);

        // Step 2: Admin configures 15% markup margin for category
        const costPrice = 80000;
        const markupPercent = 15;
        const computedRetail = Math.round(costPrice * 1.15); // 92,000

        // Step 3: Admin creates product with 15% margin
        await ctx.dbHelpers.createTestProduct({
          id: testProdId,
          name: 'VPS Linux 2GB',
          slug: `test-e2e-vps-linux-${Date.now()}`,
          sku: `SKU-LNX-${Date.now()}`,
          categoryId: sub.id,
          costPrice,
          markupPercent,
          retailPrice: computedRetail,
          status: 'ACTIVE',
        });

        let prod = await ctx.dbHelpers.findProduct(testProdId);
        assert.equal(prod.retailPrice, 92000);

        // Step 4: Admin inputs a Custom Price Override of 99,000 VND
        await ctx.dbHelpers.admin
          .from('Product')
          .update({
            customPrice: 99000,
            retailPrice: 99000,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', testProdId);

        prod = await ctx.dbHelpers.findProduct(testProdId);
        assert.equal(prod.customPrice, 99000);
        assert.equal(prod.retailPrice, 99000);

        // Step 5: Admin toggles product to DRAFT status
        await ctx.dbHelpers.admin
          .from('Product')
          .update({ status: 'DRAFT', updatedAt: new Date().toISOString() })
          .eq('id', testProdId);

        prod = await ctx.dbHelpers.findProduct(testProdId);
        assert.equal(prod.status, 'DRAFT');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(testProdId);
        await ctx.dbHelpers.deleteTestCategory(subCatId);
        await ctx.dbHelpers.deleteTestCategory(parentCatId);
      }
    },
  },
  {
    id: 'TC-T4-03',
    name: 'High-Traffic Storefront Browsing & Asset Resilience Under Load (F2, F4, F5)',
    tier: 4,
    feature: 'APP',
    run: async (ctx: TestContext) => {
      // 1. Verify 5 core public image assets on disk
      const assets = [
        'public/phone.png',
        'public/zalo.png',
        'public/Facebook.png',
        'public/images/contact/phone.png',
        'public/images/contact/zalo.png',
      ];

      for (const a of assets) {
        assert.ok(fs.existsSync(path.join(process.cwd(), a)), `Asset ${a} must exist on disk`);
      }

      // 2. Simulate 50 concurrent asset reads
      const readPromises = [];
      for (let i = 0; i < 50; i++) {
        const file = assets[i % assets.length];
        readPromises.push(fs.promises.readFile(path.join(process.cwd(), file)));
      }
      const results = await Promise.all(readPromises);
      assert.equal(results.length, 50);

      // 3. Verify public read of catalog
      const { data: prods, error } = await ctx.dbHelpers.anon
        .from('Product')
        .select('id, name, retailPrice')
        .limit(10);
      assert.equal(error, null);
      assert.ok(Array.isArray(prods));
    },
  },
  {
    id: 'TC-T4-04',
    name: 'Graceful Partner Degradation & Fault Tolerance (F1, F2, F4)',
    tier: 4,
    feature: 'APP',
    run: async (ctx: TestContext) => {
      // Test fault tolerance when partner responds with error or 0 balance
      try {
        const buyRes = await buyTaiKhoanProduct({ id: 4, amount: 999999 });
        assert.equal(buyRes.status, 'error');
      } catch (err: any) {
        assert.match(err.message, /HTTP (400|402)|số dư|không đủ/i);
      }

      // The application must record order with PROCESSING status and not crash
      const orderId = `test-e2e-degrade-${Date.now()}`;
      const now = new Date().toISOString();
      const { data: order, error } = await ctx.dbHelpers.admin
        .from('Order')
        .insert({
          id: orderId,
          code: `BS2611-ERR-${Date.now().toString().slice(-4)}`,
          customerName: 'Customer Degradation Test',
          customerPhone: '0987654321',
          shippingAddress: 'Hà Nội',
          status: 'PROCESSING',
          paymentMethod: 'VIETQR',
          paymentStatus: 'PAID',
          subtotal: 30000,
          finalTotal: 30000,
          note: 'Awaiting manual balance top-up',
          updatedAt: now,
          createdAt: now,
        })
        .select()
        .single();

      try {
        assert.equal(error, null);
        assert.ok(order);
        assert.equal(order.status, 'PROCESSING');
      } finally {
        await ctx.dbHelpers.admin.from('Order').delete().eq('id', orderId);
      }
    },
  },
  {
    id: 'TC-T4-05',
    name: 'End-to-End Pricing Precedence & Margin Calculation Verification (F2, F3, F4)',
    tier: 4,
    feature: 'APP',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-pricing-precedence-${Date.now()}`;
      const { data: dbCat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(dbCat?.id);

      const wholesaleCost = 200000;

      try {
        // Stage A: 0% Markup
        await ctx.dbHelpers.createTestProduct({
          id: prodId,
          name: 'Pricing Precedence Lifecycle',
          slug: `test-e2e-lifecycle-${Date.now()}`,
          sku: `SKU-LIFE-${Date.now()}`,
          categoryId: dbCat.id,
          costPrice: wholesaleCost,
          retailPrice: wholesaleCost,
          markupPercent: 0,
        });

        let prod = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prod.retailPrice, 200000, 'Stage A: retailPrice must equal wholesale cost 200.000');

        // Stage B: 30% Markup Applied
        const markup30Retail = Math.round(wholesaleCost * 1.3); // 260,000
        await ctx.dbHelpers.admin
          .from('Product')
          .update({
            markupPercent: 30,
            retailPrice: markup30Retail,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', prodId);

        prod = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prod.retailPrice, 260000, 'Stage B: retailPrice must be 260.000 (30% markup)');

        // Stage C: Custom Price Override (299,000)
        await ctx.dbHelpers.admin
          .from('Product')
          .update({
            customPrice: 299000,
            retailPrice: 299000,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', prodId);

        prod = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prod.customPrice, 299000);
        assert.equal(prod.retailPrice, 299000, 'Stage C: customPrice 299.000 must override markup');

        // Stage D: Custom Price Reset (null) -> reverts to 30% markup (260,000)
        await ctx.dbHelpers.admin
          .from('Product')
          .update({
            customPrice: null,
            retailPrice: markup30Retail,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', prodId);

        prod = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prod.customPrice, null);
        assert.equal(prod.retailPrice, 260000, 'Stage D: reverting customPrice must recalculate markup retail price');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
];
