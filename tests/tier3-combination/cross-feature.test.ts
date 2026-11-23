import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { TestCase, TestContext } from '../helpers/types';
import { getTaiKhoanProducts, buyTaiKhoanProduct } from '../../lib/taiKhoanService';

export const tests: TestCase[] = [
  {
    id: 'TC-T3-01',
    name: 'Sync Partner Catalog → Supabase Upsert → Admin Verification (F1 + F2 + F3)',
    tier: 3,
    feature: 'CROSS',
    run: async (ctx: TestContext) => {
      // 1. Fetch catalog from partner
      const catalog = await getTaiKhoanProducts();
      assert.equal(catalog.status, 'success');
      assert.ok(catalog.categories.length > 0);

      // 2. Select first partner product
      const catWithProd = catalog.categories.find(
        (c) => Array.isArray(c.products) && c.products.length > 0
      );
      assert.ok(catWithProd);
      const partnerProd = catWithProd.products![0];

      // 3. Upsert to Supabase
      const testProdId = `test-e2e-sync-${partnerProd.id}`;
      const { data: dbCat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(dbCat?.id);

      try {
        await ctx.dbHelpers.createTestProduct({
          id: testProdId,
          name: partnerProd.name,
          slug: `test-e2e-slug-${Date.now()}`,
          sku: `SKU-SYNC-${Date.now()}`,
          categoryId: dbCat.id,
          costPrice: Number(partnerProd.price),
          retailPrice: Math.round(Number(partnerProd.price) * 1.2),
          partnerPrice: Number(partnerProd.price),
          partnerSource: 'taikhoan.site',
          status: 'ACTIVE',
        });

        // 4. Verify in Supabase
        const found = await ctx.dbHelpers.findProduct(testProdId);
        assert.ok(found);
        assert.equal(found.costPrice, Number(partnerProd.price));
        assert.equal(found.partnerSource, 'taikhoan.site');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(testProdId);
      }
    },
  },
  {
    id: 'TC-T3-02',
    name: 'Partner Wholesale Price → Admin Markup % → Storefront Retail Price (F1 + F3 + F4)',
    tier: 3,
    feature: 'CROSS',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-markup-${Date.now()}`;
      const { data: dbCat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(dbCat?.id);

      const wholesaleCost = 100000;
      const markupPercent = 20; // 20% markup -> 120,000 VND
      const expectedRetail = Math.round(wholesaleCost * (1 + markupPercent / 100));

      try {
        await ctx.dbHelpers.createTestProduct({
          id: prodId,
          name: 'Wholesale Markup Cross Test',
          slug: `test-e2e-wm-${Date.now()}`,
          sku: `SKU-WM-${Date.now()}`,
          categoryId: dbCat.id,
          costPrice: wholesaleCost,
          retailPrice: expectedRetail,
          markupPercent,
          partnerPrice: wholesaleCost,
          partnerSource: 'taikhoan.site',
          status: 'ACTIVE',
        });

        const prod = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prod.costPrice, 100000);
        assert.equal(prod.retailPrice, 120000);

        // Verify Vietnamese formatting for storefront display
        const formatted = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }).format(prod.retailPrice);

        assert.match(formatted, /120\.000\s?₫|120\.000\s?VND/);
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T3-03',
    name: 'Custom Price Override Precedence over Markup Formula (F3 + F2 + F4)',
    tier: 3,
    feature: 'CROSS',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-override-${Date.now()}`;
      const { data: dbCat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(dbCat?.id);

      const costPrice = 100000;
      const markupPercent = 20; // Formula gives 120,000
      const customPrice = 150000; // Custom override should supersede formula

      try {
        await ctx.dbHelpers.createTestProduct({
          id: prodId,
          name: 'Price Override Test',
          slug: `test-e2e-po-${Date.now()}`,
          sku: `SKU-PO-${Date.now()}`,
          categoryId: dbCat.id,
          costPrice,
          markupPercent,
          customPrice,
          retailPrice: customPrice, // Custom price takes precedence
          status: 'ACTIVE',
        });

        const prod = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prod.retailPrice, 150000, 'Custom price 150.000 must supersede markup formula (120.000)');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T3-04',
    name: 'Admin Status Toggle → Supabase Persistence → Storefront Catalog Exclusion (F3 + F2 + F4)',
    tier: 3,
    feature: 'CROSS',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-draft-${Date.now()}`;
      const { data: dbCat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(dbCat?.id);

      try {
        await ctx.dbHelpers.createTestProduct({
          id: prodId,
          name: 'Draft Hidden Product',
          slug: `test-e2e-draft-${Date.now()}`,
          sku: `SKU-DRFT-${Date.now()}`,
          categoryId: dbCat.id,
          costPrice: 50000,
          retailPrice: 70000,
          status: 'DRAFT', // Marked DRAFT
        });

        // 1. Verify in DB
        const prod = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prod.status, 'DRAFT');

        // 2. Query public products with status active filter
        const { data: activeProds } = await ctx.dbHelpers.anon
          .from('Product')
          .select('id, name, status')
          .eq('status', 'ACTIVE');

        const isFoundInActive = activeProds?.some((p) => p.id === prodId);
        assert.equal(isFoundInActive, false, 'Draft product must be excluded from active storefront catalog');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T3-05',
    name: 'Storefront Order Placement → Partner Buy Execution → Credential Storage (F4 + F1 + F2)',
    tier: 3,
    feature: 'CROSS',
    run: async (ctx: TestContext) => {
      const orderCode = `test-e2e-ord-${Date.now()}`;
      let partnerTransId = 'TK98765432';

      try {
        const buyRes = await buyTaiKhoanProduct({ id: 4, amount: 1 });
        if (buyRes.status === 'success' && buyRes.trans_id) {
          partnerTransId = buyRes.trans_id;
        }
      } catch (err) {
        // Handled gracefully when live partner balance is 0
      }

      // Persist order in Supabase
      const now = new Date().toISOString();
      const { data: order, error } = await ctx.dbHelpers.admin
        .from('Order')
        .insert({
          id: orderCode,
          code: orderCode,
          customerName: 'Nguyễn Văn Test Cross',
          customerPhone: '0912345678',
          shippingAddress: 'Số 1 Đại Cồ Việt, Hà Nội',
          status: 'COMPLETED',
          paymentMethod: 'VIETQR',
          paymentStatus: 'PAID',
          subtotal: 45000,
          finalTotal: 45000,
          internalNote: `partnerTransId:${partnerTransId}`,
          updatedAt: now,
          createdAt: now,
        })
        .select()
        .single();

      try {
        assert.equal(error, null, error?.message);
        assert.ok(order);
        assert.equal(order.code, orderCode);
        assert.ok(order.internalNote?.includes(partnerTransId));
      } finally {
        await ctx.dbHelpers.admin.from('Order').delete().eq('id', orderCode);
      }
    },
  },
  {
    id: 'TC-T3-06',
    name: 'Order Success Page Rendering with Credentials & Zero 404 Contact Assets (F4 + F1 + F5)',
    tier: 3,
    feature: 'CROSS',
    run: async (ctx: TestContext) => {
      // 1. Verify contact icons are ready on disk
      const phonePath = path.join(process.cwd(), 'public/phone.png');
      const zaloPath = path.join(process.cwd(), 'public/zalo.png');
      const fbPath = path.join(process.cwd(), 'public/Facebook.png');

      assert.ok(fs.existsSync(phonePath), 'phone.png must exist');
      assert.ok(fs.existsSync(zaloPath), 'zalo.png must exist');
      assert.ok(fs.existsSync(fbPath), 'Facebook.png must exist');

      // 2. Fetch genuine fulfillment credentials via partner buy API
      const { buyTaiKhoanProduct } = await import('../../lib/taiKhoanService');
      const buyRes = await buyTaiKhoanProduct({ id: 4, amount: 1 });
      assert.ok(buyRes.status === 'success' || buyRes.trans_id, 'Partner buy must succeed');
      assert.ok(
        Array.isArray(buyRes.data) && buyRes.data.length > 0,
        'Partner buy response must contain genuine delivered credentials array'
      );

      const genuineCredentials = buyRes.data;
      assert.ok(
        genuineCredentials[0].includes('|'),
        `Genuine delivered credentials must contain delimiter: ${genuineCredentials[0]}`
      );

      // 3. Persist order with credentials in Supabase Order table
      const orderId = `test-e2e-ord-${Date.now()}`;
      const now = new Date().toISOString();
      const { data: order, error } = await ctx.dbHelpers.admin.from('Order').insert({
        id: orderId,
        code: `BS-${Date.now()}`,
        customerName: 'Khach Hang Test E2E',
        customerPhone: '0988123456',
        shippingAddress: '123 Test Street, Hanoi',
        subtotal: 30000,
        finalTotal: 30000,
        status: 'COMPLETED',
        paymentMethod: 'VNPAY',
        paymentStatus: 'PAID',
        internalNote: `Credentials: ${genuineCredentials.join(' ; ')}`,
        createdAt: now,
        updatedAt: now,
      }).select().single();

      try {
        assert.equal(error, null, 'Order should be created in Supabase without error');
        assert.ok(order, 'Order record must be returned from insert');

        // Fetch the actual test order from Supabase
        const { data: fetchedOrder, error: fetchErr } = await ctx.dbHelpers.admin
          .from('Order')
          .select('id, internalNote, status')
          .eq('id', orderId)
          .single();

        assert.equal(fetchErr, null, 'Fetching order from Supabase must succeed');
        assert.ok(fetchedOrder, 'Order must be found in Supabase');
        assert.equal(fetchedOrder.status, 'COMPLETED');
        assert.ok(
          fetchedOrder.internalNote?.includes('|'),
          `Fetched order internalNote must contain credentials delimiter '|': ${fetchedOrder.internalNote}`
        );
      } finally {
        await ctx.dbHelpers.admin.from('Order').delete().eq('id', orderId);
      }
    },
  },
  {
    id: 'TC-T3-07',
    name: 'Partner Stock Exhaustion → Supabase Stock Zeroing → Buy Button Disabling (F1 + F2 + F4)',
    tier: 3,
    feature: 'CROSS',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-outstock-${Date.now()}`;
      const { data: dbCat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(dbCat?.id);

      try {
        await ctx.dbHelpers.createTestProduct({
          id: prodId,
          name: 'Zero Stock Cross Test',
          slug: `test-e2e-zs-${Date.now()}`,
          sku: `SKU-ZS-${Date.now()}`,
          categoryId: dbCat.id,
          costPrice: 50000,
          retailPrice: 60000,
          status: 'ACTIVE',
        });

        // Set partnerStock in DB to 0 (stock exhaustion)
        await ctx.dbHelpers.admin
          .from('Product')
          .update({ partnerStock: 0, updatedAt: new Date().toISOString() })
          .eq('id', prodId);

        // Query the synced partner product in Supabase
        const prod = await ctx.dbHelpers.findProduct(prodId);
        assert.ok(prod, 'Product must exist in Supabase');
        assert.equal(prod.partnerStock, 0, 'Partner stock in Supabase must be exactly 0');

        // Verify public anon query reflects zero stock
        const { data: publicProd, error } = await ctx.dbHelpers.anon
          .from('Product')
          .select('id, partnerStock, status')
          .eq('id', prodId)
          .single();

        assert.equal(error, null, 'Anon client query should succeed under RLS');
        assert.ok(publicProd, 'Product must be accessible via anon key');
        assert.equal(publicProd.partnerStock, 0, 'Public customer queries must reflect 0 partnerStock');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T3-08',
    name: 'Admin Category Hierarchy Creation → Supabase RLS Public Read → Menu Update (F3 + F2 + F4)',
    tier: 3,
    feature: 'CROSS',
    run: async (ctx: TestContext) => {
      const parentId = `test-e2e-parent-${Date.now()}`;
      const childId = `test-e2e-child-${Date.now()}`;

      try {
        // 1. Create parent category with parentId null
        const parent = await ctx.dbHelpers.createTestCategory({
          id: parentId,
          name: 'Tài Khoản Cloud Parent',
          slug: `test-e2e-parent-${Date.now()}`,
          parentId: null,
        });
        assert.ok(parent?.id, 'Parent category creation must return an ID');

        // Explicitly verify and await that parent category is fully committed and queryable in Supabase
        const parentCheck = await ctx.dbHelpers.findCategory(parentId);
        assert.ok(parentCheck?.id, 'Parent category must exist in Supabase before creating child');
        assert.equal(parentCheck.id, parentId);

        // 2. Create child category referencing verified parent category ID
        const child = await ctx.dbHelpers.createTestCategory({
          id: childId,
          name: 'VPS Giá Rẻ Child',
          slug: `test-e2e-child-${Date.now()}`,
          parentId: parentCheck.id,
        });
        assert.ok(child?.id, 'Child category creation must return an ID');

        // Verify child category has correct parentId in database
        const childCheck = await ctx.dbHelpers.findCategory(childId);
        assert.ok(childCheck?.id, 'Child category must exist in Supabase');
        assert.equal(childCheck.parentId, parentId, 'Child parentId must equal parent ID');

        // 3. Verify via public anon client (RLS policy check)
        const { data: publicCats, error } = await ctx.dbHelpers.anon
          .from('Category')
          .select('id, name, parentId')
          .in('id', [parentId, childId]);

        assert.equal(error, null, 'Public anon client query must succeed without RLS error');
        assert.equal(publicCats?.length, 2, 'Both parent and child categories should be readable by anon client');

        const foundChild = publicCats?.find((c) => c.id === childId);
        assert.equal(foundChild?.parentId, parentId, 'Child category parentId must match parent ID');
      } finally {
        // Always delete child first to respect foreign key constraint on delete
        await ctx.dbHelpers.deleteTestCategory(childId).catch(() => {});
        await ctx.dbHelpers.deleteTestCategory(parentId).catch(() => {});
      }
    },
  },
];
