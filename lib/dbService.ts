import fs from 'fs';
import path from 'path';
import { STORE_PRODUCTS, STORE_CATEGORIES, STORE_BRANDS, Product } from '@/data/storeData';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { mapCategoryRow, mapProductRow, mapOrderRow } from '@/lib/adminDb';

export interface OrderItem {
  productId: string | number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  province: string;
  district: string;
  note?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  finalTotal: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELED';
  statusText: string;
  paymentMethod: 'COD' | 'VIETQR' | 'MOMO';
  createdAt: string;
}

export interface AppDatabase {
  products: Product[];
  categories: { id: string | number; title: string; slug: string; itemCount: number }[];
  brands: string[];
  shops: string[];
  units: string[];
  orders: Order[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

// Memory cache
let dbMemoryCache: AppDatabase | null = null;

function initDb(): AppDatabase {
  const initialDb: AppDatabase = {
    products: STORE_PRODUCTS,
    categories: STORE_CATEGORIES.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug.replace('/danh-muc/', ''),
      itemCount: c.itemCount || 10,
    })),
    brands: ['Philips', 'Panasonic', 'Cuckoo', 'Sunhouse', 'Dreame', 'Xiaomi', 'Lock&Lock', 'Tefal', 'Sharp', 'Dyson', 'Hurom'],
    shops: [
      'Showroom Cầu Giấy (Tổng Kho Hà Nội)',
      'Showroom Đống Đa - Hà Nội',
      'Showroom Quận 3 (Tổng Kho TP.HCM)',
      'Showroom Gò Vấp - TP.HCM',
      'Showroom Hải Châu - Đà Nẵng',
    ],
    units: ['Chiếc', 'Bộ', 'Cái', 'Hộp', 'Máy'],
    orders: [
      {
        id: 'ord-1',
        code: 'BS2611-9A82B',
        customerName: 'Trần Văn Hải',
        phone: '0988 123 456',
        address: 'Số 45 phố Nguyễn Khang, P. Yên Hòa',
        province: 'Hà Nội',
        district: 'Cầu Giấy',
        items: [
          {
            productId: 'sp-03',
            title: 'Bếp từ đôi Inverter Sunhouse Mama MMB9201DIH',
            price: 5290000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=300&q=80',
          },
        ],
        totalAmount: 5290000,
        shippingFee: 0,
        finalTotal: 5290000,
        status: 'COMPLETED',
        statusText: 'Đã hoàn thành',
        paymentMethod: 'VIETQR',
        createdAt: '16/11/2026 10:15',
      },
    ],
  };

  try {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error initializing db', err);
  }

  return initialDb;
}

export function readDb(): AppDatabase {
  if (dbMemoryCache) return dbMemoryCache;
  try {
    if (!fs.existsSync(DB_PATH)) {
      dbMemoryCache = initDb();
      return dbMemoryCache;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    dbMemoryCache = JSON.parse(raw);
    return dbMemoryCache!;
  } catch (err) {
    console.error('Error reading db', err);
    dbMemoryCache = initDb();
    return dbMemoryCache;
  }
}

export function writeDb(data: AppDatabase): void {
  dbMemoryCache = data;
  try {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    let existing = {};
    if (fs.existsSync(DB_PATH)) {
      try {
        existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      } catch (e) {}
    }
    const combined = { ...existing, ...data };
    fs.writeFileSync(DB_PATH, JSON.stringify(combined, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db', err);
  }
}

// -------------------------------------------------------------
// DIRECT SUPABASE QUERY SERVICES FOR STOREFRONT & API ROUTES
// -------------------------------------------------------------

export async function getPublicCategories(): Promise<any[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('Category')
      .select('*')
      .eq('isActive', true)
      .order('sortOrder', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapCategoryRow);
  } catch (err) {
    console.warn('[dbService] getPublicCategories falling back to local:', err);
    return readDb().categories;
  }
}

export async function getPublicProducts(filter?: {
  category?: string;
  brand?: string;
  search?: string;
}): Promise<Product[]> {
  try {
    let query = supabaseAdmin
      .from('Product')
      .select('*, category:Category(name, slug), brand:Brand(name, slug)')
      .eq('status', 'ACTIVE')
      .order('createdAt', { ascending: false });

    if (filter?.category && filter.category !== 'all') {
      const clean = filter.category.replace(/^\//, '').replace(/^danh-muc\//, '');
      query = query.or(`category.slug.eq.${clean},category.name.ilike.%${clean}%`);
    }

    if (filter?.brand && filter.brand !== 'all') {
      query = query.ilike('brand.name', `%${filter.brand}%`);
    }

    if (filter?.search) {
      query = query.ilike('name', `%${filter.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(mapProductRow);
  } catch (err) {
    console.warn('[dbService] getPublicProducts falling back to local:', err);
    let list = readDb().products || [];
    if (filter?.category && filter.category !== 'all') {
      list = list.filter((p) => p.categorySlug === filter.category || p.category === filter.category);
    }
    if (filter?.brand && filter.brand !== 'all') {
      list = list.filter((p) => p.brand === filter.brand);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    return list;
  }
}

export async function getPublicBrands(): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin.from('Brand').select('name').order('name');
    if (error) throw error;
    if (data && data.length > 0) return data.map((b: any) => b.name);
    return readDb().brands;
  } catch (err) {
    return readDb().brands;
  }
}

export async function getDbFromSupabase(): Promise<AppDatabase> {
  const [categories, products, brands] = await Promise.all([
    getPublicCategories(),
    getPublicProducts(),
    getPublicBrands(),
  ]);

  const fallback = readDb();
  const db: AppDatabase = {
    products,
    categories: categories.map((c) => ({
      id: c.id,
      title: c.name,
      slug: c.slug,
      itemCount: c.itemCount || 0,
    })),
    brands,
    shops: fallback.shops || [],
    units: fallback.units || [],
    orders: fallback.orders || [],
  };

  dbMemoryCache = db;
  return db;
}
