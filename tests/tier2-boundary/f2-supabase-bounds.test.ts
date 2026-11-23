import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';

export const tests: TestCase[] = [
  {
    id: 'TC-T2-F2-01',
    name: 'Empty category query returns clean empty result without crash',
    tier: 2,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const emptyCatSlug = `test-e2e-empty-${Date.now()}`;
      const cat = await ctx.dbHelpers.createTestCategory({
        name: 'Empty Test Category',
        slug: emptyCatSlug,
      });

      try {
        const isHttp = await ctx.httpClient.isServerListening();
        if (isHttp) {
          const res = await ctx.httpClient.get('/api/products', {
            params: { category: emptyCatSlug },
          });
          assert.equal(res.status, 200);
          assert.equal(res.data.success, true);
          assert.ok(Array.isArray(res.data.data));
          assert.equal(res.data.data.length, 0);
        } else {
          const { data } = await ctx.dbHelpers.anon
            .from('Product')
            .select('*')
            .eq('categoryId', cat.id);
          assert.ok(Array.isArray(data));
          assert.equal(data.length, 0);
        }
      } finally {
        await ctx.dbHelpers.deleteTestCategory(cat.id);
      }
    },
  },
  {
    id: 'TC-T2-F2-02',
    name: 'Handling null and missing optional attributes gracefully',
    tier: 2,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const { data: cat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(cat?.id);

      const prodId = `test-e2e-null-attrs-${Date.now()}`;
      try {
        const created = await ctx.dbHelpers.createTestProduct({
          id: prodId,
          name: 'Null Attributes Product',
          slug: `test-e2e-null-prod-${Date.now()}`,
          sku: `SKU-NULL-${Date.now()}`,
          categoryId: cat.id,
          costPrice: 10000,
          retailPrice: 12000,
          thumbnail: null,
          shortDesc: undefined,
          description: undefined,
        });

        assert.equal(created.id, prodId);
        assert.equal(created.thumbnail, null);

        const fetched = await ctx.dbHelpers.findProduct(prodId);
        assert.ok(fetched);
        assert.equal(fetched.thumbnail, null);
      } finally {
        await ctx.dbHelpers.deleteTestProduct(prodId);
      }
    },
  },
  {
    id: 'TC-T2-F2-03',
    name: 'Special characters & SQL injection resilience in product queries',
    tier: 2,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const maliciousPayload = "' OR 1=1; -- <script>alert(1)</script>";

      const isHttp = await ctx.httpClient.isServerListening();
      if (isHttp) {
        const res = await ctx.httpClient.get('/api/products', {
          params: { search: maliciousPayload },
        });
        assert.equal(res.status, 200, 'Search should not throw 500 on SQL injection payload');
        assert.equal(res.data.success, true);
        assert.ok(Array.isArray(res.data.data));
      } else {
        // Direct query via Supabase client using parameterized filter
        const { data, error } = await ctx.dbHelpers.anon
          .from('Product')
          .select('id, name')
          .ilike('name', `%${maliciousPayload}%`);
        assert.equal(error, null, 'Parameterized ilike query should not fail');
        assert.ok(Array.isArray(data));
      }
    },
  },
  {
    id: 'TC-T2-F2-04',
    name: 'Extreme product price boundaries (price 0 and 999,999,999 VND)',
    tier: 2,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const { data: cat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(cat?.id);

      const p0Id = `test-e2e-price0-${Date.now()}`;
      const pMaxId = `test-e2e-pricemax-${Date.now()}`;

      try {
        await ctx.dbHelpers.createTestProduct({
          id: p0Id,
          name: 'Zero Price Item',
          slug: `test-e2e-zero-${Date.now()}`,
          sku: `SKU-ZERO-${Date.now()}`,
          categoryId: cat.id,
          costPrice: 0,
          retailPrice: 0,
        });

        await ctx.dbHelpers.createTestProduct({
          id: pMaxId,
          name: 'Max Price Item',
          slug: `test-e2e-max-${Date.now()}`,
          sku: `SKU-MAX-${Date.now()}`,
          categoryId: cat.id,
          costPrice: 999999999,
          retailPrice: 999999999,
        });

        const fetched0 = await ctx.dbHelpers.findProduct(p0Id);
        assert.equal(fetched0.retailPrice, 0);

        const fetchedMax = await ctx.dbHelpers.findProduct(pMaxId);
        assert.equal(fetchedMax.retailPrice, 999999999);
      } finally {
        await ctx.dbHelpers.deleteTestProduct(p0Id);
        await ctx.dbHelpers.deleteTestProduct(pMaxId);
      }
    },
  },
  {
    id: 'TC-T2-F2-05',
    name: 'Unique constraint enforcement on duplicate category slug',
    tier: 2,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const duplicateSlug = `test-e2e-dup-slug-${Date.now()}`;
      const cat1 = await ctx.dbHelpers.createTestCategory({
        name: 'Original Category',
        slug: duplicateSlug,
      });

      try {
        // Attempt insert second category with same slug without upsert onConflict
        const { error } = await ctx.dbHelpers.admin.from('Category').insert({
          id: `test-e2e-dup-cat2-${Date.now()}`,
          name: 'Duplicate Category',
          slug: duplicateSlug,
          nameVi: 'Duplicate Category',
        });

        // Supabase Postgres unique constraint violation has code 23505
        assert.ok(error, 'Expected unique constraint error when inserting duplicate slug');
        assert.ok(
          error.code === '23505' || error.message.includes('unique') || error.message.includes('duplicate'),
          `Expected unique violation message, got: ${error.message}`
        );
      } finally {
        await ctx.dbHelpers.deleteTestCategory(cat1.id);
      }
    },
  },
];
