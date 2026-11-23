/**
 * scripts/migrate-supabase.mjs
 * Tự động thực thi chuẩn hóa Database Supabase Milestone 2:
 * 1. Bổ sung cột đối tác cho Category, Product
 * 2. Tạo bảng PartnerSyncLog, Slider, Banner, NewsArticle
 * 3. Seed dữ liệu mặc định cho Setting, Slider, Banner, NewsArticle
 * 4. Thiết lập 14 policies Public SELECT cho Anon Client
 */

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'iiibvihzfnyncrwcdvyt';
const SUPABASE_MGMT_TOKEN = process.env.SUPABASE_MGMT_TOKEN || '';

const MIGRATION_SQL = `
-- ============================================================================
-- 1. DANH MỤC SẢN PHẨM ("Category")
-- ============================================================================
ALTER TABLE "Category" 
  ADD COLUMN IF NOT EXISTS "partnerSource" TEXT DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS "partnerId" TEXT,
  ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP WITHOUT TIME ZONE;

CREATE INDEX IF NOT EXISTS "idx_category_partner" ON "Category" ("partnerSource", "partnerId");

-- Backfill partnerSource và partnerId cho các danh mục TaiKhoan.site hiện có
UPDATE "Category" 
SET "partnerSource" = 'taikhoan.site', 
    "partnerId" = SUBSTRING("id" FROM 8) 
WHERE "id" LIKE 'tk-cat-%' AND ("partnerSource" IS NULL OR "partnerSource" = 'local');

-- ============================================================================
-- 2. SẢN PHẨM ("Product")
-- ============================================================================
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "partnerSource" TEXT DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS "partnerId" TEXT,
  ADD COLUMN IF NOT EXISTS "partnerPrice" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "markupPercent" INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS "customPrice" INTEGER,
  ADD COLUMN IF NOT EXISTS "partnerStock" INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS "syncStatus" TEXT DEFAULT 'SYNCED',
  ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP WITHOUT TIME ZONE,
  ADD COLUMN IF NOT EXISTS "featuresJson" TEXT,
  ADD COLUMN IF NOT EXISTS "badge" TEXT;

CREATE INDEX IF NOT EXISTS "idx_product_partner" ON "Product" ("partnerSource", "partnerId");
CREATE INDEX IF NOT EXISTS "idx_product_status" ON "Product" ("status");
CREATE INDEX IF NOT EXISTS "idx_product_category" ON "Product" ("categoryId");

-- ============================================================================
-- 3. NHẬT KÝ ĐỒNG BỘ ĐỐI TÁC ("PartnerSyncLog")
-- ============================================================================
CREATE TABLE IF NOT EXISTS "PartnerSyncLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "partner" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "categoriesSynced" INTEGER DEFAULT 0,
  "productsSynced" INTEGER DEFAULT 0,
  "status" TEXT NOT NULL,
  "message" TEXT,
  "errorDetails" TEXT,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_sync_partner" ON "PartnerSyncLog" ("partner", "createdAt" DESC);

-- ============================================================================
-- 4. BANNER & SLIDER ĐỘNG ("Slider", "Banner")
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Slider" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "image" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "badge" TEXT,
  "sortOrder" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_slider_active" ON "Slider" ("isActive", "sortOrder");

CREATE TABLE IF NOT EXISTS "Banner" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "position" TEXT DEFAULT 'HOME_MIDDLE',
  "sortOrder" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_banner_active" ON "Banner" ("isActive", "position", "sortOrder");

-- ============================================================================
-- 5. BÀI VIẾT TIN TỨC & KHUYẾN MÃI ("NewsArticle")
-- ============================================================================
CREATE TABLE IF NOT EXISTS "NewsArticle" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "image" TEXT NOT NULL,
  "summary" TEXT,
  "content" TEXT,
  "author" TEXT DEFAULT 'Ban Biên Tập Betashop',
  "isPublished" BOOLEAN DEFAULT true,
  "publishedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_news_published" ON "NewsArticle" ("isPublished", "publishedAt" DESC);

-- ============================================================================
-- 6. CẤU HÌNH HỆ THỐNG MẶC ĐỊNH ("Setting")
-- ============================================================================
INSERT INTO "Setting" ("id", "key", "value", "group", "createdAt", "updatedAt")
VALUES
  ('set-store-name', 'storeName', 'BETASHOP – TỔNG KHO ĐỒ GIA DỤNG VIỆT NAM', 'GENERAL', NOW(), NOW()),
  ('set-hotline', 'hotline', '1900 8237', 'GENERAL', NOW(), NOW()),
  ('set-email', 'email', 'cskh@betashop.vn', 'GENERAL', NOW(), NOW()),
  ('set-address', 'address', 'Số 18 đường Phạm Hùng, P. Mỹ Đình 2, Q. Nam Từ Liêm, TP. Hà Nội', 'GENERAL', NOW(), NOW()),
  ('set-tax-code', 'taxCode', '0109988776', 'TAX', NOW(), NOW()),
  ('set-bank-name', 'bankName', 'Vietcombank (Chi nhánh Thăng Long, Hà Nội)', 'PAYMENT', NOW(), NOW()),
  ('set-bank-account', 'bankAccount', '9999 8888 6666', 'PAYMENT', NOW(), NOW()),
  ('set-bank-account-name', 'bankAccountName', 'CONG TY CO PHAN BETASHOP VIET NAM', 'PAYMENT', NOW(), NOW()),
  ('set-vat-default', 'vatDefault', '10', 'TAX', NOW(), NOW()),
  ('set-currency', 'currency', 'VND', 'GENERAL', NOW(), NOW()),
  ('set-timezone', 'timezone', 'Asia/Ho_Chi_Minh', 'GENERAL', NOW(), NOW()),
  ('set-auto-print', 'autoPrintReceipt', 'true', 'SYSTEM', NOW(), NOW()),
  ('set-negative-stock', 'allowNegativeStock', 'false', 'SYSTEM', NOW(), NOW()),
  ('set-primary-color', 'primaryColor', '#f53d2d', 'THEME', NOW(), NOW()),
  ('set-theme-preset', 'themePreset', 'orange', 'THEME', NOW(), NOW()),
  ('set-default-markup', 'default_markup', '20', 'PARTNER', NOW(), NOW()),
  ('set-store-name-alias', 'store_name', 'BETASHOP – TỔNG KHO ĐỒ GIA DỤNG VIỆT NAM', 'GENERAL', NOW(), NOW()),
  ('set-vat-default-alias', 'vat_default', '10', 'TAX', NOW(), NOW())
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW();

-- ============================================================================
-- 7. SEED SLIDER, BANNER, NEWSARTICLE MẪU ĐẢM BẢO 100% GIAO DIỆN
-- ============================================================================
INSERT INTO "Slider" ("id", "title", "subtitle", "image", "slug", "badge", "sortOrder", "isActive", "createdAt")
VALUES
  ('slider-1', 'LỄ HỘI ĐỒ GIA DỤNG – GIẢM ĐẾN 50%', 'Nồi chiên, bếp từ, robot hút bụi chính hãng bảo hành 2 năm', 'https://images.unsplash.com/photo-155691220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', '/san-pham', 'SIÊU SALE THÁNG NÀY', 1, true, NOW()),
  ('slider-2', 'BẾP THÔNG MINH – CUỘC SỐNG TIỆN NGHI', 'Miễn phí giao hàng toàn quốc – Hỗ trợ trả góp 0% lãi suất', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', '/san-pham', 'MỚI VỀ KHO', 2, true, NOW()),
  ('slider-3', 'GIẢI PHÁP KHÔNG KHÍ SẠCH CHO GIA ĐÌNH', 'Máy lọc không khí & Robot hút bụi lau nhà thông minh thế hệ mới', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80', '/san-pham', 'ƯU ĐÃI ĐẶC BIỆT', 3, true, NOW())
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "subtitle" = EXCLUDED."subtitle", "image" = EXCLUDED."image";

INSERT INTO "Banner" ("id", "title", "image", "slug", "position", "sortOrder", "isActive", "createdAt")
VALUES
  ('banner-1', 'Nồi chiên không dầu công nghệ Rapid Air', 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80', '/san-pham?danh-muc=noi-chien-khong-dau', 'HOME_MIDDLE', 1, true, NOW()),
  ('banner-2', 'Bếp điện từ đôi nhập khẩu công nghệ Inverter', 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=600&q=80', '/san-pham?danh-muc=bep-tu', 'HOME_MIDDLE', 2, true, NOW()),
  ('banner-3', 'Robot hút bụi lau nhà thông minh quét Laser 3D', 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=600&q=80', '/san-pham?danh-muc=may-hut-bui', 'HOME_MIDDLE', 3, true, NOW())
ON CONFLICT ("id") DO UPDATE SET "title" = EXCLUDED."title", "image" = EXCLUDED."image";

INSERT INTO "NewsArticle" ("id", "title", "slug", "image", "summary", "content", "author", "isPublished", "publishedAt")
VALUES
  ('news-1', 'Top 5 nồi chiên không dầu dung tích lớn đáng mua nhất cho gia đình đông người', 'top-noi-chien-khong-dau', 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=300&q=80', 'Tổng hợp những mẫu nồi chiên không dầu dung tích từ 6L trở lên đáng mua nhất hiện nay.', 'Nội dung chi tiết về các sản phẩm nồi chiên...', 'Ban Biên Tập Betashop', true, NOW()),
  ('news-2', 'Bí quyết chọn mua bếp từ đôi tiết kiệm điện và bền bỉ chuẩn chuyên gia', 'kinh-nghiem-chon-bep-tu', 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=300&q=80', 'Kinh nghiệm chọn mặt kính Schott Ceran, mâm từ E.G.O và công nghệ Inverter tiết kiệm điện năng.', 'Nội dung chi tiết về kinh nghiệm chọn bếp...', 'Ban Biên Tập Betashop', true, NOW()),
  ('news-3', 'Mẹo vệ sinh máy hút bụi cầm tay giúp máy tăng tuổi thọ gấp 3 lần', 've-sinh-may-hut-bui', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=300&q=80', 'Hướng dẫn làm sạch màng lọc HEPA, con lăn và hộp chứa bụi đúng cách.', 'Nội dung chi tiết về vệ sinh máy hút bụi...', 'Ban Biên Tập Betashop', true, NOW()),
  ('news-4', 'Tổng kho gia dụng khai trương chi nhánh thứ 15 – Hàng ngàn quà tặng hấp dẫn', 'khai-truong-chi-nhanh', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80', 'Sự kiện khai trương tưng bừng với hàng trăm deal sốc giảm đến 50%.', 'Nội dung sự kiện khai trương...', 'Ban Biên Tập Betashop', true, NOW())
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title", "summary" = EXCLUDED."summary";

-- ============================================================================
-- 8. THIẾT LẬP RLS POLICIES (BẢO ĐẢM ANON CLIENT SELECT ĐƯỢC DỮ LIỆU)
-- ============================================================================
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Category select" ON "Category";
CREATE POLICY "Public Category select" ON "Category" FOR SELECT USING (true);

ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Product select" ON "Product";
CREATE POLICY "Public Product select" ON "Product" FOR SELECT USING (true);

ALTER TABLE "Brand" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Brand select" ON "Brand";
CREATE POLICY "Public Brand select" ON "Brand" FOR SELECT USING (true);

ALTER TABLE "ProductImage" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public ProductImage select" ON "ProductImage";
CREATE POLICY "Public ProductImage select" ON "ProductImage" FOR SELECT USING (true);

ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public ProductVariant select" ON "ProductVariant";
CREATE POLICY "Public ProductVariant select" ON "ProductVariant" FOR SELECT USING (true);

ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Setting select" ON "Setting";
CREATE POLICY "Public Setting select" ON "Setting" FOR SELECT USING (true);

ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Review select" ON "Review";
CREATE POLICY "Public Review select" ON "Review" FOR SELECT USING (true);

ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Coupon select" ON "Coupon";
CREATE POLICY "Public Coupon select" ON "Coupon" FOR SELECT USING (true);

ALTER TABLE "Promotion" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Promotion select" ON "Promotion";
CREATE POLICY "Public Promotion select" ON "Promotion" FOR SELECT USING (true);

ALTER TABLE "ShippingZone" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public ShippingZone select" ON "ShippingZone";
CREATE POLICY "Public ShippingZone select" ON "ShippingZone" FOR SELECT USING (true);

ALTER TABLE "ShippingRate" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public ShippingRate select" ON "ShippingRate";
CREATE POLICY "Public ShippingRate select" ON "ShippingRate" FOR SELECT USING (true);

ALTER TABLE "Slider" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Slider select" ON "Slider";
CREATE POLICY "Public Slider select" ON "Slider" FOR SELECT USING (true);

ALTER TABLE "Banner" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Banner select" ON "Banner";
CREATE POLICY "Public Banner select" ON "Banner" FOR SELECT USING (true);

ALTER TABLE "NewsArticle" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public NewsArticle select" ON "NewsArticle";
CREATE POLICY "Public NewsArticle select" ON "NewsArticle" FOR SELECT USING (true);
`;

async function executeMigration() {
  console.log(`Starting Supabase schema migration for project ${SUPABASE_PROJECT_REF}...`);
  const endpoint = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_MGMT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: MIGRATION_SQL })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Migration failed with status ${response.status}: ${errorText}`);
    process.exit(1);
  }

  const result = await response.json();
  console.log('Migration successfully executed!', result);
}

executeMigration().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
