const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://iiibvihzfnyncrwcdvyt.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function sanitizeWhiteLabel(text) {
  if (!text) return '';
  return text
    .replace(/taikhoan\.site/gi, 'BetaShop')
    .replace(/vuavia\.io/gi, 'BetaShop')
    .replace(/hupsms\.com/gi, 'BetaShop')
    .replace(/thanhplus\.vn/gi, 'BetaShop')
    .replace(/thapcammmo\.vn/gi, 'BetaShop')
    .replace(/đồng bộ từ [^.]+[\s.]*/gi, 'chính hãng tại BetaShop. ')
    .replace(/kích hoạt tự động qua API [^.]*\./gi, 'Kích hoạt tự động 24/7 qua hệ thống BetaShop.')
    .replace(/qua API [a-zA-Z0-9_.-]+/gi, 'qua hệ thống BetaShop')
    .replace(/qua hệ thống API/gi, 'qua hệ thống BetaShop');
}

async function run() {
  console.log('=== STARTING DATABASE WHITE-LABEL SANITIZATION ===');

  // 1. Sanitize Categories
  const { data: categories } = await supabaseAdmin.from('Category').select('id, name, description');
  let catUpdated = 0;
  for (const c of categories || []) {
    const cleanDesc = sanitizeWhiteLabel(c.description || 'Danh mục sản phẩm & dịch vụ chính hãng tại BetaShop');
    const cleanName = sanitizeWhiteLabel(c.name || '');
    if (cleanDesc !== c.description || cleanName !== c.name) {
      await supabaseAdmin.from('Category').update({
        name: cleanName,
        description: cleanDesc,
      }).eq('id', c.id);
      catUpdated++;
    }
  }
  console.log(`✓ Sanitized ${catUpdated} categories.`);

  // 2. Sanitize Products
  const { data: products } = await supabaseAdmin.from('Product').select('id, name, description, shortDesc');
  let prodUpdated = 0;
  for (const p of products || []) {
    const cleanDesc = sanitizeWhiteLabel(p.description || '');
    const cleanShort = sanitizeWhiteLabel(p.shortDesc || '');
    const cleanName = sanitizeWhiteLabel(p.name || '');
    if (cleanDesc !== p.description || cleanShort !== p.shortDesc || cleanName !== p.name) {
      await supabaseAdmin.from('Product').update({
        name: cleanName,
        description: cleanDesc,
        shortDesc: cleanShort,
      }).eq('id', p.id);
      prodUpdated++;
    }
  }
  console.log(`✓ Sanitized ${prodUpdated} products.`);

  console.log('=== WHITE-LABEL SANITIZATION COMPLETED ===');
}

run();
