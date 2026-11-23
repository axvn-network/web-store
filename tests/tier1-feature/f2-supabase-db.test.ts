import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';

export const tests: TestCase[] = [
  {
    id: 'TC-T1-F2-01',
    name: 'Supabase core tables presence & structure validation',
    tier: 1,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const tables = ['Category', 'Product', 'Order', 'Setting'];
      for (const table of tables) {
        const { data, error } = await ctx.dbHelpers.admin.from(table).select('*').limit(1);
        assert.equal(error, null, `Query to table ${table} failed: ${error?.message}`);
        assert.ok(Array.isArray(data), `Expected data from ${table} to be an array`);
      }
    },
  },
  {
    id: 'TC-T1-F2-02',
    name: 'RLS public read access on Category table via anon key',
    tier: 1,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const { data, error } = await ctx.dbHelpers.anon.from('Category').select('*').limit(5);
      assert.equal(error, null, `Anon read on Category failed: ${error?.message}`);
      assert.ok(Array.isArray(data), 'Expected categories array returned to public anon client');
      assert.ok(data.length > 0, 'Expected at least 1 category accessible publicly');
      assert.ok(data[0].id && data[0].name, 'Category must contain id and name');
    },
  },
  {
    id: 'TC-T1-F2-03',
    name: 'RLS public read access on Product table via anon key',
    tier: 1,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const { data, error } = await ctx.dbHelpers.anon.from('Product').select('id, name, retailPrice, status').limit(5);
      assert.equal(error, null, `Anon read on Product failed: ${error?.message}`);
      assert.ok(Array.isArray(data), 'Expected products array returned to public anon client');
      assert.ok(data.length > 0, 'Expected at least 1 product accessible publicly');
      assert.ok(data[0].id && data[0].name && data[0].retailPrice !== undefined, 'Product must contain id, name, and retailPrice');
    },
  },
  {
    id: 'TC-T1-F2-04',
    name: 'Complete elimination of hardcoded Chinese mock records in database',
    tier: 1,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const { found, violations } = await ctx.dbHelpers.verifyNoChineseStringsInDb();
      assert.equal(
        found,
        0,
        `Found ${found} records with Chinese characters in database: ${JSON.stringify(violations)}`
      );
    },
  },
  {
    id: 'TC-T1-F2-05',
    name: 'Partner integration column persistence in Supabase Product table',
    tier: 1,
    feature: 'F2',
    run: async (ctx: TestContext) => {
      const testId = `test-e2e-sp-t1f205-${Date.now()}`;
      // Fetch an existing category to satisfy foreign key
      const { data: cat } = await ctx.dbHelpers.admin.from('Category').select('id').limit(1).single();
      assert.ok(cat?.id, 'Need at least one category in database for foreign key');

      try {
        const created = await ctx.dbHelpers.createTestProduct({
          id: testId,
          name: 'E2E Test Cloud VPS Product',
          slug: `test-e2e-cloud-vps-${Date.now()}`,
          sku: `SKU-E2E-${Date.now()}`,
          categoryId: cat.id,
          costPrice: 50000,
          retailPrice: 65000,
          customPrice: 65000,
          markupPercent: 30,
          partnerPrice: 50000,
          partnerSource: 'taikhoan.site',
          status: 'ACTIVE',
          unit: 'Tài khoản',
        });

        assert.equal(created.id, testId);
        assert.equal(created.costPrice, 50000);
        assert.equal(created.retailPrice, 65000);
        assert.equal(created.partnerSource, 'taikhoan.site');

        const fetched = await ctx.dbHelpers.findProduct(testId);
        assert.ok(fetched, 'Product must be found after persistence');
        assert.equal(fetched.costPrice, 50000);
        assert.equal(fetched.unit, 'Tài khoản');
      } finally {
        await ctx.dbHelpers.deleteTestProduct(testId);
      }
    },
  },
];
