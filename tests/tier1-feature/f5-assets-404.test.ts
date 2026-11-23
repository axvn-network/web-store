import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { TestCase, TestContext } from '../helpers/types';

export const tests: TestCase[] = [
  {
    id: 'TC-T1-F5-01',
    name: 'Primary hotline image asset availability (phone.png)',
    tier: 1,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      // 1. Filesystem existence check
      const p1 = path.join(process.cwd(), 'public/phone.png');
      const p2 = path.join(process.cwd(), 'public/images/contact/phone.png');
      assert.ok(fs.existsSync(p1) || fs.existsSync(p2), 'phone.png must exist in public directory');

      const stats = fs.statSync(fs.existsSync(p1) ? p1 : p2);
      assert.ok(stats.size > 100, `phone.png file too small: ${stats.size} bytes`);

      // 2. HTTP check if server is running
      if (await ctx.httpClient.isServerListening()) {
        const res = await ctx.httpClient.get('/phone.png');
        assert.equal(res.status, 200, `Expected HTTP 200 for /phone.png, got ${res.status}`);
      }
    },
  },
  {
    id: 'TC-T1-F5-02',
    name: 'Zalo contact image asset availability (zalo.png)',
    tier: 1,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      const p1 = path.join(process.cwd(), 'public/zalo.png');
      const p2 = path.join(process.cwd(), 'public/images/contact/zalo.png');
      assert.ok(fs.existsSync(p1) || fs.existsSync(p2), 'zalo.png must exist in public directory');

      const stats = fs.statSync(fs.existsSync(p1) ? p1 : p2);
      assert.ok(stats.size > 100, `zalo.png file too small: ${stats.size} bytes`);

      if (await ctx.httpClient.isServerListening()) {
        const res = await ctx.httpClient.get('/zalo.png');
        assert.equal(res.status, 200, `Expected HTTP 200 for /zalo.png, got ${res.status}`);
      }
    },
  },
  {
    id: 'TC-T1-F5-03',
    name: 'Facebook contact image asset availability (Facebook.png uppercase)',
    tier: 1,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      const p1 = path.join(process.cwd(), 'public/Facebook.png');
      const p2 = path.join(process.cwd(), 'public/images/contact/Facebook.png');
      assert.ok(fs.existsSync(p1) || fs.existsSync(p2), 'Facebook.png must exist in public directory');

      const stats = fs.statSync(fs.existsSync(p1) ? p1 : p2);
      assert.ok(stats.size > 100, `Facebook.png file too small: ${stats.size} bytes`);

      if (await ctx.httpClient.isServerListening()) {
        const res = await ctx.httpClient.get('/Facebook.png');
        assert.equal(res.status, 200, `Expected HTTP 200 for /Facebook.png, got ${res.status}`);
      }
    },
  },
  {
    id: 'TC-T1-F5-04',
    name: 'Lowercase facebook.png compatibility alias / presence',
    tier: 1,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      // Must support lowercase facebook.png either directly or via rewrite
      const p1 = path.join(process.cwd(), 'public/facebook.png');
      const p2 = path.join(process.cwd(), 'public/images/contact/facebook.png');
      const pUpper = path.join(process.cwd(), 'public/Facebook.png');
      const nextConfigPath = path.join(process.cwd(), 'next.config.js');
      const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

      const hasDirectFile = fs.existsSync(p1) || fs.existsSync(p2) || fs.existsSync(pUpper);
      const hasRewrite = nextConfig.includes('facebook.png') || nextConfig.includes('Facebook.png');

      assert.ok(hasDirectFile || hasRewrite, 'Must support facebook.png either by file or rewrite rule');

      if (await ctx.httpClient.isServerListening()) {
        const res = await ctx.httpClient.get('/facebook.png');
        assert.ok(
          res.status === 200 || res.status === 308 || res.status === 307,
          `Expected HTTP 200/308 for /facebook.png, got ${res.status}`
        );
      }
    },
  },
  {
    id: 'TC-T1-F5-05',
    name: 'Next.js production static chunk caching headers in config',
    tier: 1,
    feature: 'F5',
    run: async (ctx: TestContext) => {
      const nextConfigPath = path.join(process.cwd(), 'next.config.js');
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');

      // Check next.config.js for headers configuration or cache-control directives
      const hasHeaders =
        configContent.includes('headers') ||
        configContent.includes('Cache-Control') ||
        configContent.includes('rewrites');

      assert.ok(hasHeaders, 'next.config.js should configure headers or rewrites for static assets');
    },
  },
];
