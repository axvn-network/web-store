import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });

import { mockPartnerServer } from './helpers/mock-partner-server';
import { httpClient } from './helpers/http-client';
import { dbHelpers } from './helpers/db-helpers';
import { TestCase, TestContext } from './helpers/types';

interface RunnerArgs {
  tier?: number;
  feature?: string;
  isLive: boolean;
  verbose: boolean;
}

function parseArgs(): RunnerArgs {
  const args = process.argv.slice(2);
  let tier: number | undefined;
  let feature: string | undefined;
  let isLive = false;
  let verbose = false;

  for (const arg of args) {
    if (arg.startsWith('--tier=')) {
      tier = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--feature=')) {
      feature = arg.split('=')[1].toUpperCase();
    } else if (arg === '--live') {
      isLive = true;
    } else if (arg === '--mock') {
      isLive = false;
    } else if (arg === '--verbose' || arg === '-v') {
      verbose = true;
    }
  }

  return { tier, feature, isLive, verbose };
}

async function loadAllTests(): Promise<TestCase[]> {
  const [
    { tests: t1f1 },
    { tests: t1f2 },
    { tests: t1f3 },
    { tests: t1f4 },
    { tests: t1f5 },
    { tests: t1f6 },
    { tests: t1f7 },
    { tests: t1f8 },
    { tests: t1f9 },
    { tests: t1f10 },
    { tests: t2f1 },
    { tests: t2f2 },
    { tests: t2f3 },
    { tests: t2f4 },
    { tests: t2f5 },
    { tests: t3 },
    { tests: t4 },
  ] = await Promise.all([
    import('./tier1-feature/f1-taikhoan-api.test'),
    import('./tier1-feature/f2-supabase-db.test'),
    import('./tier1-feature/f3-admin-mgmt.test'),
    import('./tier1-feature/f4-storefront-ui.test'),
    import('./tier1-feature/f5-assets-404.test'),
    import('./tier1-feature/f6-vuavia-hupsms.test'),
    import('./tier1-feature/f7-thanhplus.test'),
    import('./tier1-feature/f8-thapcammmo.test'),
    import('./tier1-feature/f9-aggregator-core.test'),
    import('./tier1-feature/f10-automation-engine.test'),
    import('./tier2-boundary/f1-taikhoan-bounds.test'),
    import('./tier2-boundary/f2-supabase-bounds.test'),
    import('./tier2-boundary/f3-admin-bounds.test'),
    import('./tier2-boundary/f4-storefront-bounds.test'),
    import('./tier2-boundary/f5-assets-bounds.test'),
    import('./tier3-combination/cross-feature.test'),
    import('./tier4-application/application-scenarios.test'),
  ]);

  return [
    ...t1f1,
    ...t1f2,
    ...t1f3,
    ...t1f4,
    ...t1f5,
    ...t1f6,
    ...t1f7,
    ...t1f8,
    ...t1f9,
    ...t1f10,
    ...t2f1,
    ...t2f2,
    ...t2f3,
    ...t2f4,
    ...t2f5,
    ...t3,
    ...t4,
  ];
}

async function run() {
  const { tier, feature, isLive, verbose } = parseArgs();

  console.log('===============================================================');
  console.log('   BETASHOP WEB-STORE COMPREHENSIVE E2E TEST SUITE (M6)        ');
  console.log('===============================================================');
  console.log(`Execution Mode : ${isLive ? 'LIVE (https://taikhoan.site)' : 'MOCK (Hermetic on http://127.0.0.1:3999)'}`);
  if (tier) console.log(`Filter Tier    : Tier ${tier}`);
  if (feature) console.log(`Filter Feature : Feature ${feature}`);
  console.log('---------------------------------------------------------------\n');

  // Setup mock server BEFORE importing test modules
  if (!isLive) {
    process.env.TAIKHOAN_API_BASE_URL = `http://127.0.0.1:${mockPartnerServer.port}`;
    try {
      await mockPartnerServer.start();
      console.log(`✓ Mock Partner Server started on http://127.0.0.1:${mockPartnerServer.port}`);
    } catch (err: any) {
      console.warn(`! Mock Partner Server warning: ${err.message}`);
    }
  }

  // Dynamically load tests after environment is set
  const allTests = await loadAllTests();

  // Filter tests
  let testsToRun = allTests;
  if (tier) {
    testsToRun = testsToRun.filter((t) => t.tier === tier);
  }
  if (feature) {
    testsToRun = testsToRun.filter((t) => t.feature === feature);
  }

  console.log(`Discovered ${allTests.length} test cases in catalog. Running ${testsToRun.length} selected tests.\n`);

  const partnerBaseUrl = isLive
    ? 'https://taikhoan.site'
    : `http://127.0.0.1:${mockPartnerServer.port}`;

  const ctx: TestContext = {
    isLive,
    partnerBaseUrl,
    appBaseUrl: httpClient.baseUrl,
    mockServer: mockPartnerServer,
    httpClient,
    dbHelpers,
  };

  // Pre-test cleanup
  try {
    const { cleaned } = await dbHelpers.cleanupE2ERecords();
    if (cleaned > 0) {
      console.log(`✓ Initial cleanup removed ${cleaned} stale test records from Supabase`);
    }
  } catch (err: any) {
    console.warn(`! Supabase initial cleanup skipped: ${err.message}`);
  }

  let passed = 0;
  let failed = 0;
  const failureDetails: Array<{ id: string; name: string; error: string }> = [];
  const tierResults: Record<number, { total: number; passed: number; failed: number }> = {
    1: { total: 0, passed: 0, failed: 0 },
    2: { total: 0, passed: 0, failed: 0 },
    3: { total: 0, passed: 0, failed: 0 },
    4: { total: 0, passed: 0, failed: 0 },
  };

  const startTime = Date.now();

  for (const tc of testsToRun) {
    tierResults[tc.tier].total++;
    const tStart = Date.now();
    try {
      await tc.run(ctx);
      const elapsed = Date.now() - tStart;
      passed++;
      tierResults[tc.tier].passed++;
      console.log(`  ✓ [PASS] [T${tc.tier}-${tc.feature}] ${tc.id}: ${tc.name} (${elapsed}ms)`);
    } catch (err: any) {
      const elapsed = Date.now() - tStart;
      failed++;
      tierResults[tc.tier].failed++;
      console.log(`  ✗ [FAIL] [T${tc.tier}-${tc.feature}] ${tc.id}: ${tc.name} (${elapsed}ms)`);
      console.log(`      Error: ${err.message || err}`);
      failureDetails.push({
        id: tc.id,
        name: tc.name,
        error: err.stack || err.message || String(err),
      });
    }
  }

  const totalElapsed = Date.now() - startTime;

  // Post-test cleanup
  try {
    await dbHelpers.cleanupE2ERecords();
  } catch {}

  // Stop mock server
  if (!isLive) {
    try {
      await mockPartnerServer.stop();
    } catch {}
  }

  // Print Summary Table
  console.log('\n===============================================================');
  console.log('                     TEST EXECUTION SUMMARY                    ');
  console.log('===============================================================');
  console.log(`  Tier 1 (Feature Coverage)      : ${tierResults[1].passed}/${tierResults[1].total} passed`);
  console.log(`  Tier 2 (Boundary & Corner)     : ${tierResults[2].passed}/${tierResults[2].total} passed`);
  console.log(`  Tier 3 (Combinations)          : ${tierResults[3].passed}/${tierResults[3].total} passed`);
  console.log(`  Tier 4 (Real-World Scenarios)  : ${tierResults[4].passed}/${tierResults[4].total} passed`);
  console.log('---------------------------------------------------------------');
  console.log(`  TOTAL: ${passed}/${testsToRun.length} passed (${failed} failed) in ${totalElapsed}ms`);
  console.log('===============================================================');

  if (failureDetails.length > 0) {
    console.log('\nFAILURES DETAIL:');
    for (const f of failureDetails) {
      console.log(`\n--- ${f.id}: ${f.name} ---`);
      console.log(f.error);
    }
  }

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
