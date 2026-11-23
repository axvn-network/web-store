import { NextResponse } from 'next/server';
import { getTaiKhoanProducts } from '@/lib/taiKhoanService';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { readDb, writeDb } from '@/lib/dbService';

// Default images for Cloud & Account providers
const PROVIDER_IMAGES: Record<string, string> = {
  AWS: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80',
  DIGITALOCEAN: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  LINODE: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
  VULTR: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
  KAMATERA: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  VPS: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=600&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
};

function detectBrand(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes('AWS')) return 'AWS';
  if (upper.includes('DIGITAL OCEAN') || upper.includes('DIGITALCOEAN')) return 'DigitalOcean';
  if (upper.includes('LINODE')) return 'Linode';
  if (upper.includes('VULTR')) return 'Vultr';
  if (upper.includes('KAMATERA')) return 'Kamatera';
  if (upper.includes('VPS')) return 'TaiKhoan VPS';
  return 'Cloud & Accounts';
}

function getImageForBrand(brand: string): string {
  const key = brand.toUpperCase().replace(/\s+/g, '');
  if (key.includes('AWS')) return PROVIDER_IMAGES.AWS;
  if (key.includes('DIGITALOCEAN')) return PROVIDER_IMAGES.DIGITALOCEAN;
  if (key.includes('LINODE')) return PROVIDER_IMAGES.LINODE;
  if (key.includes('VULTR')) return PROVIDER_IMAGES.VULTR;
  if (key.includes('KAMATERA')) return PROVIDER_IMAGES.KAMATERA;
  if (key.includes('VPS')) return PROVIDER_IMAGES.VPS;
  return PROVIDER_IMAGES.DEFAULT;
}

export async function POST() {
  try {
    const apiData = await getTaiKhoanProducts();
    if (!apiData || !apiData.categories) {
      return NextResponse.json(
        { success: false, error: 'Không nhận được danh mục từ TaiKhoan.site' },
        { status: 502 }
      );
    }

    const db = readDb();
    let syncedCategoriesCount = 0;
    let syncedProductsCount = 0;

    // 1. Process categories from TaiKhoan.site
    for (const cat of apiData.categories) {
      const slug = `tk-cat-${cat.id}-${cat.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')}`;

      // Upsert category in Supabase
      try {
        await supabaseAdmin.from('Category').upsert(
          {
            id: `tk-cat-${cat.id}`,
            name: cat.name,
            nameVi: cat.name,
            slug,
            description: `Chuyên mục ${cat.name} tự động đồng bộ từ đối tác TaiKhoan.site`,
            image: cat.icon || null,
            isActive: true,
          },
          { onConflict: 'id' }
        );
        syncedCategoriesCount++;
      } catch (e) {
        console.warn('Supabase category upsert error:', e);
      }

      // Check in local db categories
      const localCatIdx = db.categories.findIndex((c) => c.id === `tk-cat-${cat.id}` || c.slug === slug);
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

      // 2. Process products under category
      if (cat.products && Array.isArray(cat.products)) {
        for (const p of cat.products) {
          const brand = detectBrand(p.name);
          const pId = `tk-sp-${p.id}`;
          const pSlug = `tk-${p.id}-${p.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')}`.slice(0, 80);
          const pImage = getImageForBrand(brand);
          const price = Number(p.price || 0);
          const originalPrice = Math.round(price * 1.25); // 25% original anchor price
          const stock = p.amount !== undefined ? Number(p.amount) : p.stock !== undefined ? Number(p.stock) : 50;

          // Upsert to Supabase Product
          try {
            await supabaseAdmin.from('Product').upsert(
              {
                id: pId,
                name: p.name,
                slug: pSlug,
                sku: `TK-${p.id}`,
                barcode: `893700${String(p.id).padStart(6, '0')}`,
                shortDesc: p.description || p.name,
                description: p.description || `Sản phẩm ${p.name} bản quyền chính hãng từ hệ thống TaiKhoan.site. Kích hoạt tự động sau thanh toán.`,
                unit: 'Tài khoản',
                categoryId: `tk-cat-${cat.id}`,
                costPrice: price,
                retailPrice: price,
                salePrice: price,
                status: 'ACTIVE',
                thumbnail: pImage,
              },
              { onConflict: 'id' }
            );
            syncedProductsCount++;
          } catch (e) {
            console.warn('Supabase product upsert error:', e);
          }

          // Upsert to local db.products
          const existingIdx = db.products.findIndex((prod) => prod.id === pId);
          const storeProductObj: any = {
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
            description: p.description || `Sản phẩm ${p.name} kích hoạt tự động qua API.`,
            features: [
              'Tự động cấp thông tin tài khoản qua hệ thống API ngay sau khi thanh toán',
              'Bảo hành chính hãng 1 đổi 1 trong thời hạn cam kết',
              'Hỗ trợ kỹ thuật 24/7 qua Zalo & Telegram CSKH',
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

    // Save local db
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Đồng bộ danh mục và sản phẩm từ TaiKhoan.site thành công!',
      syncedCategoriesCount,
      syncedProductsCount,
      totalLocalProducts: db.products.length,
      totalLocalCategories: db.categories.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi đồng bộ từ TaiKhoan.site' },
      { status: 500 }
    );
  }
}
