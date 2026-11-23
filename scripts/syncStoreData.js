const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Image fallback maps based on parent or category slug
const CATEGORY_IMAGES = {
  'cloud-vps': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80'
  ],
  'proxy-ip': [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
  ],
  'tai-khoan-quang-cao': [
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=600&q=80'
  ],
  'dich-vu-mmo': [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
  ],
  'phan-mem-ban-quyen': [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'
  ],
  'tien-ich-gia-dung': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  ]
};

function pickImage(parentSlug, id, currentThumbnail) {
  if (currentThumbnail && currentThumbnail.startsWith('http')) {
    return currentThumbnail;
  }
  const pool = CATEGORY_IMAGES[parentSlug] || CATEGORY_IMAGES['cloud-vps'];
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

async function syncData() {
  console.log('=== SYNCING DB PRODUCTS & CATEGORIES TO data/storeData.ts ===\n');

  // 1. Fetch categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      parent: true,
      children: {
        include: {
          _count: { select: { products: true } }
        }
      },
      _count: { select: { products: true } }
    },
    orderBy: { sortOrder: 'asc' }
  });

  // Calculate items in each parent category
  const parentCats = categories.filter(c => !c.parentId);
  const storeCategories = parentCats.map((p, idx) => {
    const totalItems = p._count.products + p.children.reduce((acc, ch) => acc + ch._count.products, 0);
    return {
      id: p.id,
      title: p.name,
      slug: `/danh-muc/${p.slug}`,
      image: p.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
      itemCount: totalItems,
      sortOrder: p.sortOrder || idx + 1
    };
  });

  // 2. Fetch all products
  const dbProducts = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    include: {
      category: {
        include: {
          parent: true
        }
      },
      brand: true
    },
    orderBy: [
      { isFeatured: 'desc' },
      { soldCount: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  console.log(`Loaded ${dbProducts.length} active products from Database.`);

  const storeProducts = dbProducts.map((p, idx) => {
    const parentSlug = p.category?.parent?.slug || p.category?.slug || 'cloud-vps';
    const parentName = p.category?.parent?.name || p.category?.name || 'Dịch Vụ Số';
    const catSlug = p.category?.slug || parentSlug;
    const catName = p.category?.name || parentName;
    const price = p.retailPrice || p.customPrice || 50000;
    const originalPrice = Math.round(price * 1.25);
    const discount = 20;
    const sold = p.soldCount && p.soldCount > 0 ? p.soldCount : (100 + (idx * 7) % 450);
    const rating = p.rating || 5.0;
    const reviewCount = 20 + (idx * 3) % 80;
    const image = pickImage(parentSlug, p.id, p.thumbnail);

    const isFeatured = p.isFeatured || idx < 15;
    const isFlashSale = isFeatured && (idx % 3 === 0);
    const isTrending = isFeatured && (idx % 2 === 0);

    return {
      id: p.id,
      title: p.name,
      name: p.name,
      slug: p.slug,
      image: image,
      images: [image],
      price: price,
      originalPrice: originalPrice,
      discount: discount,
      sold: sold,
      quantity: 999,
      stock: 999,
      warranty: p.warrantyMonths ? `Bảo hành ${p.warrantyMonths} tháng` : 'Bảo hành 1 đổi 1 24/7',
      category: catName,
      categorySlug: catSlug,
      parentCategorySlug: parentSlug,
      parentCategoryName: parentName,
      brand: p.brand?.name || parentName,
      rating: rating,
      reviewCount: reviewCount,
      isFlashSale: isFlashSale,
      isTrending: isTrending,
      isNew: p.isNew || false,
      isFeatured: isFeatured,
      badge: p.badge || (isFlashSale ? 'FLASH SALE' : (isTrending ? 'BÁN CHẠY' : null)),
      description: p.description || p.shortDesc || `Sản phẩm ${p.name} chất lượng cao, cung cấp ổn định, hỗ trợ kỹ thuật 24/7.`,
      features: [
        'Kích hoạt và giao dịch tự động 100%',
        'Hỗ trợ kỹ thuật 24/7 qua cổng CSKH',
        'Bảo hành 1 đổi 1 nhanh chóng',
        'Độ ổn định và bảo mật cao'
      ],
      specs: {
        'Loại dịch vụ': catName,
        'Nhóm danh mục': parentName,
        'Tình trạng': 'Sẵn sàng trong kho',
        'Hình thức cấp': 'Giao key / Thông tin tự động'
      }
    };
  });

  // Construct file contents
  const fileContent = `export interface Product {
  id: string | number;
  title: string;
  name?: string;
  slug: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  sold: number;
  quantity?: number;
  stock?: number;
  warranty?: string;
  category: string;
  categorySlug: string;
  parentCategorySlug?: string;
  parentCategoryName?: string;
  brand: string;
  rating: number;
  reviewCount: number;
  isFlashSale?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  badge?: string | null;
  description: string;
  features?: string[];
  specs?: Record<string, string>;
}

export interface Category {
  id: string | number;
  title: string;
  slug: string;
  image: string;
  itemCount?: number;
  sortOrder?: number;
}

export interface SliderItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  slug: string;
  badge?: string;
}

export interface BannerItem {
  id: number;
  title: string;
  image: string;
  slug: string;
}

export interface BrandItem {
  id: number;
  name: string;
  imgSrc: string;
}

export interface NavItem {
  id: number;
  title: string;
  slug: string;
}

export const STORE_NAVBARS: NavItem[] = [
  { id: 1, title: 'Trang chủ', slug: '/' },
  { id: 2, title: 'Tất cả sản phẩm', slug: '/san-pham' },
  { id: 3, title: 'Cloud VPS', slug: '/san-pham?danh-muc=cloud-vps' },
  { id: 4, title: 'Proxy Tốc Độ Cao', slug: '/san-pham?danh-muc=proxy-ip' },
  { id: 5, title: 'Tài Khoản Ads', slug: '/san-pham?danh-muc=tai-khoan-quang-cao' },
  { id: 6, title: 'Dịch Vụ MMO', slug: '/san-pham?danh-muc=dich-vu-mmo' },
  { id: 7, title: 'Phần Mềm Bản Quyền', slug: '/san-pham?danh-muc=phan-mem-ban-quyen' },
  { id: 8, title: 'Cộng tác viên', slug: '/cong-tac-vien' },
];

export const STORE_CATEGORIES: Category[] = ${JSON.stringify(storeCategories, null, 2)};

export const STORE_SLIDERS: SliderItem[] = [
  {
    id: 1,
    title: 'HỆ THỐNG CLOUD VPS & SERVER TỐC ĐỘ CAO',
    subtitle: 'Khởi tạo tức thì trong 30 giây – Băng thông không giới hạn – Hỗ trợ 24/7',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    slug: '/san-pham?danh-muc=cloud-vps',
    badge: 'GIỜ VÀNG ƯU ĐÃI',
  },
  {
    id: 2,
    title: 'PROXY 4G & DÂN CƯ SẠCH VIỆT NAM',
    subtitle: 'Độ trễ cực thấp – Xoay IP tự động – Phù hợp hoàn hảo cho MMO & Nuôi nick',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    slug: '/san-pham?danh-muc=proxy-ip',
    badge: 'HOT NHẤT',
  },
  {
    id: 3,
    title: 'NGUYÊN LIỆU ADS & TÀI KHOẢN KHÁNG SPAM',
    subtitle: 'Via ngoại, BM doanh nghiệp, Kênh livestream cổ bao tụt bảo hành 1 đổi 1',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
    slug: '/san-pham?danh-muc=tai-khoan-quang-cao',
    badge: 'CHUYÊN NGHIỆP',
  },
];

export const STORE_PROMOTION_NEWS = [
  {
    id: 1,
    title: 'Hướng dẫn lựa chọn cấu hình Cloud VPS tối ưu chi phí cho nhà phát triển',
    date: '21/11/2026',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80',
    slug: '/san-pham?danh-muc=cloud-vps',
  },
  {
    id: 2,
    title: 'Bí quyết nuôi tài khoản Facebook & Instagram an toàn với Proxy Dân Cư',
    date: '20/11/2026',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80',
    slug: '/san-pham?danh-muc=proxy-ip',
  },
  {
    id: 3,
    title: 'Tối ưu hóa chiến dịch quảng cáo với dàn Via XMDT và BM kháng ngân sách lớn',
    date: '19/11/2026',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=80',
    slug: '/san-pham?danh-muc=tai-khoan-quang-cao',
  },
];

export const STORE_BRANDS: BrandItem[] = [
  { id: 1, name: 'Cloud Server', imgSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80' },
  { id: 2, name: 'Proxy Network', imgSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80' },
  { id: 3, name: 'Marketing Ads', imgSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80' },
  { id: 4, name: 'MMO Automation', imgSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80' },
  { id: 5, name: 'Digital Software', imgSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80' },
];

export const STORE_BANNERS: BannerItem[] = [
  {
    id: 1,
    title: 'Cloud VPS SSD NVMe Khởi Tạo Tự Động Trong 30 Giây',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    slug: '/san-pham?danh-muc=cloud-vps',
  },
  {
    id: 2,
    title: 'Proxy 4G & Dân Cư Tốc Độ Cao Sạch 100% Việt Nam',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    slug: '/san-pham?danh-muc=proxy-ip',
  },
  {
    id: 3,
    title: 'Dàn Via Cổ & BM Doanh Nghiệp Kháng Spam Bao Tụt',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    slug: '/san-pham?danh-muc=tai-khoan-quang-cao',
  },
];

export const STORE_FOOTER_CONTENT = [
  {
    title: 'VỀ BETASHOP',
    children: [
      { title: 'Giới thiệu công ty', slug: '/gioi-thieu' },
      { title: 'Hệ thống showroom', slug: '/he-thong-cua-hang' },
      { title: 'Tuyển dụng', slug: '/tuyen-dung' },
      { title: 'Chính sách bảo mật', slug: '/chinh-sach-bao-mat' },
      { title: 'Điều khoản dịch vụ', slug: '/dieu-khoan' },
    ],
  },
  {
    title: 'HỖ TRỢ KHÁCH HÀNG',
    children: [
      { title: 'Hướng dẫn mua hàng & kích hoạt', slug: '/huong-dan-mua-hang' },
      { title: 'Chính sách bảo hành 1 đổi 1', slug: '/chinh-sach-bao-hanh' },
      { title: 'Chính sách hoàn tiền', slug: '/chinh-sach-hoan-tien' },
      { title: 'Tra cứu đơn hàng', slug: '/don-hang' },
      { title: 'Liên hệ & Góp ý', slug: '/lien-he' },
    ],
  },
  {
    title: 'CHỨNG NHẬN & THANH TOÁN',
    children: [
      { title: 'Thanh toán VietQR / Napas 247', slug: '/thanh-toan' },
      { title: 'Ví MoMo / ZaloPay', slug: '/thanh-toan' },
      { title: 'Chuyển khoản ngân hàng tự động', slug: '/thanh-toan' },
      { title: 'Đối tác chiến lược B2B', slug: '/hop-tac' },
    ],
  },
];

export const STORE_PRODUCTS: Product[] = ${JSON.stringify(storeProducts, null, 2)};
`;

  const outputPath = path.join(__dirname, '..', 'data', 'storeData.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`\n✓ SUCCESS: Written ${storeProducts.length} products and ${storeCategories.length} categories to data/storeData.ts`);
}

syncData().catch(console.error).finally(() => prisma.$disconnect());
