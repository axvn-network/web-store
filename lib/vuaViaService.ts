/**
 * VuaVia.io Partner API Integration Service
 * Documentation: https://vuavia.io/tai-lieu-api
 */

export interface VuaViaProduct {
  id: number;
  name: string;
  price: number;
  stockCount: number;
  deliveryType: 'AUTO' | 'MANUAL';
  categoryId: number;
  categoryName: string;
}

export interface VuaViaProductsResponse {
  success: boolean;
  message: string;
  data: {
    content: VuaViaProduct[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
  error: any;
}

export interface VuaViaOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    status: 'DELIVERED' | 'PENDING_DELIVERY' | string;
    totalAmount: number;
    quantity: number;
    deliveredItems: string[];
    createdAt: string;
    productName?: string;
  };
  error: any;
}

const VUAVIA_BASE_URL =
  process.env.VUAVIA_API_BASE_URL || 'https://api.vuavia.io/api/v2';
const VUAVIA_API_KEY =
  process.env.VUAVIA_API_KEY || 'vav_e9935f2bf607d802b82c44272742b513';

function getHeaders() {
  return {
    'X-Api-Key': VUAVIA_API_KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  };
}

/**
 * 1. Lấy số dư ví hiện tại
 * GET /wallet/balance
 */
export async function getVuaViaBalance(): Promise<{
  success: boolean;
  message?: string;
  data: { balance: number };
  error?: any;
}> {
  const url = `${VUAVIA_BASE_URL}/wallet/balance`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi kết nối VuaVia API: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 2. Lấy danh sách sản phẩm đang bán
 * GET /products?q=&categoryId=&page=&size=&sort=
 */
export async function getVuaViaProducts(params?: {
  q?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
}): Promise<VuaViaProductsResponse> {
  const query = new URLSearchParams();
  if (params?.q) query.append('q', params.q);
  if (params?.categoryId !== undefined)
    query.append('categoryId', String(params.categoryId));
  if (params?.page !== undefined) query.append('page', String(params.page));
  if (params?.size !== undefined) query.append('size', String(params.size));
  if (params?.sort) query.append('sort', params.sort);

  const queryString = query.toString();
  const url = `${VUAVIA_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi lấy danh sách sản phẩm VuaVia: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 3. Mua sản phẩm
 * POST /orders
 */
export async function buyVuaViaProduct(body: {
  productId: number;
  quantity: number;
}): Promise<VuaViaOrderResponse> {
  const url = `${VUAVIA_BASE_URL}/orders`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(
      data.message || `Lỗi đặt hàng VuaVia: HTTP ${res.status}`
    );
  }

  return data;
}

/**
 * 4. Lấy lịch sử đơn hàng
 * GET /orders?page=0&size=20
 */
export async function getVuaViaOrders(params?: {
  page?: number;
  size?: number;
}): Promise<any> {
  const query = new URLSearchParams();
  if (params?.page !== undefined) query.append('page', String(params.page));
  if (params?.size !== undefined) query.append('size', String(params.size));

  const queryString = query.toString();
  const url = `${VUAVIA_BASE_URL}/orders${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi xem lịch sử đơn VuaVia: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 5. Lấy chi tiết một đơn hàng & danh sách hàng đã giao
 * GET /orders/{id}
 */
export async function getVuaViaOrderDetail(orderId: number | string): Promise<VuaViaOrderResponse> {
  const url = `${VUAVIA_BASE_URL}/orders/${orderId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi lấy chi tiết đơn VuaVia: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}
