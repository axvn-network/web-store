/**
 * Thanhplus.vn Partner API Integration Service
 * Documentation: https://thanhplus.vn/scalar/#tag/products/GET/api/Products
 */

export interface ThanhPlusUserInfo {
  status: string;
  msg: string;
  data: {
    username: string;
    money: number;
  };
}

export interface ThanhPlusProduct {
  id: string;
  name: string;
  price: string | number;
  amount: number;
  shortContent?: string;
  image?: string;
  category?: string;
}

export interface ThanhPlusCategory {
  name: string;
  products: ThanhPlusProduct[];
}

export interface ThanhPlusProductsResponse {
  status: string;
  msg: string;
  categories: ThanhPlusCategory[];
}

export interface ThanhPlusPurchaseResponse {
  status: 'success' | 'error' | string;
  msg: string;
  transid?: string;
  data?: string[];
}

const THANHPLUS_BASE_URL =
  process.env.THANHPLUS_API_BASE_URL || 'https://thanhplus.vn';
const THANHPLUS_API_KEY =
  process.env.THANHPLUS_API_KEY || 'IWS8ZDTR7LZ38O41KZOW1795181728795M45C8B';

function getHeaders() {
  return {
    'X-API-KEY': THANHPLUS_API_KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  };
}

/**
 * 1. Lấy thông tin tài khoản người dùng
 * GET /api/User/GetInfo
 */
export async function getThanhPlusUserInfo(): Promise<ThanhPlusUserInfo> {
  const url = `${THANHPLUS_BASE_URL}/api/User/GetInfo`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi lấy thông tin Thanhplus: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 2. Lấy danh sách sản phẩm theo loại
 * GET /api/Products?type=all|taikhoan|dichvu
 */
export async function getThanhPlusProducts(
  type: 'all' | 'taikhoan' | 'dichvu' = 'all'
): Promise<ThanhPlusProductsResponse> {
  const url = `${THANHPLUS_BASE_URL}/api/Products?type=${encodeURIComponent(type)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi lấy sản phẩm Thanhplus: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 3. Lấy chi tiết sản phẩm theo GUID
 * GET /api/Products/{id}
 */
export async function getThanhPlusProductDetail(id: string): Promise<{
  status: string;
  msg: string;
  data: ThanhPlusProduct;
}> {
  const url = `${THANHPLUS_BASE_URL}/api/Products/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi lấy chi tiết sản phẩm Thanhplus: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 4. Tạo đơn hàng mua sản phẩm hoặc dịch vụ
 * POST /Purchase
 */
export async function purchaseThanhPlusProduct(body: {
  productid: string;
  quantity?: number;
  service_info?: string;
}): Promise<ThanhPlusPurchaseResponse> {
  const url = `${THANHPLUS_BASE_URL}/Purchase`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      productid: body.productid,
      quantity: body.quantity || 1,
      service_info: body.service_info || 'order@store.vn',
    }),
  });

  const data = await res.json();
  if (!res.ok || data.status === 'error') {
    throw new Error(data.msg || `Lỗi đặt hàng Thanhplus: HTTP ${res.status}`);
  }

  return data;
}
