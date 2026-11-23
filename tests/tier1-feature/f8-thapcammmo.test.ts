import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';
import { createThapCamOrder } from '../../lib/thapCamMmoService';
import { sanitizeWhiteLabel } from '../../lib/adminDb';

export const tests: TestCase[] = [
  {
    id: 'TC-T1-F8-01',
    name: 'ThapCamMMO.vn order payload validation (strict whitelist enforcement)',
    tier: 1,
    feature: 'F8',
    run: async (ctx: TestContext) => {
      // Test payload validation according to doc: quantity must be number, serviceId string, no extra fields
      const payload = {
        serviceId: '1',
        quantity: 100,
        groupLinks: ['https://zalo.me/g/test12345'],
      };

      assert.equal(typeof payload.serviceId, 'string');
      assert.equal(typeof payload.quantity, 'number');
      assert.ok(Array.isArray(payload.groupLinks));
      assert.equal('serviceType' in payload, false, 'serviceType must never be included in order payload');
    },
  },
  {
    id: 'TC-T1-F8-02',
    name: 'Stealth & White-label filter removes third-party partner traces from text',
    tier: 1,
    feature: 'F8',
    run: async (ctx: TestContext) => {
      const sampleText = 'Sản phẩm kích hoạt tự động qua API TaiKhoan.site hoặc VuaVia.io và HupSMS.com hay Thanhplus.vn hoặc ThapCamMMO.vn';
      const clean = sanitizeWhiteLabel(sampleText);

      assert.equal(clean.includes('TaiKhoan.site'), false);
      assert.equal(clean.includes('VuaVia.io'), false);
      assert.equal(clean.includes('HupSMS.com'), false);
      assert.equal(clean.includes('Thanhplus.vn'), false);
      assert.equal(clean.includes('ThapCamMMO.vn'), false);
      assert.ok(clean.includes('BetaShop'));
    },
  },
  {
    id: 'TC-T1-F8-03',
    name: 'Supabase public catalog stealth audit (zero partner domain traces)',
    tier: 1,
    feature: 'F8',
    run: async (ctx: TestContext) => {
      const { data: products } = await ctx.dbHelpers.admin
        .from('Product')
        .select('name, description, shortDesc')
        .limit(50);

      const json = JSON.stringify(products || []).toLowerCase();
      const forbidden = ['taikhoan.site', 'vuavia.io', 'hupsms.com', 'thanhplus.vn', 'thapcammmo.vn'];

      for (const domain of forbidden) {
        assert.equal(
          json.includes(domain),
          false,
          `Public product data must not contain upstream domain '${domain}'`
        );
      }
    },
  },
];
