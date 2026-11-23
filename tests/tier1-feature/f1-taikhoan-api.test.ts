import assert from 'node:assert/strict';
import { TestCase, TestContext } from '../helpers/types';
import {
  getTaiKhoanProfile,
  getTaiKhoanProducts,
  getTaiKhoanProductDetail,
  buyTaiKhoanProduct,
  getTaiKhoanOrderDetail,
} from '../../lib/taiKhoanService';

export const tests: TestCase[] = [
  {
    id: 'TC-T1-F1-01',
    name: 'Partner profile retrieval & balance check',
    tier: 1,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      const profile = await getTaiKhoanProfile();
      assert.equal(profile.status, 'success', `Expected status 'success', got ${profile.status}`);
      assert.ok(profile.data, 'Expected profile.data to be present');
      assert.ok(typeof profile.data.username === 'string' && profile.data.username.length > 0, 'Expected non-empty username');
      const moneyNum = parseFloat(profile.data.money);
      assert.ok(!isNaN(moneyNum) && moneyNum >= 0, `Expected non-negative money amount, got ${profile.data.money}`);
    },
  },
  {
    id: 'TC-T1-F1-02',
    name: 'Full partner product & category catalog fetch',
    tier: 1,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      const catalog = await getTaiKhoanProducts();
      assert.equal(catalog.status, 'success', `Expected status 'success', got ${catalog.status}`);
      assert.ok(Array.isArray(catalog.categories), 'Expected categories to be an array');
      assert.ok(catalog.categories.length > 0, 'Expected at least 1 category');

      const foundProduct = catalog.categories.some(
        (c) => Array.isArray(c.products) && c.products.length > 0
      );
      assert.ok(foundProduct, 'Expected at least one category to have products');
    },
  },
  {
    id: 'TC-T1-F1-03',
    name: 'Single product detail query for valid ID (ID 4)',
    tier: 1,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      const detail = await getTaiKhoanProductDetail(4);
      assert.equal(detail.status, 'success', `Expected status 'success', got ${detail.status}`);
      assert.ok(Array.isArray(detail.product), 'Expected product to be an array');
      assert.ok(detail.product.length > 0, 'Expected at least one product item in detail response');
      const p = detail.product[0];
      assert.equal(Number(p.id), 4, `Expected product id 4, got ${p.id}`);
      assert.ok(Number(p.price) > 0, `Expected positive price, got ${p.price}`);
      assert.ok(typeof p.name === 'string' && p.name.length > 0, 'Expected non-empty product name');
    },
  },
  {
    id: 'TC-T1-F1-04',
    name: 'Product purchase fulfillment execution (or graceful insufficient funds)',
    tier: 1,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      try {
        const buyRes = await buyTaiKhoanProduct({ id: 4, amount: 1 });
        if (ctx.isLive) {
          // Live account has 0.00 balance, must return proper error response
          assert.ok(
            buyRes.status === 'error' || buyRes.status === 'success',
            `Expected status 'error' or 'success', got ${buyRes.status}`
          );
          if (buyRes.status === 'error') {
            assert.match(
              buyRes.msg,
              /số dư không đủ|insufficient balance/i,
              `Expected message indicating insufficient balance, got: ${buyRes.msg}`
            );
          }
        } else {
          // In mock mode with positive balance
          assert.equal(buyRes.status, 'success', `Expected purchase status 'success', got ${buyRes.status}`);
          assert.ok(buyRes.trans_id, 'Expected trans_id in purchase response');
          assert.ok(Array.isArray(buyRes.data) && buyRes.data.length > 0, 'Expected credentials array in purchase response');
        }
      } catch (err: any) {
        if (ctx.isLive) {
          assert.match(err.message, /HTTP (402|400)|số dư|balance/i);
        } else {
          throw err;
        }
      }
    },
  },
  {
    id: 'TC-T1-F1-05',
    name: 'Order status and history lookup by transaction ID',
    tier: 1,
    feature: 'F1',
    run: async (ctx: TestContext) => {
      try {
        const orderRes = await getTaiKhoanOrderDetail('TK98765432');
        if (ctx.isLive) {
          // May return error if TK98765432 does not exist on live server, verify graceful response
          assert.ok(orderRes.status === 'success' || orderRes.status === 'error');
        } else {
          assert.equal(orderRes.status, 'success', `Expected status 'success', got ${orderRes.status}`);
          assert.ok(orderRes.data, 'Expected order details data');
          assert.equal(orderRes.data.trans_id, 'TK98765432');
        }
      } catch (err: any) {
        if (ctx.isLive) {
          assert.match(err.message, /HTTP (404|400)|đơn hàng không tồn tại/i);
        } else {
          throw err;
        }
      }
    },
  },
];
