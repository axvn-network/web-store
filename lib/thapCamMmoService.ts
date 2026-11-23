/**
 * ThapCamMMO.vn Partner API Integration Service
 * Documentation: https://thapcammmo.vn/tai-lieu-api/
 */

export interface ThapCamBalanceResponse {
  data: {
    balance: number;
    email?: string;
  };
  message: string;
}

export interface ThapCamServiceItem {
  id: string;
  name: string;
  price: number;
  serviceType: 'add_member' | 'sell_group' | 'sell_proxy' | 'sell_buff' | 'sell_catalog';
  meta?: {
    buyMin?: number;
    buyMax?: number;
    min?: number;
    max?: number;
    storeQuantity?: number;
    purchaseMode?: 'checkout' | 'contact';
    pricingMode?: 'one_time' | 'options';
    pricingOptions?: Array<{ id: string; name: string; price: number }>;
    kind?: 'software-mkt' | 'source-code' | 'mkt-fb' | 'course';
    type?: string;
  };
}

export interface ThapCamOrderPayload {
  serviceId: string;
  quantity?: number;
  groupLinks?: string[];
  buffLink?: string;
  buffComments?: string;
  pricingOptionId?: string;
  userNote?: string;
}

export interface ThapCamOrderResponse {
  data: {
    id: string;
    orderCode: string;
    serviceId: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded' | 'partially_refunded';
    amount: number;
    quantity: number;
    deliveredItems?: string[];
  };
  message: string;
}

const THAPCAMMMO_BASE_URL =
  process.env.THAPCAMMMO_API_BASE_URL || 'https://api.thapcammmo.vn';
const THAPCAMMMO_API_KEY =
  process.env.THAPCAMMMO_API_KEY || 'fag_QP1koV6eCa-PP4f0ICZ_7WgUUmQmTjxd';

function getHeaders() {
  return {
    'X-API-Key': THAPCAMMMO_API_KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  };
}

/**
 * 1. Lấy số dư ví hiện tại
 * GET /v1/balance
 */
export async function getThapCamBalance(): Promise<ThapCamBalanceResponse> {
  const url = `${THAPCAMMMO_BASE_URL}/v1/balance`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi kết nối ThapCamMMO: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 2. Lấy danh sách dịch vụ
 * GET /v1/services?serviceType=add_member|sell_group|sell_proxy|sell_buff|sell_catalog
 */
export async function getThapCamServices(
  serviceType?: 'add_member' | 'sell_group' | 'sell_proxy' | 'sell_buff' | 'sell_catalog'
): Promise<{ data: ThapCamServiceItem[]; message: string }> {
  const query = serviceType ? `?serviceType=${encodeURIComponent(serviceType)}` : '';
  const url = `${THAPCAMMMO_BASE_URL}/v1/services${query}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi lấy dịch vụ ThapCamMMO: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 3. Tạo đơn hàng (chỉ gửi serviceId + field phụ, không gửi serviceType)
 * POST /v1/orders
 */
export async function createThapCamOrder(
  payload: ThapCamOrderPayload
): Promise<ThapCamOrderResponse> {
  const url = `${THAPCAMMMO_BASE_URL}/v1/orders`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || data.statusCode >= 400) {
    const errMsg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    throw new Error(errMsg || `Lỗi tạo đơn ThapCamMMO: HTTP ${res.status}`);
  }

  return data;
}

/**
 * 4. Lấy danh sách đơn hàng
 * GET /v1/orders?page=1&pageSize=20&status=&serviceType=
 */
export async function getThapCamOrders(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  serviceType?: string;
}): Promise<any> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.pageSize) query.append('pageSize', String(params.pageSize));
  if (params?.status) query.append('status', params.status);
  if (params?.serviceType) query.append('serviceType', params.serviceType);

  const queryString = query.toString();
  const url = `${THAPCAMMMO_BASE_URL}/v1/orders${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi lấy danh sách đơn ThapCamMMO: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}

/**
 * 5. Chi tiết đơn hàng theo orderCode
 * GET /v1/orders/:orderCode
 */
export async function getThapCamOrderDetail(
  orderCode: string
): Promise<ThapCamOrderResponse> {
  const url = `${THAPCAMMMO_BASE_URL}/v1/orders/${encodeURIComponent(orderCode)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Lỗi chi tiết đơn ThapCamMMO: HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}
