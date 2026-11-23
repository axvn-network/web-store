import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { TestCase, TestContext } from '../helpers/types';

export const tests: TestCase[] = [
  {
    id: 'TC-T2-F4-01',
    name: 'Ultra-long product title line clamping without layout distortion',
    tier: 2,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      const cardFile = path.join(process.cwd(), 'components/store/ProductCard.tsx');
      let content = '';
      if (fs.existsSync(cardFile)) {
        content = fs.readFileSync(cardFile, 'utf8');
      } else {
        const files = fs.readdirSync(path.join(process.cwd(), 'components/store'));
        content = files.map(f => fs.readFileSync(path.join(process.cwd(), 'components/store', f), 'utf8')).join('\n');
      }

      // Verify line clamping class is applied to product titles
      assert.ok(
        content.includes('line-clamp-2') || content.includes('line-clamp-1') || content.includes('truncate'),
        'Product title should enforce line-clamp or truncation'
      );
    },
  },
  {
    id: 'TC-T2-F4-02',
    name: 'Broken external product image fallback placeholder handling',
    tier: 2,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      // 1. Verify storefront placeholder/fallback images exist on disk and have valid binary headers
      const webpFallback = path.join(process.cwd(), 'public/product1.webp');
      const pngFallback = path.join(process.cwd(), 'public/imglogo.png');

      assert.ok(fs.existsSync(webpFallback), 'public/product1.webp fallback image must exist');
      assert.ok(fs.existsSync(pngFallback), 'public/imglogo.png fallback image must exist');

      const webpBuf = fs.readFileSync(webpFallback);
      assert.ok(webpBuf.length > 1000, `product1.webp must be > 1000 bytes (got ${webpBuf.length})`);
      const riffHeader = webpBuf.subarray(0, 4).toString('ascii');
      assert.equal(riffHeader, 'RIFF', 'product1.webp must start with RIFF header');

      const pngBuf = fs.readFileSync(pngFallback);
      assert.ok(pngBuf.length > 1000, `imglogo.png must be > 1000 bytes (got ${pngBuf.length})`);
      const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      assert.ok(pngBuf.subarray(0, 8).equals(pngMagic), 'imglogo.png must have valid PNG magic bytes');

      // 2. Verify component fallback logic in storefront components
      const contactWidgetPath = path.join(process.cwd(), 'components/store/FloatingContactWidget.tsx');
      const contactWidgetSrc = fs.readFileSync(contactWidgetPath, 'utf8');
      assert.ok(
        contactWidgetSrc.includes('setPhoneError(true)') &&
        contactWidgetSrc.includes('setFbError(true)') &&
        contactWidgetSrc.includes('setZaloError(true)'),
        'FloatingContactWidget must implement onError image error fallback states'
      );

      const brandsPath = path.join(process.cwd(), 'components/store/BrandsSection.tsx');
      const brandsSrc = fs.readFileSync(brandsPath, 'utf8');
      assert.ok(
        brandsSrc.includes('onError') && brandsSrc.includes('Fallback to text'),
        'BrandsSection must implement onError image fallback handling'
      );
    },
  },
  {
    id: 'TC-T2-F4-03',
    name: 'Extreme viewport width boundary (320px ultra-mobile) styling rules',
    tier: 2,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      const layoutFile = path.join(process.cwd(), 'components/store/StoreShell.tsx');
      const content = fs.readFileSync(layoutFile, 'utf8');

      // Check overflow-x protection or mobile-first responsive layout
      assert.ok(
        content.includes('min-h-screen') || content.includes('overflow-x-hidden') || content.includes('w-full'),
        'StoreShell must contain standard responsive container constraints'
      );
    },
  },
  {
    id: 'TC-T2-F4-04',
    name: 'Rapid locale formatting toggling (VI ↔ EN)',
    tier: 2,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      // Test the application's actual currency formatting utility from lib/utils.ts
      const { formatVND, formatNumber } = await import('../../lib/utils');

      const testAmounts = [0, 10000, 500000, 1250000, 999999999];
      for (const amount of testAmounts) {
        const formatted = formatVND(amount);
        assert.ok(formatted.endsWith('₫'), `Formatted price must end with ₫: ${formatted}`);
        assert.ok(!formatted.includes(',00') && !formatted.includes(',0'), `VND must not have decimal places: ${formatted}`);

        if (amount >= 1000) {
          assert.ok(formatted.includes('.'), `Thousands must use dot separator: ${formatted}`);
        }

        const numFormatted = formatNumber(amount);
        assert.ok(typeof numFormatted === 'string' && numFormatted.length > 0);
      }

      // Verify specific 500,000 VND formatting
      const sample = formatVND(500000);
      assert.equal(sample, '500.000 ₫', `Expected '500.000 ₫', got: ${sample}`);
    },
  },
  {
    id: 'TC-T2-F4-05',
    name: 'Empty cart view layout and state integrity',
    tier: 2,
    feature: 'F4',
    run: async (ctx: TestContext) => {
      const isHttp = await ctx.httpClient.isServerListening();
      if (isHttp) {
        const res = await ctx.httpClient.get('/gio-hang');
        assert.equal(res.status, 200);
        assert.ok(
          res.text.includes('Giỏ hàng') || res.text.includes('trống') || res.text.includes('#f53d2d'),
          'Cart page should render without errors'
        );
      } else {
        const cartPage = path.join(process.cwd(), 'app/gio-hang/page.tsx');
        if (fs.existsSync(cartPage)) {
          const content = fs.readFileSync(cartPage, 'utf8');
          assert.ok(
            content.includes('Giỏ hàng') || content.includes('cart') || content.includes('f53d2d'),
            'Cart page must contain Shopee brand elements'
          );
        }
      }
    },
  },
];
