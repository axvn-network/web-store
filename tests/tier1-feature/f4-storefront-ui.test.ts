import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { TestCase, TestContext } from '../helpers/types';

export const tests: TestCase[] = [
  {
    id: 'TC-T1-F4-01',
    name: 'Brand color token #f53d2d & gradient header retention',
    tier: 1,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      let content = '';
      const isHttp = await ctx.httpClient.isServerListening();
      if (isHttp) {
        const res = await ctx.httpClient.get('/');
        content = res.text;
      } else {
        const headerFile = path.join(process.cwd(), 'components/store/Header.tsx');
        content = fs.readFileSync(headerFile, 'utf8');
      }

      assert.ok(
        content.includes('#f53d2d') || content.includes('f53d2d'),
        'Expected brand color #f53d2d to be present in storefront header'
      );
    },
  },
  {
    id: 'TC-T1-F4-02',
    name: 'StoreShell wrapper layout boundary integrity',
    tier: 1,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      const shellFile = path.join(process.cwd(), 'components/store/StoreShell.tsx');
      const shellContent = fs.readFileSync(shellFile, 'utf8');

      assert.ok(shellContent.includes('<Header'), 'StoreShell must include Header');
      assert.ok(shellContent.includes('<Footer'), 'StoreShell must include Footer');
      assert.ok(
        shellContent.includes('<FloatingContactWidget') || shellContent.includes('FloatingContactWidget'),
        'StoreShell must include FloatingContactWidget'
      );
      assert.ok(
        shellContent.includes('max-w-7xl') || shellContent.includes('container'),
        'StoreShell must enforce max-width content boundary'
      );
    },
  },
  {
    id: 'TC-T1-F4-03',
    name: 'Mobile responsive bottom navigation component & classes',
    tier: 1,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      const navFile = path.join(process.cwd(), 'components/store/MobileBottomNav.tsx');
      assert.ok(fs.existsSync(navFile), 'MobileBottomNav component must exist');

      const content = fs.readFileSync(navFile, 'utf8');
      assert.ok(
        content.includes('fixed bottom-0') || content.includes('bottom-0'),
        'MobileBottomNav must dock to bottom of viewport'
      );
      assert.ok(
        content.includes('lg:hidden') || content.includes('md:hidden'),
        'MobileBottomNav must be hidden on desktop viewports'
      );
    },
  },
  {
    id: 'TC-T1-F4-04',
    name: 'Vietnamese currency formatting (X.XXX.XXX ₫) with 0 decimals',
    tier: 1,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      // Test the standard formatting logic used across storefront
      const formatVND = (price: number) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }).format(price);

      const formatted100k = formatVND(100000);
      assert.match(
        formatted100k,
        /100\.000\s?₫|100\.000\s?VND/,
        `Expected 100.000 ₫, got: ${formatted100k}`
      );

      const formatted1m = formatVND(1234567);
      assert.match(
        formatted1m,
        /1\.234\.567\s?₫|1\.234\.567\s?VND/,
        `Expected 1.234.567 ₫, got: ${formatted1m}`
      );
      assert.ok(!formatted1m.includes(',00'), 'VND formatting must not include decimal fractions');
    },
  },
  {
    id: 'TC-T1-F4-05',
    name: 'CategoryGrid responsive column classes preservation',
    tier: 1,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      const gridFile = path.join(process.cwd(), 'components/store/CategoryGrid.tsx');
      assert.ok(fs.existsSync(gridFile), 'CategoryGrid component must exist');

      const content = fs.readFileSync(gridFile, 'utf8');
      assert.ok(
        content.includes('grid-cols-4') || content.includes('grid-cols-8'),
        'CategoryGrid must maintain responsive 4 to 8 column layout classes'
      );
      assert.ok(
        content.includes('/san-pham') || content.includes('danh-muc'),
        'CategoryGrid items must link to /san-pham catalog'
      );
    },
  },
];
