import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';
import {
  getThanhPlusUserInfo,
  getThanhPlusProducts,
  getThanhPlusProductDetail,
} from '../../lib/thanhPlusService';

export const tests: TestCase[] = [
  {
    id: 'TC-T1-F7-01',
    name: 'Thanhplus.vn user account info retrieval & structure validation',
    tier: 1,
    feature: 'F7',
    run: async (ctx: TestContext) => {
      const userInfo = await getThanhPlusUserInfo();
      assert.equal(userInfo.status, 'success', `Expected status 'success', got ${userInfo.status}`);
      assert.ok(userInfo.data, 'Expected userInfo.data to be present');
      assert.ok(typeof userInfo.data.username === 'string' && userInfo.data.username.length > 0, 'Expected valid username');
      assert.ok(typeof userInfo.data.money === 'number' && userInfo.data.money >= 0, 'Expected non-negative money number');
    },
  },
  {
    id: 'TC-T1-F7-02',
    name: 'Thanhplus.vn product catalog fetch across all categories',
    tier: 1,
    feature: 'F7',
    run: async (ctx: TestContext) => {
      const catalog = await getThanhPlusProducts('all');
      assert.equal(catalog.status, 'success', `Expected status 'success', got ${catalog.status}`);
      assert.ok(Array.isArray(catalog.categories), 'Expected categories array');
      assert.ok(catalog.categories.length > 0, 'Expected at least 1 category from Thanhplus');
      const firstCat = catalog.categories[0];
      assert.ok(firstCat.name && Array.isArray(firstCat.products), 'Expected valid category structure');
      assert.ok(firstCat.products.length > 0, 'Expected products in category');
    },
  },
  {
    id: 'TC-T1-F7-03',
    name: 'Thanhplus.vn single product detail query for valid product GUID',
    tier: 1,
    feature: 'F7',
    run: async (ctx: TestContext) => {
      const catalog = await getThanhPlusProducts('all');
      const sampleProduct = catalog.categories[0]?.products[0];
      assert.ok(sampleProduct?.id, 'Expected sample product id');

      const detail = await getThanhPlusProductDetail(sampleProduct.id);
      assert.equal(detail.status, 'success', `Expected status 'success', got ${detail.status}`);
      assert.ok(detail.data && detail.data.name, 'Expected valid product detail data');
    },
  },
  {
    id: 'TC-T1-F7-04',
    name: 'Thanhplus.vn catalog persistence in Supabase database',
    tier: 1,
    feature: 'F7',
    run: async (ctx: TestContext) => {
      const { data: products, error } = await ctx.dbHelpers.admin
        .from('Product')
        .select('id, name, partnerSource')
        .eq('partnerSource', 'thanhplus.vn');

      assert.ifError(error);
      assert.ok(products && products.length > 0, 'Expected thanhplus.vn products in database');
    },
  },
];
