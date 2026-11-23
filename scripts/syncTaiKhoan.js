const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const TAIKHOAN_BASE_URL = 'https://taikhoan.site';
const TAIKHOAN_API_KEY = '2cd87d67c9b19e9ab7b6a0a944cefbe3jm90cW4wgsqhp7BiXbdnauUK8EMH3FC5';

const supabaseUrl = process.env.SUPABASE_URL || 'https://iiibvihzfnyncrwcdvyt.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');

const PROVIDER_IMAGES = {
  AWS: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80',
  DIGITALOCEAN: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  LINODE: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
  VULTR: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
  KAMATERA: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  VPS: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=600&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
};

function detectBrand(name) {
  const upper = name.toUpperCase();
  if (upper.includes('AWS')) return 'AWS';
  if (upper.includes('DIGITAL OCEAN') || upper.includes('DIGITALCOEAN')) return 'DigitalOcean';
  if (upper.includes('LINODE')) return 'Linode';
  if (upper.includes('VULTR')) return 'Vultr';
  if (upper.includes('KAMATERA')) return 'Kamatera';
  if (upper.includes('VPS')) return 'TaiKhoan VPS';
  return 'Cloud & Accounts';
}

function getImageForBrand(brand) {
  const key = brand.toUpperCase().replace(/\s+/g, '');
  if (key.includes('AWS')) return PROVIDER_IMAGES.AWS;
  if (key.includes('DIGITALOCEAN')) return PROVIDER_IMAGES.DIGITALOCEAN;
  if (key.includes('LINODE')) return PROVIDER_IMAGES.LINODE;
  if (key.includes('VULTR')) return PROVIDER_IMAGES.VULTR;
  if (key.includes('KAMATERA')) return PROVIDER_IMAGES.KAMATERA;
  if (key.includes('VPS')) return PROVIDER_IMAGES.VPS;
  return PROVIDER_IMAGES.DEFAULT;
}

async function sync() {
  console.log('Fetching products from TaiKhoan.site API...');
  const res = await fetch(`${TAIKHOAN_BASE_URL}/api/products.php?api_key=${encodeURIComponent(TAIKHOAN_API_KEY)}`);
  const data = await res.json();

  if (!data || !data.categories) {
    console.error('Failed to get categories from API:', data);
    return;
  }

  let db = { products: [], categories: [] };
  if (fs.existsSync(DB_PATH)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (e) {}
  }
  if (!db.products) db.products = [];
  if (!db.categories) db.categories = [];

  let catCount = 0;
  let prodCount = 0;

  for (const cat of data.categories) {
    const slug = `tk-cat-${cat.id}-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;

    // Upsert into Supabase
    try {
      await supabaseAdmin.from('Category').upsert({
        id: `tk-cat-${cat.id}`,
        name: cat.name,
        nameVi: cat.name,
        slug,
        description: `Chuyên mục ${cat.name} đồng bộ từ TaiKhoan.site`,
        image: cat.icon || null,
        isActive: true,
      }, { onConflict: 'id' });
      catCount++;
    } catch (err) {
      console.warn('Error upserting category to Supabase:', err.message);
    }

    // Local db category
    const localCatIdx = db.categories.findIndex(c => c.id === `tk-cat-${cat.id}` || c.slug === slug);
    if (localCatIdx === -1) {
      db.categories.push({
        id: `tk-cat-${cat.id}`,
        title: cat.name,
        slug,
        itemCount: cat.products?.length || 0,
      });
    } else {
      db.categories[localCatIdx].title = cat.name;
      db.categories[localCatIdx].itemCount = cat.products?.length || 0;
    }

    // Products
    if (cat.products && Array.isArray(cat.products)) {
      for (const p of cat.products) {
        const brand = detectBrand(p.name);
        const pId = `tk-sp-${p.id}`;
        const pSlug = `tk-${p.id}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`.slice(0, 80);
        const pImage = getImageForBrand(brand);
        const price = Number(p.price || 0);
        const originalPrice = Math.round(price * 1.25);
        const stock = p.amount !== undefined ? Number(p.amount) : p.stock !== undefined ? Number(p.stock) : 50;

        // Upsert into Supabase Product
        try {
          const now = new Date().toISOString();
          const { error: prodErr } = await supabaseAdmin.from('Product').upsert({
            id: pId,
            name: p.name,
            slug: pSlug,
            sku: `TK-${p.id}`,
            barcode: `893700${String(p.id).padStart(6, '0')}`,
            shortDesc: p.description || p.name,
            description: p.description || `Sản phẩm ${p.name} kích hoạt tự động qua API TaiKhoan.site.`,
            unit: 'Tài khoản',
            categoryId: `tk-cat-${cat.id}`,
            costPrice: price,
            retailPrice: price,
            partnerPrice: price,
            markupPercent: 20,
            partnerSource: 'taikhoan.site',
            salePrice: price,
            status: 'ACTIVE',
            thumbnail: pImage,
            createdAt: now,
            updatedAt: now,
          }, { onConflict: 'id' });
          if (prodErr) {
            console.warn('Error upserting product to Supabase:', prodErr.message);
          } else {
            prodCount++;
          }
        } catch (err) {
          console.warn('Error upserting product to Supabase:', err.message);
        }

        // Local db product
        const existingIdx = db.products.findIndex(prod => prod.id === pId);
        const storeProductObj = {
          id: pId,
          title: p.name,
          slug: pSlug,
          price,
          originalPrice,
          category: cat.name,
          categorySlug: slug,
          brand,
          image: pImage,
          images: [pImage],
          rating: 5.0,
          reviewCount: Math.floor(15 + Math.random() * 40),
          sold: Math.floor(50 + Math.random() * 150),
          isFlashSale: false,
          isTrending: true,
          isNew: true,
          stock,
          quantity: stock,
          description: p.description || `Sản phẩm ${p.name} bản quyền chính hãng, kích hoạt tự động qua hệ thống API.`,
          features: [
            'Cấp tài khoản tự động ngay sau khi hoàn tất giao dịch thanh toán',
            'Bảo hành chính hãng 1 đổi 1 trong thời gian cam kết',
            'Đội ngũ kỹ thuật hỗ trợ trực tuyến 24/7',
          ],
          partnerId: p.id,
          partnerSource: 'taikhoan.site',
        };

        if (existingIdx === -1) {
          db.products.push(storeProductObj);
        } else {
          db.products[existingIdx] = { ...db.products[existingIdx], ...storeProductObj };
        }
      }
    }
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Sync completed successfully! Categories: ${catCount}, Products: ${prodCount}`);
  console.log(`Total database.json products now: ${db.products.length}`);
}

sync().catch(console.error);
