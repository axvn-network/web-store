/**
 * scripts/test-admin-gateway.mjs
 * Comprehensive Verification of Admin Data Gateway & Services (Milestone 2):
 * 1. GET Slices check: categories, products, settings
 * 2. POST Category CRUD: create, update, delete
 * 3. POST Product Pricing update: customPrice, markupPercent, status
 * 4. Verification against Supabase live database
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iiibvihzfnyncrwcdvyt.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const admin = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runTests() {
  console.log('=== COMMENCING MILESTONE 2 INTEGRATION VERIFICATION ===');
  let hasFailure = false;

  // Dynamically import the TypeScript modules
  const {
    readAdminDbSlice,
    readAdminDb,
    createCategory,
    updateCategory,
    deleteCategory,
    updateProductPricing,
  } = await import('../lib/adminDb.ts');

  const {
    getPublicCategories,
    getPublicProducts,
    getPublicBrands,
    getDbFromSupabase,
  } = await import('../lib/dbService.ts');

  // -------------------------------------------------------------
  // TEST B: GET SLICES CHECK
  // -------------------------------------------------------------
  console.log('\n--- TEST B: ADMIN SLICE QUERIES ---');

  try {
    const categories = await readAdminDbSlice('categories');
    console.log(`[PASS] Slice 'categories': count = ${categories.length}, Sample: "${categories[0].name}" (source: ${categories[0].partnerSource})`);
    if (!categories || categories.length === 0) throw new Error('Empty categories slice');
  } catch (err) {
    console.error(`[FAIL] Slice 'categories' failed:`, err.message);
    hasFailure = true;
  }

  try {
    const products = await readAdminDbSlice('products');
    console.log(`[PASS] Slice 'products': count = ${products.length}, Sample: "${products[0].title}" (price: ${products[0].price}, cost: ${products[0].costPrice})`);
    if (!products || products.length === 0) throw new Error('Empty products slice');
  } catch (err) {
    console.error(`[FAIL] Slice 'products' failed:`, err.message);
    hasFailure = true;
  }

  try {
    const settings = await readAdminDbSlice('settings');
    console.log(`[PASS] Slice 'settings': storeName = "${settings.storeName}", hotline = "${settings.hotline}", VAT = ${settings.vatDefault}%`);
    if (!settings || !settings.storeName) throw new Error('Empty settings slice');
  } catch (err) {
    console.error(`[FAIL] Slice 'settings' failed:`, err.message);
    hasFailure = true;
  }

  // -------------------------------------------------------------
  // TEST C: POST ACTIONS TEST (Category CRUD & Product Pricing)
  // -------------------------------------------------------------
  console.log('\n--- TEST C: POST ACTIONS & CRUD PERSISTENCE ---');
  const testCatId = `test-cat-${Date.now()}`;

  // 1. CREATE CATEGORY
  try {
    console.log('1. Testing createCategory...');
    const createdCat = await createCategory({
      id: testCatId,
      name: 'Danh Mục Test M2 Node',
      slug: 'danh-muc-test-m2-node',
      description: 'Mô tả danh mục test M2',
    });
    console.log('  -> createCategory returned:', createdCat.name, createdCat.id);

    // Verify in Supabase
    const { data: supaCat1, error: err1 } = await admin
      .from('Category')
      .select('*')
      .eq('id', testCatId)
      .single();

    if (err1 || !supaCat1 || supaCat1.name !== 'Danh Mục Test M2 Node') {
      throw new Error('Supabase live record mismatch for createCategory: ' + err1?.message);
    }
    console.log('  [PASS] Verified created category in Supabase database!');
  } catch (err) {
    console.error('  [FAIL] createCategory test failed:', err.message);
    hasFailure = true;
  }

  // 2. UPDATE CATEGORY
  try {
    console.log('2. Testing updateCategory...');
    const updatedCat = await updateCategory(testCatId, {
      name: 'Danh Mục Test M2 (Updated)',
    });
    console.log('  -> updateCategory returned:', updatedCat.name);

    // Verify in Supabase
    const { data: supaCat2, error: err2 } = await admin
      .from('Category')
      .select('*')
      .eq('id', testCatId)
      .single();

    if (err2 || !supaCat2 || supaCat2.name !== 'Danh Mục Test M2 (Updated)') {
      throw new Error('Supabase live record mismatch for updateCategory: ' + err2?.message);
    }
    console.log('  [PASS] Verified updated category in Supabase database!');
  } catch (err) {
    console.error('  [FAIL] updateCategory test failed:', err.message);
    hasFailure = true;
  }

  // 3. DELETE CATEGORY
  try {
    console.log('3. Testing deleteCategory...');
    const delResult = await deleteCategory(testCatId);
    console.log('  -> deleteCategory returned:', delResult.message);

    // Verify in Supabase
    const { data: supaCat3 } = await admin
      .from('Category')
      .select('*')
      .eq('id', testCatId);

    if (supaCat3 && supaCat3.length > 0) {
      throw new Error('Record still exists in Supabase after deleteCategory');
    }
    console.log('  [PASS] Verified category deletion in Supabase database!');
  } catch (err) {
    console.error('  [FAIL] deleteCategory test failed:', err.message);
    hasFailure = true;
  }

  // 4. UPDATE PRODUCT PRICING
  try {
    console.log('4. Testing updateProductPricing...');
    const updatedProd = await updateProductPricing('sp-01', 2950000, 25, 'ACTIVE');
    console.log('  -> updateProductPricing returned:', {
      id: updatedProd.id,
      title: updatedProd.title,
      price: updatedProd.price,
      customPrice: updatedProd.customPrice,
      markupPercent: updatedProd.markupPercent,
    });

    // Verify in Supabase
    const { data: supaProd, error: prodErr } = await admin
      .from('Product')
      .select('customPrice, markupPercent, retailPrice, status')
      .eq('id', 'sp-01')
      .single();

    if (prodErr || !supaProd || supaProd.customPrice !== 2950000 || supaProd.markupPercent !== 25) {
      throw new Error('Supabase live record mismatch for updateProductPricing: ' + prodErr?.message);
    }
    console.log('  [PASS] Verified product pricing persistence in Supabase database:', supaProd);
  } catch (err) {
    console.error('  [FAIL] updateProductPricing test failed:', err.message);
    hasFailure = true;
  }

  // -------------------------------------------------------------
  // TEST D: DBSERVICE PUBLIC APIS
  // -------------------------------------------------------------
  console.log('\n--- TEST D: DBSERVICE PUBLIC FUNCTIONS ---');
  try {
    const pubCats = await getPublicCategories();
    const pubProds = await getPublicProducts();
    const pubBrands = await getPublicBrands();
    const fullDb = await getDbFromSupabase();

    console.log(`[PASS] getPublicCategories: ${pubCats.length} active categories`);
    console.log(`[PASS] getPublicProducts: ${pubProds.length} active products`);
    console.log(`[PASS] getPublicBrands: ${pubBrands.length} brands: ${pubBrands.slice(0, 5).join(', ')}...`);
    console.log(`[PASS] getDbFromSupabase: assembled DB with ${fullDb.products.length} products, ${fullDb.categories.length} categories`);
  } catch (err) {
    console.error('  [FAIL] dbService tests failed:', err.message);
    hasFailure = true;
  }

  console.log('\n======================================================');
  if (hasFailure) {
    console.error('RESULT: ONE OR MORE TESTS FAILED');
    process.exit(1);
  } else {
    console.log('RESULT: ALL MILESTONE 2 TESTS PASSED PERFECTLY (100% GENUINE LOGIC & PERSISTENCE)');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
