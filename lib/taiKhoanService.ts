/**
 * TaiKhoan.site Partner API Integration Service
 * Documentation: https://taikhoan.site/client/document-api
 */

export interface TaiKhoanProfile {
  status: string;
  msg: string;
  data: {
    username: string;
    money: string;
  };
}

export interface TaiKhoanApiProduct {
  id: string | number;
  name: string;
  price: number;
  amount?: number;
  stock?: number;
  description?: string;
  min?: number;
  max?: number;
  flag?: string | null;
}

export interface TaiKhoanApiCategory {
  id: string | number;
  name: string;
  parent_id: number;
  icon?: string;
  products?: TaiKhoanApiProduct[];
}

export interface TaiKhoanBuyResponse {
  status: 'success' | 'error';
  msg: string;
  trans_id?: string;
  data?: string[];
}

const TAIKHOAN_BASE_URL =
  process.env.TAIKHOAN_API_BASE_URL || 'https://taikhoan.site';
const TAIKHOAN_API_KEY =
  process.env.TAIKHOAN_API_KEY ||
  '2cd87d67c9b19e9ab7b6a0a944cefbe3jm90cW4wgsqhp7BiXbdnauUK8EMH3FC5';

const DEFAULT_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
};

/**
 * 1. Lấy thông tin tài khoản & số dư đại lý
 * GET https://taikhoan.site/api/profile.php?api_key=...
 */
export async function getTaiKhoanProfile(): Promise<TaiKhoanProfile> {
  const url = `${TAIKHOAN_BASE_URL}/api/profile.php?api_key=${encodeURIComponent(
    TAIKHOAN_API_KEY
  )}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi kết nối TaiKhoan.site API: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * 2. Lấy danh sách chuyên mục và sản phẩm
 * GET https://taikhoan.site/api/products.php?api_key=...
 */
export async function getTaiKhoanProducts(): Promise<{
  status: string;
  msg: string;
  categories: TaiKhoanApiCategory[];
}> {
  const url = `${TAIKHOAN_BASE_URL}/api/products.php?api_key=${encodeURIComponent(
    TAIKHOAN_API_KEY
  )}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Lỗi kết nối TaiKhoan.site API: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * 3. Lấy chi tiết sản phẩm
 * GET https://taikhoan.site/api/product.php?api_key=...&product=...
 */
export async function getTaiKhoanProductDetail(productId: string | number): Promise<{
  status: string;
  msg: string;
  product: TaiKhoanApiProduct[];
}> {
  const url = `${TAIKHOAN_BASE_URL}/api/product.php?api_key=${encodeURIComponent(
    TAIKHOAN_API_KEY
  )}&product=${encodeURIComponent(productId)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi kết nối TaiKhoan.site API: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * 4. Mua hàng / Tạo đơn hàng
 * POST https://taikhoan.site/api/buy_product
 */
export async function buyTaiKhoanProduct(params: {
  id: string | number;
  amount: number;
  coupon?: string;
}): Promise<TaiKhoanBuyResponse> {
  const url = `${TAIKHOAN_BASE_URL}/api/buy_product`;

  const formData = new URLSearchParams();
  formData.append('action', 'buyProduct');
  formData.append('id', String(params.id));
  formData.append('amount', String(params.amount));
  if (params.coupon) {
    formData.append('coupon', params.coupon);
  }
  formData.append('api_key', TAIKHOAN_API_KEY);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    throw new Error(`Lỗi mua hàng trên TaiKhoan.site API: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * 5. Lấy chi tiết đơn hàng
 * GET https://taikhoan.site/api/order.php?api_key=...&order=...
 */
export async function getTaiKhoanOrderDetail(orderId: string): Promise<any> {
  const url = `${TAIKHOAN_BASE_URL}/api/order.php?api_key=${encodeURIComponent(
    TAIKHOAN_API_KEY
  )}&order=${encodeURIComponent(orderId)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Lỗi tra cứu đơn hàng TaiKhoan.site: HTTP ${res.status}`);
  }

  return res.json();
}
