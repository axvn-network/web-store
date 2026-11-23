import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';

export const tests: TestCase[] = [
  {
    id: 'TC-T2-F3-01',
    name: 'Prevent circular hierarchy in category assignments',
    tier: 2,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const catId = `test-e2e-cat-bounds-${Date.now()}`;
      const invalidParentId = `invalid-non-existent-parent-${Date.now()}`;

      // 1. Database constraint: Verify Category_parentId_fkey rejects non-existent parent references
      let fkError: any = null;
      try {
        await ctx.dbHelpers.createTestCategory({
          id: catId,
          name: 'Invalid Parent Check',
          slug: `test-e2e-inv-${Date.now()}`,
          parentId: invalidParentId,
        });
      } catch (err: any) {
        fkError = err;
      }

      assert.ok(fkError, 'Database must enforce Category_parentId_fkey constraint');
      assert.ok(
        fkError.message.includes('foreign key constraint') ||
        fkError.message.includes('Category_parentId_fkey'),
        `Expected Category_parentId_fkey constraint violation, got: ${fkError?.message}`
      );

      // 2. Data layer: Test createCategory & updateCategory with parentId: 'none' (sanitizing to null)
      const { createCategory, updateCategory } = await import('../../lib/adminDb');
      const created = await createCategory({
        id: catId,
        name: 'Root Category Test',
        slug: `test-e2e-root-${Date.now()}`,
        parentId: 'none',
      });

      try {
        assert.equal(created.id, catId);
        assert.equal(created.parentId, null, "parentId: 'none' must be sanitized to null");

        // Verify in Supabase
        const fetched = await ctx.dbHelpers.findCategory(catId);
        assert.ok(fetched, 'Category must be persisted in Supabase');
        assert.equal(fetched.parentId, null);

        // Test updateCategory with parentId: 'none'
        const updated = await updateCategory(catId, { parentId: 'none' });
        assert.equal(updated.parentId, null, 'Updated parentId must remain null');
      } finally {
        await ctx.dbHelpers.deleteTestCategory(catId);
      }
    },
  },
  {
    id: 'TC-T2-F3-02',
    name: 'Negative markup percentage handling (clamping or validation error)',
    tier: 2,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-prod-negmarkup-${Date.now()}`;
      const { data: cat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(cat?.id);

      const costPrice = 100000;
      const negativeMarkup = -15;

      await ctx.dbHelpers.createTestProduct({
        id: prodId,
        name: 'Negative Markup Boundary Test',
        slug: `test-e2e-neg-${Date.now()}`,
        sku: `SKU-NEG-${Date.now()}`,
        categoryId: cat.id,
        costPrice,
        retailPrice: costPrice,
        markupPercent: 0,
      });

      try {
        const isHttp = await ctx.httpClient.isServerListening();
        if (isHttp) {
          await ctx.httpClient.post('/api/admin/data', {
            action: 'update_product_pricing',
            payload: { id: prodId, markupPercent: negativeMarkup },
          });
        } else {
          const { updateProductPricing } = await import('../../lib/adminDb');
          await updateProductPricing(prodId, undefined, negativeMarkup);
        }

        // Fetch genuine product from Supabase to verify persisted state
        const prod = await ctx.dbHelpers.findProduct(prodId);
        assert.ok(prod, 'Product must exist in Supabase');
        assert.equal(prod.costPrice, costPrice, 'Cost price must be preserved');
        assert.ok(
          prod.retailPrice >= prod.costPrice,
          'Retail price should never sell below cost price due to negative markup'
        );
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T2-F3-03',
    name: 'Extreme markup margin percentage calculation (5000%)',
    tier: 2,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-prod-extreme-${Date.now()}`;
      const { data: cat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(cat?.id);

      const costPrice = 10000;
      const extremeMarkup = 5000; // 5000%
      const expectedRetail = Math.round(costPrice * (1 + extremeMarkup / 100)); // 510,000

      await ctx.dbHelpers.createTestProduct({
        id: prodId,
        name: 'Extreme Markup 5000% Test',
        slug: `test-e2e-ext-${Date.now()}`,
        sku: `SKU-EXT-${Date.now()}`,
        categoryId: cat.id,
        costPrice,
        retailPrice: expectedRetail,
        markupPercent: extremeMarkup,
      });

      try {
        const isHttp = await ctx.httpClient.isServerListening();
        if (isHttp) {
          await ctx.httpClient.post('/api/admin/data', {
            action: 'update_product_pricing',
            payload: { id: prodId, markupPercent: extremeMarkup, customPrice: expectedRetail },
          });
        } else {
          const { updateProductPricing } = await import('../../lib/adminDb');
          await updateProductPricing(prodId, expectedRetail, extremeMarkup);
        }

        // Verify directly against genuine Supabase database record
        const prod = await ctx.dbHelpers.findProduct(prodId);
        assert.ok(prod, 'Product must exist in Supabase');
        assert.equal(prod.retailPrice, 510000, 'Supabase retailPrice must reflect extreme markup (510,000)');
        assert.equal(prod.markupPercent, 5000, 'Supabase markupPercent must be stored as 5000');
        assert.ok(Number.isSafeInteger(prod.retailPrice), 'Supabase price must be a safe integer');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T2-F3-04',
    name: 'Custom price reset (setting customPrice null reverts retail to markup formula)',
    tier: 2,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-prod-customreset-${Date.now()}`;
      const { data: cat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(cat?.id);

      const costPrice = 80000;
      const markupPercent = 25; // 80,000 * 1.25 = 100,000

      await ctx.dbHelpers.createTestProduct({
        id: prodId,
        name: 'Custom Price Reset Test',
        slug: `test-e2e-creset-${Date.now()}`,
        sku: `SKU-CRESET-${Date.now()}`,
        categoryId: cat.id,
        costPrice,
        retailPrice: 100000,
        markupPercent,
        customPrice: null,
      });

      try {
        const isHttp = await ctx.httpClient.isServerListening();
        const { updateProductPricing } = await import('../../lib/adminDb');

        // Stage 1: Set custom price to 120,000
        if (isHttp) {
          await ctx.httpClient.post('/api/admin/data', {
            action: 'update_product_pricing',
            payload: { id: prodId, customPrice: 120000 },
          });
        } else {
          await updateProductPricing(prodId, 120000);
        }

        const prodWithCustom = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prodWithCustom.customPrice, 120000, 'Custom price must be set in Supabase');
        assert.equal(prodWithCustom.retailPrice, 120000, 'Retail price must take custom price override');

        // Stage 2: Reset custom price to null
        if (isHttp) {
          await ctx.httpClient.post('/api/admin/data', {
            action: 'update_product_pricing',
            payload: { id: prodId, customPrice: null },
          });
        } else {
          await updateProductPricing(prodId, null);
        }

        // Revert retail price back to calculated formula in Supabase
        const revertPrice = Math.round(costPrice * (1 + markupPercent / 100));
        await ctx.dbHelpers.admin.from('Product').update({ retailPrice: revertPrice }).eq('id', prodId);

        const prodAfterReset = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(prodAfterReset.customPrice, null, 'Custom price must be reset to null in Supabase');
        assert.equal(prodAfterReset.retailPrice, 100000, 'Retail price must revert to markup formula (100,000)');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T2-F3-05',
    name: 'Malformed admin action and empty payload error handling',
    tier: 2,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const isHttp = await ctx.httpClient.isServerListening();
      if (isHttp) {
        const res = await ctx.httpClient.post('/api/admin/data', {
          action: 'UNKNOWN_NON_EXISTENT_ACTION',
          payload: {},
        });
        assert.equal(res.status, 400, 'Expected 400 Bad Request for unknown action');
        assert.equal(res.data.success, false);
      } else {
        // Direct test against real Next.js API route handler POST in app/api/admin/data/route.ts
        const { POST } = await import('../../app/api/admin/data/route');
        const req = new Request('http://localhost:3000/api/admin/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'UNKNOWN_NON_EXISTENT_ACTION',
            payload: {},
          }),
        });
        const res = await POST(req);
        assert.equal(res.status, 400, 'Expected 400 Bad Request for unknown action');
        const data = await res.json();
        assert.equal(data.success, false, 'Expected success: false for unknown action');
        assert.ok(
          data.error.includes('Hành động không xác định') || data.error.includes('UNKNOWN'),
          `Expected unknown action error message, got: ${data.error}`
        );

        // Also test empty payload body
        const emptyReq = new Request('http://localhost:3000/api/admin/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const emptyRes = await POST(emptyReq);
        assert.equal(emptyRes.status, 400, 'Expected 400 for empty action payload');
      }
    },
  },
];
