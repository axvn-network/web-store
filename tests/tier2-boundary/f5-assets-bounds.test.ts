import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TestCase, TestContext } from '../helpers/types';

export const tests: TestCase[] = [
  {
    id: 'TC-T2-F5-01',
    name: 'Case-insensitivity verification for Facebook contact image',
    tier: 2,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      const isHttp = await ctx.httpClient.isServerListening();
      if (isHttp) {
        const resUpper = await ctx.httpClient.get('/Facebook.png');
        const resLower = await ctx.httpClient.get('/facebook.png');

        assert.equal(resUpper.status, 200, `Expected 200 for /Facebook.png, got ${resUpper.status}`);
        assert.ok(
          resLower.status === 200 || resLower.status === 308 || resLower.status === 307,
          `Expected 200/308 for /facebook.png, got ${resLower.status}`
        );
      } else {
        // Direct filesystem check
        const upper = path.join(process.cwd(), 'public/Facebook.png');
        const lower = path.join(process.cwd(), 'public/facebook.png');
        const exists = fs.existsSync(upper) || fs.existsSync(lower);
        assert.ok(exists, 'Facebook image file must exist in public directory');
      }
    },
  },
  {
    id: 'TC-T2-F5-02',
    name: 'Cache-busting query parameter resilience on phone.png',
    tier: 2,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      const isHttp = await ctx.httpClient.isServerListening();
      if (isHttp) {
        const res = await ctx.httpClient.get('/phone.png?v=20261120&t=9999');
        assert.equal(res.status, 200, `Expected 200 for cache-busted /phone.png, got ${res.status}`);
      } else {
        const p = path.join(process.cwd(), 'public/phone.png');
        assert.ok(fs.existsSync(p));
      }
    },
  },
  {
    id: 'TC-T2-F5-03',
    name: 'Duplicate root & subpath parity for Zalo icon',
    tier: 2,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      const rootPath = path.join(process.cwd(), 'public/zalo.png');
      const subPath = path.join(process.cwd(), 'public/images/contact/zalo.png');

      assert.ok(fs.existsSync(rootPath), 'public/zalo.png must exist');
      assert.ok(fs.existsSync(subPath), 'public/images/contact/zalo.png must exist');

      const bufRoot = fs.readFileSync(rootPath);
      const bufSub = fs.readFileSync(subPath);

      const hashRoot = crypto.createHash('sha256').update(bufRoot).digest('hex');
      const hashSub = crypto.createHash('sha256').update(bufSub).digest('hex');

      assert.equal(hashRoot, hashSub, 'Root zalo.png and subpath zalo.png should have identical hash');
    },
  },
  {
    id: 'TC-T2-F5-04',
    name: '0-byte image corruption prevention and PNG magic bytes verification',
    tier: 2,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      const images = [
        { name: 'phone.png', diskPath: path.join(process.cwd(), 'public/phone.png') },
        { name: 'zalo.png', diskPath: path.join(process.cwd(), 'public/zalo.png') },
        { name: 'Facebook.png', diskPath: path.join(process.cwd(), 'public/Facebook.png') },
        {
          name: 'facebook.png',
          // Resolves via Next.js rewrite mapping to public/images/contact/Facebook.png
          diskPath: fs.existsSync(path.join(process.cwd(), 'public/images/contact/Facebook.png'))
            ? path.join(process.cwd(), 'public/images/contact/Facebook.png')
            : path.join(process.cwd(), 'public/Facebook.png'),
        },
      ];
      const pngMagicBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

      for (const img of images) {
        assert.ok(fs.existsSync(img.diskPath), `${img.name} must exist on disk at ${img.diskPath}`);

        const buf = fs.readFileSync(img.diskPath);
        assert.ok(buf.length > 500, `${img.name} must be > 500 bytes (got ${buf.length})`);

        const header = buf.subarray(0, 8);
        assert.ok(
          header.equals(pngMagicBytes),
          `${img.name} does not contain valid PNG magic bytes header`
        );
      }
    },
  },
  {
    id: 'TC-T2-F5-05',
    name: 'Concurrent burst static chunk and asset fetching',
    tier: 2,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      const isHttp = await ctx.httpClient.isServerListening();
      if (isHttp) {
        // Fire 20 parallel requests for phone.png, zalo.png, Facebook.png
        const urls = [
          '/phone.png',
          '/zalo.png',
          '/Facebook.png',
          '/images/contact/phone.png',
          '/images/contact/zalo.png',
        ];
        const promises = [];
        for (let i = 0; i < 20; i++) {
          const targetUrl = urls[i % urls.length];
          promises.push(ctx.httpClient.get(targetUrl));
        }

        const results = await Promise.all(promises);
        const allOk = results.every((r) => r.status === 200);
        assert.ok(allOk, 'All concurrent asset requests should return 200 OK');
      } else {
        // Filesystem concurrent read
        const promises = [];
        for (let i = 0; i < 20; i++) {
          promises.push(fs.promises.readFile(path.join(process.cwd(), 'public/phone.png')));
        }
        const buffers = await Promise.all(promises);
        assert.equal(buffers.length, 20);
        assert.ok(buffers[0].length > 100);
      }
    },
  },
];
