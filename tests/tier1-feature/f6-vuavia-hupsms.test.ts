import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';
import { getVuaViaBalance, getVuaViaProducts } from '../../lib/vuaViaService';
import { getHupSmsProxyServices, getHupSmsVipProxyServices } from '../../lib/hupSmsService';

export const tests: TestCase[] = [
  {
    id: 'TC-T1-F6-01',
    name: 'VuaVia.io wallet balance retrieval & structure validation',
    tier: 1,
    feature: 'F6',
    run: async (ctx: TestContext) => {
      const balanceRes = await getVuaViaBalance();
      assert.equal(balanceRes.success, true, `Expected success true, got ${balanceRes.success}`);
      assert.ok(balanceRes.data !== undefined, 'Expected balance data to be present');
      assert.ok(typeof balanceRes.data.balance === 'number' && balanceRes.data.balance >= 0, 'Expected non-negative balance number');
    },
  },
  {
    id: 'TC-T1-F6-02',
    name: 'VuaVia.io product catalog querying with pagination',
    tier: 1,
    feature: 'F6',
    run: async (ctx: TestContext) => {
      const productsRes = await getVuaViaProducts({ page: 0, size: 10 });
      assert.equal(productsRes.success, true, 'Expected products query to succeed');
      assert.ok(productsRes.data && Array.isArray(productsRes.data.content), 'Expected content array');
      assert.ok(productsRes.data.content.length > 0, 'Expected at least 1 product from VuaVia');
      const first = productsRes.data.content[0];
      assert.ok(first.id && first.name && typeof first.price === 'number', 'Expected valid product attributes');
    },
  },
  {
    id: 'TC-T1-F6-03',
    name: 'HupSMS.com proxy services catalog retrieval',
    tier: 1,
    feature: 'F6',
    run: async (ctx: TestContext) => {
      const servicesRes = await getHupSmsProxyServices();
      assert.equal(servicesRes.status, 'success', `Expected status 'success', got ${servicesRes.status}`);
      assert.ok(Array.isArray(servicesRes.data), 'Expected array of proxy services');
      assert.ok(servicesRes.data.length > 0, 'Expected at least 1 proxy service');
      const service = servicesRes.data[0];
      assert.ok(service.id && service.name && typeof service.price === 'number', 'Expected valid proxy service structure');
    },
  },
  {
    id: 'TC-T1-F6-04',
    name: 'HupSMS.com VIP proxy rotating services retrieval',
    tier: 1,
    feature: 'F6',
    run: async (ctx: TestContext) => {
      const vipRes = await getHupSmsVipProxyServices();
      assert.equal(vipRes.status, 'success', `Expected status 'success', got ${vipRes.status}`);
      assert.ok(Array.isArray(vipRes.data), 'Expected array of VIP proxy services');
      assert.ok(vipRes.data.length > 0, 'Expected at least 1 VIP proxy service');
      const vipService = vipRes.data[0];
      assert.ok(vipService.id && vipService.name && typeof vipService.price === 'number', 'Expected valid VIP proxy service structure');
    },
  },
  {
    id: 'TC-T1-F6-05',
    name: 'Multi-partner catalog persistence in Supabase database (TaiKhoan + VuaVia + HupSMS)',
    tier: 1,
    feature: 'F6',
    run: async (ctx: TestContext) => {
      const { data: products, error } = await ctx.dbHelpers.admin
        .from('Product')
        .select('id, name, partnerSource');

      assert.ifError(error);
      assert.ok(products && products.length > 0, 'Expected products in database');

      const sources = new Set(products.map((p) => p.partnerSource));
      assert.ok(sources.has('taikhoan.site'), 'Expected taikhoan.site products in database');
      assert.ok(sources.has('vuavia.io'), 'Expected vuavia.io products in database');
      assert.ok(sources.has('hupsms.com'), 'Expected hupsms.com products in database');
    },
  },
];
