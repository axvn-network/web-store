import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';
import {
  buyTaiKhoanProduct,
  getTaiKhoanProductDetail,
} from '../../lib/taiKhoanService';

export const tests: TestCase[] = [
  {
    id: 'TC-T2-F1-01',
    name: 'Authentication failure on invalid API key',
    tier: 2,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      const url = `${ctx.partnerBaseUrl}/api/profile.php?api_key=INVALID_KEY_12345`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const json: any = await res.json();

      assert.equal(json.status, 'error', `Expected status 'error' for invalid key, got: ${json.status}`);
      assert.match(json.msg, /api key/i, `Expected message about API key, got: ${json.msg}`);
    },
  },
  {
    id: 'TC-T2-F1-02',
    name: 'Rejection on purchase with insufficient balance or huge amount',
    tier: 2,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      try {
        const res = await buyTaiKhoanProduct({ id: 4, amount: 999999 });
        assert.equal(res.status, 'error', `Expected error status for unaffordable amount, got: ${res.status}`);
        assert.match(
          res.msg,
          /số dư không đủ|insufficient balance|không đủ/i,
          `Expected error message indicating insufficient funds, got: ${res.msg}`
        );
      } catch (err: any) {
        assert.match(err.message, /HTTP (400|402)|số dư|insufficient|không đủ/i);
      }
    },
  },
  {
    id: 'TC-T2-F1-03',
    name: 'Out-of-stock product purchase rejection',
    tier: 2,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      // Product 11 is configured with 0 amount in mock/catalog
      try {
        const res = await buyTaiKhoanProduct({ id: 11, amount: 1 });
        assert.equal(res.status, 'error', `Expected error status for out-of-stock item, got: ${res.status}`);
        assert.match(
          res.msg,
          /hết hàng|out of stock|không đủ số lượng/i,
          `Expected message indicating out-of-stock, got: ${res.msg}`
        );
      } catch (err: any) {
        assert.match(err.message, /HTTP (400|402)|hết hàng|out of stock/i);
      }
    },
  },
  {
    id: 'TC-T2-F1-04',
    name: 'Non-existent product detail query returns empty gracefully',
    tier: 2,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      try {
        const res = await getTaiKhoanProductDetail('NON_EXISTENT_999999');
        assert.ok(res.status === 'success' || res.status === 'error', 'Must return valid response');
        if (res.status === 'success') {
          assert.ok(Array.isArray(res.product), 'Product must be array');
          assert.equal(res.product.length, 0, 'Non-existent product should return empty array');
        }
      } catch (err: any) {
        assert.match(err.message, /HTTP (400|404)|không tồn tại/i);
      }
    },
  },
  {
    id: 'TC-T2-F1-05',
    name: 'Invalid or expired discount coupon handling during buy action',
    tier: 2,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      try {
        const res = await buyTaiKhoanProduct({
          id: 4,
          amount: 1,
          coupon: 'FAKE_EXPIRED_COUPON_2026',
        });
        // Should reject or return error rather than applying arbitrary discount
        assert.equal(res.status, 'error', `Expected purchase rejection on fake coupon, got ${res.status}`);
      } catch (err: any) {
        assert.match(err.message, /HTTP (400|402)|coupon|mã giảm giá/i);
      }
    },
  },
];
