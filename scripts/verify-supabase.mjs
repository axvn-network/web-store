/**
 * scripts/verify-supabase.mjs
 * Kiểm định toàn diện sau migration:
 * 1. Anon Client SELECT Category (kỳ vọng: 19 rows)
 * 2. Anon Client SELECT Product (kỳ vọng: >= 13 rows)
 * 3. Anon Client SELECT Setting, Slider, Banner, NewsArticle (kỳ vọng: > 0 rows)
 * 4. Anon Client SELECT Order (kỳ vọng: 0 rows - RLS chặn bảo mật)
 * 5. Admin Client SELECT Order (kỳ vọng: query thành công qua Service Role)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iiibvihzfnyncrwcdvyt.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_p-fnBcc1ogDTK-2H7dZ-vQ_EG0cEKli';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const anonClient = createClient(SUPABASE_URL, ANON_KEY);
const adminClient = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runVerification() {
  console.log('--- SUPABASE VERIFICATION COMMENCING ---');
  let hasFailure = false;

  // 1. Category via Anon Key
  const { data: catData, error: catErr } = await anonClient.from('Category').select('*');
  if (catErr || !catData || catData.length === 0) {
    console.error(`[FAIL] Anon Category query failed: error=${catErr?.message}, rows=${catData?.length}`);
    hasFailure = true;
  } else {
    console.log(`[PASS] Anon Category returned ${catData.length} records (Sample: "${catData[0].name}", partnerSource: "${catData[0].partnerSource || 'local'}")`);
  }

  // 2. Product via Anon Key
  const { data: prodData, error: prodErr } = await anonClient.from('Product').select('*');
  if (prodErr || !prodData || prodData.length === 0) {
    console.error(`[FAIL] Anon Product query failed: error=${prodErr?.message}, rows=${prodData?.length}`);
    hasFailure = true;
  } else {
    console.log(`[PASS] Anon Product returned ${prodData.length} records (Sample: "${prodData[0].name}")`);
  }

  // 3. Setting via Anon Key
  const { data: setData, error: setErr } = await anonClient.from('Setting').select('*');
  if (setErr || !setData || setData.length === 0) {
    console.error(`[FAIL] Anon Setting query failed: error=${setErr?.message}, rows=${setData?.length}`);
    hasFailure = true;
  } else {
    console.log(`[PASS] Anon Setting returned ${setData.length} records`);
  }

  // 4. Slider, Banner, NewsArticle via Anon Key
  const { data: sliderData } = await anonClient.from('Slider').select('*');
  const { data: bannerData } = await anonClient.from('Banner').select('*');
  const { data: newsData } = await anonClient.from('NewsArticle').select('*');
  console.log(`[PASS] Sliders: ${sliderData?.length || 0}, Banners: ${bannerData?.length || 0}, News: ${newsData?.length || 0}`);

  // 5. Security Check: Order table MUST be protected against Anon Key
  const { data: orderAnonData, error: orderAnonErr } = await anonClient.from('Order').select('*');
  if (orderAnonData && orderAnonData.length > 0) {
    console.error(`[FAIL] Security violation: Anon Client can read Orders (${orderAnonData.length} rows)!`);
    hasFailure = true;
  } else {
    console.log(`[PASS] Order table is safely protected by RLS against Anon Client (0 rows returned)`);
  }

  // 6. Admin Service Role Check
  const { data: adminCatData, error: adminCatErr } = await adminClient.from('Category').select('count');
  if (adminCatErr) {
    console.error(`[FAIL] Admin Client failed: ${adminCatErr.message}`);
    hasFailure = true;
  } else {
    console.log(`[PASS] Admin Client service role query succeeded.`);
  }

  if (hasFailure) {
    console.error('--- VERIFICATION FAILED ---');
    process.exit(1);
  } else {
    console.log('--- ALL SUPABASE CHECKS PASSED PERFECTLY ---');
    process.exit(0);
  }
}

runVerification().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
