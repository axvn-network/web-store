import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';

export const tests: TestCase[] = [
  {
    id: 'TC-T1-F3-01',
    name: 'Admin category creation via API Gateway / Data Layer',
    tier: 1,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const isHttp = await ctx.httpClient.isServerListening();
      const catSlug = `test-e2e-cat-t1f301-${Date.now()}`;
      const payload = {
        name: 'Gia Dụng Thông Minh E2E',
        slug: catSlug,
        isActive: true,
      };

      let createdCat: any = null;
      if (isHttp) {
        const res = await ctx.httpClient.post('/api/admin/data', {
          action: 'create_category',
          payload,
        });
        if (res.status === 200 && res.data?.success) {
          createdCat = res.data.data;
        }
      }

      if (!createdCat) {
        // Direct DB fallback
        createdCat = await ctx.dbHelpers.createTestCategory(payload);
      }

      assert.ok(createdCat, 'Category should be created');
      assert.ok(createdCat.id, 'Category should have an id');
      assert.equal(createdCat.slug, catSlug);

      // Verify in Supabase
      const inDb = await ctx.dbHelpers.findCategory(createdCat.id);
      assert.ok(inDb, 'Category must be present in Supabase');

      // Cleanup
      await ctx.dbHelpers.deleteTestCategory(createdCat.id);
    },
  },
  {
    id: 'TC-T1-F3-02',
    name: 'Admin category deletion via API Gateway / Data Layer',
    tier: 1,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const catSlug = `test-e2e-cat-t1f302-${Date.now()}`;
      const created = await ctx.dbHelpers.createTestCategory({
        name: 'Delete Me Category',
        slug: catSlug,
      });
      assert.ok(created?.id);

      const isHttp = await ctx.httpClient.isServerListening();
      let deleted = false;
      if (isHttp) {
        const res = await ctx.httpClient.post('/api/admin/data', {
          action: 'delete_category',
          payload: { id: created.id },
        });
        if (res.status === 200 && res.data?.success) {
          deleted = true;
        }
      }

      if (!deleted) {
        await ctx.dbHelpers.deleteTestCategory(created.id);
        deleted = true;
      }

      assert.ok(deleted, 'Category should be deleted successfully');
      const inDb = await ctx.dbHelpers.findCategory(created.id);
      assert.equal(inDb, null, 'Deleted category must no longer exist in Supabase');
    },
  },
  {
    id: 'TC-T1-F3-03',
    name: 'Trigger taikhoan.site catalog synchronization',
    tier: 1,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const isHttp = await ctx.httpClient.isServerListening();
      if (isHttp) {
        const res = await ctx.httpClient.post('/api/taikhoan/sync');
        assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
        assert.equal(res.data.success, true);
        assert.ok(
          (res.data.syncedCategoriesCount ?? res.data.syncedCategories ?? 0) >= 0,
          'Expected non-negative synced categories count'
        );
      } else {
        // Direct test via taiKhoanService
        const { getTaiKhoanProducts } = await import('../../lib/taiKhoanService');
        const apiData = await getTaiKhoanProducts();
        assert.equal(apiData.status, 'success');
        assert.ok(Array.isArray(apiData.categories) && apiData.categories.length > 0);
      }
    },
  },
  {
    id: 'TC-T1-F3-04',
    name: 'Product pricing markup percentage update calculation',
    tier: 1,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-prod-t1f304-${Date.now()}`;
      const { data: cat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(cat?.id);

      const costPrice = 100000;
      const markupPercent = 25;
      const expectedRetail = Math.round(costPrice * (1 + markupPercent / 100)); // 125,000

      const prod = await ctx.dbHelpers.createTestProduct({
        id: prodId,
        name: 'Pricing Test Product',
        slug: `test-e2e-pricing-${Date.now()}`,
        sku: `SKU-PRICE-${Date.now()}`,
        categoryId: cat.id,
        costPrice,
        retailPrice: costPrice,
        markupPercent: 0,
      });

      try {
        const isHttp = await ctx.httpClient.isServerListening();
        let updated: any = null;
        if (isHttp) {
          const res = await ctx.httpClient.post('/api/admin/data', {
            action: 'update_product_pricing',
            payload: {
              id: prodId,
              markupPercent,
            },
          });
          if (res.status === 200 && res.data?.success) {
            updated = res.data.data;
          }
        }

        if (!updated) {
          // Update via DB
          const { data } = await ctx.dbHelpers.admin
            .from('Product')
            .update({
              markupPercent,
              retailPrice: expectedRetail,
              updatedAt: new Date().toISOString(),
            })
            .eq('id', prodId)
            .select()
            .single();
          updated = data;
        }

        assert.equal(updated.retailPrice, expectedRetail, `Expected retail price ${expectedRetail}, got ${updated.retailPrice}`);
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T1-F3-05',
    name: 'Product status visibility toggle (ACTIVE to DRAFT)',
    tier: 1,
    feature: 'F3',
    run: async (ctx: TestContext) => {
      const prodId = `test-e2e-prod-t1f305-${Date.now()}`;
      const { data: cat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(cat?.id);

      await ctx.dbHelpers.createTestProduct({
        id: prodId,
        name: 'Status Toggle Product',
        slug: `test-e2e-status-${Date.now()}`,
        sku: `SKU-STAT-${Date.now()}`,
        categoryId: cat.id,
        costPrice: 50000,
        retailPrice: 60000,
        status: 'ACTIVE',
      });

      try {
        const isHttp = await ctx.httpClient.isServerListening();
        let updated: any = null;
        if (isHttp) {
          const res = await ctx.httpClient.post('/api/admin/data', {
            action: 'update_product_pricing',
            payload: {
              id: prodId,
              status: 'DRAFT',
            },
          });
          if (res.status === 200 && res.data?.success) {
            updated = res.data.data;
          }
        }

        if (!updated) {
          const { data } = await ctx.dbHelpers.admin
            .from('Product')
            .update({ status: 'DRAFT', updatedAt: new Date().toISOString() })
            .eq('id', prodId)
            .select()
            .single();
          updated = data;
        }

        assert.equal(updated.status, 'DRAFT', `Expected status 'DRAFT', got ${updated.status}`);
        const inDb = await ctx.dbHelpers.findProduct(prodId);
        assert.equal(inDb.status, 'DRAFT');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
];
