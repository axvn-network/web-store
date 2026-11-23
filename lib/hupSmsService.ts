/**
 * HupSMS.com Partner API Integration Service
 * Documentation: https://hupsms.com/api-docs
 */

export interface HupSmsProxyService {
  id: number;
  name: string;
  price: number;
  category?: string;
}

export interface HupSmsProxyOrderResult {
  orderId: string;
  proxyKey: string;
  proxyInfo: string | null;
  expireTime: number | null;
  totalPrice: number;
}

const HUPSMS_BASE_URL =
  process.env.HUPSMS_API_BASE_URL || 'https://hupsms.com/api/v1';
const HUPSMS_API_KEY =
  process.env.HUPSMS_API_KEY ||
  'hup_diU_B9nHS0KxWqKcYV7sBbdpoWgnV9y2TXnMTXgVOgBfRcMm';

function getHeaders() {
  return {
    Accept: 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  };
}

// ========================
// 1. PROXY THƯỜNG
// ========================

/**
 * Lấy danh sách dịch vụ proxy khả dụng
 * GET /proxy/services?api_key=...
 */
export async function getHupSmsProxyServices(): Promise<{
  status: string;
  message: string;
  data: HupSmsProxyService[];
}> {
  const url = `${HUPSMS_BASE_URL}/proxy/services?api_key=${encodeURIComponent(
    HUPSMS_API_KEY
  )}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Lỗi lấy danh sách proxy HupSMS: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Mua proxy từ dịch vụ đã chọn
 * GET /proxy/buy?api_key=...&serviceId=1&days=30&quantity=1&type=HTTP
 */
export async function buyHupSmsProxy(params: {
  serviceId: number;
  days: number;
  quantity?: number;
  type?: 'HTTP' | 'SOCKS5';
}): Promise<any> {
  const query = new URLSearchParams({
    api_key: HUPSMS_API_KEY,
    serviceId: String(params.serviceId),
    days: String(params.days),
    quantity: String(params.quantity || 1),
    type: params.type || 'HTTP',
  });

  const url = `${HUPSMS_BASE_URL}/proxy/buy?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  const data = await res.json();
  if (!res.ok || data.status === 'error') {
    throw new Error(data.message || `Lỗi mua proxy HupSMS: HTTP ${res.status}`);
  }

  return data;
}

/**
 * Lấy danh sách đơn proxy
 * GET /proxy/orders?api_key=...
 */
export async function getHupSmsProxyOrders(params?: {
  status?: string;
  serviceId?: number;
  page?: number;
  limit?: number;
}): Promise<any> {
  const query = new URLSearchParams({ api_key: HUPSMS_API_KEY });
  if (params?.status) query.append('status', params.status);
  if (params?.serviceId) query.append('serviceId', String(params.serviceId));
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  const url = `${HUPSMS_BASE_URL}/proxy/orders?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Gia hạn proxy
 * GET /proxy/extend?api_key=...&id=...&days=...
 */
export async function extendHupSmsProxy(params: {
  id: string;
  days: number;
}): Promise<any> {
  const query = new URLSearchParams({
    api_key: HUPSMS_API_KEY,
    id: params.id,
    days: String(params.days),
  });

  const url = `${HUPSMS_BASE_URL}/proxy/extend?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Đổi IP cho proxy xoay
 * GET /proxy/change-ip?api_key=...&proxy_key=...
 */
export async function changeHupSmsProxyIp(params: {
  proxyKey?: string;
  id?: string;
}): Promise<any> {
  const query = new URLSearchParams({ api_key: HUPSMS_API_KEY });
  if (params.proxyKey) query.append('proxy_key', params.proxyKey);
  if (params.id) query.append('id', params.id);

  const url = `${HUPSMS_BASE_URL}/proxy/change-ip?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Đổi auth proxy (username/password/type)
 * GET /proxy/change-auth?api_key=...&username=...&password=...&type=...
 */
export async function changeHupSmsProxyAuth(params: {
  username: string;
  password: string;
  type?: 'HTTP' | 'SOCKS5';
  proxyKey?: string;
  id?: string;
}): Promise<any> {
  const query = new URLSearchParams({
    api_key: HUPSMS_API_KEY,
    username: params.username,
    password: params.password,
  });
  if (params.type) query.append('type', params.type);
  if (params.proxyKey) query.append('proxy_key', params.proxyKey);
  if (params.id) query.append('id', params.id);

  const url = `${HUPSMS_BASE_URL}/proxy/change-auth?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Cài đặt tự động đổi IP cho proxy xoay
 * GET /proxy/settings?api_key=...&change_ip_time=5m
 */
export async function updateHupSmsProxySettings(params: {
  changeIpTime: string;
  proxyKey?: string;
  id?: string;
}): Promise<any> {
  const query = new URLSearchParams({
    api_key: HUPSMS_API_KEY,
    change_ip_time: params.changeIpTime,
  });
  if (params.proxyKey) query.append('proxy_key', params.proxyKey);
  if (params.id) query.append('id', params.id);

  const url = `${HUPSMS_BASE_URL}/proxy/settings?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

// ========================
// 2. PROXY VIP
// ========================

/**
 * Danh sách dịch vụ proxy xoay VIP
 * GET /vip-proxy/services?api_key=...
 */
export async function getHupSmsVipProxyServices(): Promise<{
  status: string;
  message: string;
  data: HupSmsProxyService[];
}> {
  const url = `${HUPSMS_BASE_URL}/vip-proxy/services?api_key=${encodeURIComponent(
    HUPSMS_API_KEY
  )}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Lỗi lấy danh sách proxy VIP HupSMS: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Mua proxy VIP
 * GET /vip-proxy/buy?api_key=...&serviceId=1&expire=1&quantity=1
 */
export async function buyHupSmsVipProxy(params: {
  serviceId: number;
  expire: number;
  quantity?: number;
}): Promise<any> {
  const query = new URLSearchParams({
    api_key: HUPSMS_API_KEY,
    serviceId: String(params.serviceId),
    expire: String(params.expire),
    quantity: String(params.quantity || 1),
  });

  const url = `${HUPSMS_BASE_URL}/vip-proxy/buy?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  const data = await res.json();
  if (!res.ok || data.status === 'error') {
    throw new Error(data.message || `Lỗi mua proxy VIP HupSMS: HTTP ${res.status}`);
  }

  return data;
}

/**
 * Danh sách đơn proxy VIP
 * GET /vip-proxy/orders?api_key=...
 */
export async function getHupSmsVipProxyOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<any> {
  const query = new URLSearchParams({ api_key: HUPSMS_API_KEY });
  if (params?.status) query.append('status', params.status);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  const url = `${HUPSMS_BASE_URL}/vip-proxy/orders?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Gia hạn proxy VIP
 * GET /vip-proxy/extend?api_key=...&id=...&expire=...
 */
export async function extendHupSmsVipProxy(params: {
  id: string;
  expire: number;
}): Promise<any> {
  const query = new URLSearchParams({
    api_key: HUPSMS_API_KEY,
    id: params.id,
    expire: String(params.expire),
  });

  const url = `${HUPSMS_BASE_URL}/vip-proxy/extend?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Đổi IP cho proxy VIP
 * GET /vip-proxy/change-ip?api_key=...&proxy_key=...
 */
export async function changeHupSmsVipProxyIp(params: {
  proxyKey?: string;
  id?: string;
}): Promise<any> {
  const query = new URLSearchParams({ api_key: HUPSMS_API_KEY });
  if (params.proxyKey) query.append('proxy_key', params.proxyKey);
  if (params.id) query.append('id', params.id);

  const url = `${HUPSMS_BASE_URL}/vip-proxy/change-ip?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Lấy thông tin proxy VIP
 * GET /vip-proxy/info?api_key=...&proxy_key=...
 */
export async function getHupSmsVipProxyInfo(params: {
  proxyKey?: string;
  id?: string;
}): Promise<any> {
  const query = new URLSearchParams({ api_key: HUPSMS_API_KEY });
  if (params.proxyKey) query.append('proxy_key', params.proxyKey);
  if (params.id) query.append('id', params.id);

  const url = `${HUPSMS_BASE_URL}/vip-proxy/info?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Cài đặt proxy VIP
 * GET /vip-proxy/settings?api_key=...&filter_ip=...&change_ip_time=...
 */
export async function updateHupSmsVipProxySettings(params: {
  filterIp?: string;
  changeIpTime?: string;
  proxyKey?: string;
  id?: string;
}): Promise<any> {
  const query = new URLSearchParams({ api_key: HUPSMS_API_KEY });
  if (params.filterIp !== undefined) query.append('filter_ip', params.filterIp);
  if (params.changeIpTime !== undefined)
    query.append('change_ip_time', params.changeIpTime);
  if (params.proxyKey) query.append('proxy_key', params.proxyKey);
  if (params.id) query.append('id', params.id);

  const url = `${HUPSMS_BASE_URL}/vip-proxy/settings?${query.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

// ========================
// 3. ZALO OTP & THUÊ SIM
// ========================

/**
 * Hủy đơn Zalo và hoàn tiền
 * GET /zalo/:id/cancel?api_key=...
 */
export async function cancelHupSmsZalo(orderId: string | number): Promise<any> {
  const url = `${HUPSMS_BASE_URL}/zalo/${orderId}/cancel?api_key=${encodeURIComponent(
    HUPSMS_API_KEY
  )}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}

/**
 * Thuê lại Zalo đã sử dụng trước đó
 * GET /zalo/rerent?api_key=...&phone=...
 */
export async function rerentHupSmsZalo(phone: string): Promise<any> {
  const url = `${HUPSMS_BASE_URL}/zalo/rerent?api_key=${encodeURIComponent(
    HUPSMS_API_KEY
  )}&phone=${encodeURIComponent(phone)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });

  return res.json();
}
