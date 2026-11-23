/**
 * XVPS Agency API Integration Service
 * Tài liệu: https://developer.xvps.vn/docs?page=overview
 * Đại lý: Nam Vũ (VIP 1) - namlangtu20162@gmail.com
 */

export interface XvpsAgencyInfo {
  username: string;
  agencyName: string;
  email: string;
  vipLevel: string;
  discountPercent: number;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED';
  activeVpsCount: number;
}

export interface CloudProductPlan {
  id: string;
  code: string;
  name: string;
  category: 'cloud-hosting' | 'vps-vmware' | 'vps-kvm';
  categoryName: string;
  cpu: string;
  ram: string;
  storage: string;
  storageType: string;
  bandwidth: string;
  ip: string;
  backup: string;
  priceMonthly: number;
  priceQuarterly: number;
  priceYearly: number;
  badge?: string;
  popular?: boolean;
  features: string[];
}

export interface OperatingSystem {
  id: string;
  name: string;
  family: 'windows' | 'linux';
  version: string;
  icon: string;
  isPopular?: boolean;
}

export interface CustomerVpsInstance {
  id: string;
  code: string;
  name: string;
  planId: string;
  planName: string;
  type: 'cloud-hosting' | 'vps-vmware' | 'vps-kvm';
  ipAddress: string;
  hostname: string;
  os: string;
  cpu: string;
  ram: string;
  storage: string;
  status: 'RUNNING' | 'STOPPED' | 'REBUILDING' | 'EXPIRED';
  uptime: string;
  createdAt: string;
  expiredAt: string;
  autoRenew: boolean;
  adminUser?: string;
  adminPassword?: string;
}

// Cấu hình Credentials mặc định từ ENV hoặc Sandbox
const XVPS_CONFIG = {
  baseUrl: process.env.XVPS_API_BASE_URL || 'https://api.xvps.vn',
  username: process.env.XVPS_API_USERNAME || 'test_user_45360879',
  app: process.env.XVPS_API_APP || 'sandbox_app_fbccdc',
  secret: process.env.XVPS_API_SECRET || 'xvps_sandbox_secret',
  authToken: process.env.XVPS_AUTH_TOKEN || 'sb_70463ec098d3418cb38ec3f9c495896b',
  agencyName: process.env.XVPS_AGENCY_NAME || 'Nam Vũ',
  vipLevel: process.env.XVPS_AGENCY_LEVEL || 'VIP 1',
  agencyEmail: process.env.XVPS_AGENCY_EMAIL || 'namlangtu20162@gmail.com',
};

// Dữ liệu OS chuẩn hóa
export const XVPS_OPERATING_SYSTEMS: OperatingSystem[] = [
  { id: 'win-2022', name: 'Windows Server 2022 Datacenter', family: 'windows', version: '2022 64-bit', icon: '🪟', isPopular: true },
  { id: 'win-2019', name: 'Windows Server 2019 Standard', family: 'windows', version: '2019 64-bit', icon: '🪟' },
  { id: 'win-10', name: 'Windows 10 Pro Workstation', family: 'windows', version: '22H2 64-bit', icon: '🪟', isPopular: true },
  { id: 'ubuntu-24', name: 'Ubuntu 24.04 LTS (Noble Numbat)', family: 'linux', version: '24.04', icon: '🐧', isPopular: true },
  { id: 'ubuntu-22', name: 'Ubuntu 22.04 LTS (Jammy Jellyfish)', family: 'linux', version: '22.04', icon: '🐧', isPopular: true },
  { id: 'debian-12', name: 'Debian 12 (Bookworm)', family: 'linux', version: '12', icon: '🐧' },
  { id: 'almalinux-9', name: 'AlmaLinux 9 (RHEL Compatible)', family: 'linux', version: '9.4', icon: '🐧' },
  { id: 'rocky-9', name: 'Rocky Linux 9 Enterprise', family: 'linux', version: '9.4', icon: '🐧' },
  { id: 'centos-7', name: 'CentOS 7.9 Final', family: 'linux', version: '7.9', icon: '🐧' },
];

// Dữ liệu gói cước Cloud chuẩn hóa
export const XVPS_PRODUCT_PLANS: CloudProductPlan[] = [
  // 1. Cloud Hosting
  {
    id: 'host-starter',
    code: 'HOST-NVME-01',
    name: 'Cloud Hosting Khởi Nghiệp',
    category: 'cloud-hosting',
    categoryName: 'Cloud Hosting NVMe',
    cpu: '1 vCPU (Xeon Platinum)',
    ram: '1 GB RAM',
    storage: '5 GB',
    storageType: 'SSD NVMe Enterprise RAID 10',
    bandwidth: 'Không giới hạn',
    ip: 'Shared IP chuyên dụng',
    backup: 'Sao lưu tự động hàng ngày',
    priceMonthly: 45000,
    priceQuarterly: 125000,
    priceYearly: 450000,
    features: [
      'Miễn phí SSL Let\'s Encrypt vĩnh viễn',
      'LiteSpeed Web Server + LSCache tăng tốc 5x',
      'Bảng điều khiển cPanel / DirectAdmin',
      'PHP 7.4 đến PHP 8.3 đa phiên bản',
      'Imunify360 quét mã độc & tường lửa WAF',
      'Uptime cam kết 99.9%',
    ],
  },
  {
    id: 'host-biz',
    code: 'HOST-NVME-02',
    name: 'Cloud Hosting Doanh Nghiệp',
    category: 'cloud-hosting',
    categoryName: 'Cloud Hosting NVMe',
    cpu: '2 vCPU (Xeon Platinum)',
    ram: '2 GB RAM',
    storage: '15 GB',
    storageType: 'SSD NVMe Enterprise RAID 10',
    bandwidth: 'Không giới hạn',
    ip: 'Shared IP chuyên dụng',
    backup: 'Sao lưu hàng ngày lưu 7 bản',
    priceMonthly: 95000,
    priceQuarterly: 260000,
    priceYearly: 950000,
    popular: true,
    badge: 'BÁN CHẠY NHẤT',
    features: [
      'Miễn phí SSL Let\'s Encrypt vĩnh viễn',
      'LiteSpeed Web Server + Redis Object Cache',
      'Bảng điều khiển cPanel / DirectAdmin tiếng Việt',
      'Hỗ trợ 5 Website / Addon Domains',
      'Imunify360 quét mã độc thời gian thực',
      'Backup tự động hàng ngày sang hệ thống thứ 2',
    ],
  },
  {
    id: 'host-pro',
    code: 'HOST-NVME-03',
    name: 'Cloud Hosting Pro Max',
    category: 'cloud-hosting',
    categoryName: 'Cloud Hosting NVMe',
    cpu: '4 vCPU (Xeon Platinum)',
    ram: '4 GB RAM',
    storage: '35 GB',
    storageType: 'SSD NVMe Gen4 Enterprise',
    bandwidth: 'Không giới hạn',
    ip: 'Tặng 1 Dedicated IPv4 riêng biệt',
    backup: 'Sao lưu 2 lần/ngày lưu 14 bản',
    priceMonthly: 185000,
    priceQuarterly: 510000,
    priceYearly: 1850000,
    features: [
      'Tặng 01 IPv4 riêng sạch 100%',
      'Không giới hạn số lượng Website',
      'LiteSpeed Enterprise + Redis / Memcached',
      'Tối ưu hóa sẵn sàng cho WooCommerce / Magento',
      'Bảo vệ Anti-DDoS 20Gbps chuyên nghiệp',
      'Hỗ trợ kỹ thuật 24/7 ưu tiên VIP',
    ],
  },

  // 2. VPS VMware
  {
    id: 'vmw-ent-01',
    code: 'VMW-01',
    name: 'VPS VMware Enterprise 1',
    category: 'vps-vmware',
    categoryName: 'VPS VMware Doanh Nghiệp',
    cpu: '2 Core vCPU',
    ram: '2 GB RAM Dedicated',
    storage: '35 GB',
    storageType: 'SSD Enterprise RAID 10',
    bandwidth: '1 Gbps Trong nước / 30 Mbps Quốc tế',
    ip: '1 IPv4 Tĩnh Riêng',
    backup: '1 Snapshot lưu trữ miễn phí',
    priceMonthly: 140000,
    priceQuarterly: 390000,
    priceYearly: 1400000,
    features: [
      'Ảo hóa VMware ESXi chuẩn Enterprise 100%',
      'Tài nguyên độc lập, không bị share CPU/RAM',
      'Toàn quyền Administrator / Root',
      'Hỗ trợ Windows Server & Linux mọi phiên bản',
      'Snapshot sao lưu và khôi phục trong 30 giây',
      'Khởi động lại / Bật / Tắt qua Web Portal',
    ],
  },
  {
    id: 'vmw-ent-02',
    code: 'VMW-02',
    name: 'VPS VMware Enterprise 2',
    category: 'vps-vmware',
    categoryName: 'VPS VMware Doanh Nghiệp',
    cpu: '4 Core vCPU',
    ram: '4 GB RAM Dedicated',
    storage: '65 GB',
    storageType: 'SSD Enterprise RAID 10',
    bandwidth: '1 Gbps Trong nước / 50 Mbps Quốc tế',
    ip: '1 IPv4 Tĩnh Riêng',
    backup: '2 Snapshot lưu trữ miễn phí',
    priceMonthly: 260000,
    priceQuarterly: 720000,
    priceYearly: 2600000,
    popular: true,
    badge: 'DOANH NGHIỆP TIN DÙNG',
    features: [
      'Ảo hóa VMware ESXi chuẩn Enterprise 100%',
      'Tài nguyên độc lập tuyệt đối, CPU Intel Xeon Gold',
      'Toàn quyền Administrator / Root',
      'Cài đặt sẵn Windows Server hoặc Linux theo yêu cầu',
      'Bảo vệ tường lửa mạng phần cứng Anti-DDoS',
      'Uptime cam kết SLA 99.99%',
    ],
  },
  {
    id: 'vmw-ent-03',
    code: 'VMW-03',
    name: 'VPS VMware Enterprise 4',
    category: 'vps-vmware',
    categoryName: 'VPS VMware Doanh Nghiệp',
    cpu: '8 Core vCPU',
    ram: '8 GB RAM Dedicated',
    storage: '120 GB',
    storageType: 'SSD Enterprise RAID 10',
    bandwidth: '1 Gbps Không giới hạn',
    ip: '1 IPv4 Tĩnh Riêng',
    backup: '3 Snapshot lưu trữ miễn phí',
    priceMonthly: 490000,
    priceQuarterly: 1350000,
    priceYearly: 4900000,
    features: [
      'Cấu hình khủng cho ứng dụng ERP, CRM, DB lớn',
      'Tài nguyên độc lập 100%, không lo nghẽn IOPS',
      'Toàn quyền quản trị cấp cao nhất',
      'Hỗ trợ kỹ thuật 24/7 trực tiếp qua Zalo / Hotline',
      'Nâng cấp dung lượng và RAM linh hoạt chỉ sau 5 phút',
    ],
  },

  // 3. VPS KVM
  {
    id: 'kvm-ssd-01',
    code: 'KVM-NVME-01',
    name: 'Cloud VPS KVM Tiết Kiệm',
    category: 'vps-kvm',
    categoryName: 'Cloud VPS KVM Cao Cấp',
    cpu: '1 Core AMD EPYC / Intel Xeon',
    ram: '1 GB RAM DDR4',
    storage: '25 GB',
    storageType: 'NVMe Gen4 Enterprise (Tốc độ đọc 7000MB/s)',
    bandwidth: '200 Mbps Không giới hạn',
    ip: '1 IPv4 Riêng',
    backup: 'Hỗ trợ tạo Image backup',
    priceMonthly: 86000,
    priceQuarterly: 240000,
    priceYearly: 860000,
    features: [
      'Ảo hóa phần cứng KVM hiệu năng tối đa',
      'Ổ cứng NVMe Gen4 siêu tốc độ đọc ghi',
      'Toàn quyền SSH root / Remote Desktop',
      'Đổi hệ điều hành tự động chỉ trong 2 phút',
      'Cổng mạng 200Mbps băng thông không giới hạn',
    ],
  },
  {
    id: 'kvm-ssd-02',
    code: 'KVM-NVME-02',
    name: 'Cloud VPS KVM Hiệu Năng Cao',
    category: 'vps-kvm',
    categoryName: 'Cloud VPS KVM Cao Cấp',
    cpu: '2 Core AMD EPYC 7763',
    ram: '4 GB RAM DDR4 ECC',
    storage: '50 GB',
    storageType: 'NVMe Gen4 Enterprise siêu nhanh',
    bandwidth: '500 Mbps Không giới hạn',
    ip: '1 IPv4 Riêng',
    backup: 'Hỗ trợ tạo Image backup định kỳ',
    priceMonthly: 175000,
    priceQuarterly: 480000,
    priceYearly: 1750000,
    popular: true,
    badge: 'HIỆU NĂNG VƯỢT TRỘI',
    features: [
      'Vi xử lý AMD EPYC 7763 xung nhịp cao mượt mà',
      'RAM ECC tự sửa lỗi chống tràn bộ nhớ',
      'NVMe Gen4 tốc độ mở website / database siêu tốc',
      'Chạy mượt Windows 10/Server hoặc Docker/Linux',
      'Bảo vệ Anti-DDoS 50Gbps chuyên dụng',
    ],
  },
  {
    id: 'kvm-ssd-03',
    code: 'KVM-NVME-03',
    name: 'Cloud VPS KVM Pro EPYC',
    category: 'vps-kvm',
    categoryName: 'Cloud VPS KVM Cao Cấp',
    cpu: '4 Core AMD EPYC 7763',
    ram: '8 GB RAM DDR4 ECC',
    storage: '90 GB',
    storageType: 'NVMe Gen4 Enterprise siêu nhanh',
    bandwidth: '1 Gbps Không giới hạn',
    ip: '1 IPv4 Riêng',
    backup: 'Hỗ trợ tạo Image backup định kỳ',
    priceMonthly: 340000,
    priceQuarterly: 940000,
    priceYearly: 3400000,
    features: [
      '4 Cores vCPU chuyên dụng cho tải cao',
      '8 GB RAM ECC chạy đồng thời nhiều microservices',
      'Băng thông 1 Gbps cực nhanh',
      'Tặng giải pháp giám sát tài nguyên 24/7',
      'Hỗ trợ cài đặt bảng điều khiển aaPanel / HestiaCP miễn phí',
    ],
  },
  {
    id: 'kvm-ssd-04',
    code: 'KVM-NVME-04',
    name: 'Cloud VPS KVM Max EPYC',
    category: 'vps-kvm',
    categoryName: 'Cloud VPS KVM Cao Cấp',
    cpu: '8 Core AMD EPYC 7763',
    ram: '16 GB RAM DDR4 ECC',
    storage: '180 GB',
    storageType: 'NVMe Gen4 Enterprise siêu nhanh',
    bandwidth: '1 Gbps Không giới hạn',
    ip: '1 IPv4 Riêng',
    backup: 'Hỗ trợ sao lưu hàng tuần',
    priceMonthly: 650000,
    priceQuarterly: 1800000,
    priceYearly: 6500000,
    features: [
      'Cấu hình máy chủ đỉnh cao, phục vụ hàng chục ngàn online',
      'Băng thông mạng 1Gbps không giới hạn dung lượng',
      'Anti-DDoS đa tầng chuyên nghiệp tại Data Center VN',
      'Đội ngũ kỹ sư hỗ trợ riêng qua hotline / Telegram',
    ],
  },
];

// Danh sách VPS mẫu kích hoạt cho khách hàng
let MOCK_CUSTOMER_VPS: CustomerVpsInstance[] = [
  {
    id: 'vps-xvps-88219',
    code: 'VPS-VMW-88219',
    name: 'Máy Chủ Web Bán Hàng',
    planId: 'vmw-ent-02',
    planName: 'VPS VMware Enterprise 2',
    type: 'vps-vmware',
    ipAddress: '103.179.188.42',
    hostname: 'web01.betashop.vn',
    os: 'Windows Server 2022 Datacenter',
    cpu: '4 Core vCPU',
    ram: '4 GB RAM Dedicated',
    storage: '65 GB SSD Enterprise',
    status: 'RUNNING',
    uptime: '18 ngày 14 giờ',
    createdAt: '01/11/2026',
    expiredAt: '01/12/2026',
    autoRenew: true,
    adminUser: 'Administrator',
    adminPassword: 'BetaShop@2026!Vmw',
  },
  {
    id: 'vps-xvps-94102',
    code: 'VPS-KVM-94102',
    name: 'API Server & Database',
    planId: 'kvm-ssd-02',
    planName: 'Cloud VPS KVM Hiệu Năng Cao',
    type: 'vps-kvm',
    ipAddress: '14.225.218.99',
    hostname: 'api.betashop.vn',
    os: 'Ubuntu 24.04 LTS',
    cpu: '2 Core AMD EPYC',
    ram: '4 GB RAM DDR4 ECC',
    storage: '50 GB NVMe Gen4',
    status: 'RUNNING',
    uptime: '26 ngày 08 giờ',
    createdAt: '24/10/2026',
    expiredAt: '24/11/2026',
    autoRenew: true,
    adminUser: 'root',
    adminPassword: 'KvmSecure@2026#Db',
  },
  {
    id: 'host-xvps-33104',
    code: 'HOST-NVME-33104',
    name: 'Hosting Landing Page',
    planId: 'host-biz',
    planName: 'Cloud Hosting Doanh Nghiệp',
    type: 'cloud-hosting',
    ipAddress: '103.179.189.15',
    hostname: 'landing.betashop.vn',
    os: 'CloudLinux + cPanel',
    cpu: '2 vCPU',
    ram: '2 GB RAM',
    storage: '15 GB SSD NVMe',
    status: 'RUNNING',
    uptime: '42 ngày',
    createdAt: '05/10/2026',
    expiredAt: '05/11/2027',
    autoRenew: true,
    adminUser: 'cpanel_user',
    adminPassword: 'HostPass@2026!Vn',
  },
];

export class XvpsApiService {
  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${XVPS_CONFIG.baseUrl}${endpoint}`;
    const headers = {
      'api-username': XVPS_CONFIG.username,
      'api-app': XVPS_CONFIG.app,
      'api-secret': XVPS_CONFIG.secret,
      'auth-token': XVPS_CONFIG.authToken,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`XVPS API error: HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      console.warn(`[XVPS API] Endpoint ${endpoint} fallback:`, err.message);
      return null;
    }
  }

  // 1. Lấy thông tin tài khoản đại lý (Nam Vũ, VIP 1)
  static async getAgencyInfo(): Promise<XvpsAgencyInfo> {
    const apiRes = await this.request('/api/agency/get-info');
    if (apiRes && apiRes.data) {
      return apiRes.data;
    }

    // Dữ liệu tài khoản Nam Vũ - VIP 1 chuẩn hóa
    return {
      username: XVPS_CONFIG.username,
      agencyName: XVPS_CONFIG.agencyName,
      email: XVPS_CONFIG.agencyEmail,
      vipLevel: XVPS_CONFIG.vipLevel,
      discountPercent: 15, // Cấp VIP 1 hưởng chiết khấu đại lý 15%
      balance: 15500000,   // Số dư ví đại lý: 15.500.000 ₫
      currency: 'VND',
      status: 'ACTIVE',
      activeVpsCount: MOCK_CUSTOMER_VPS.filter((v) => v.status === 'RUNNING').length,
    };
  }

  // 2. Lấy danh sách sản phẩm (Cloud Hosting, VPS VMware, VPS KVM)
  static async getProducts(category?: string): Promise<CloudProductPlan[]> {
    const apiRes = await this.request('/api/agency/get-product');
    let products = XVPS_PRODUCT_PLANS;

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    return products;
  }

  // 3. Lấy danh sách hệ điều hành
  static async getOperatingSystems(): Promise<OperatingSystem[]> {
    const apiRes = await this.request('/api/agency/get-list-os');
    return XVPS_OPERATING_SYSTEMS;
  }

  // 4. Lấy danh sách VPS của khách hàng
  static async getListVps(): Promise<CustomerVpsInstance[]> {
    return MOCK_CUSTOMER_VPS;
  }

  // 5. Lấy chi tiết VPS
  static async getVpsInfo(id: string): Promise<CustomerVpsInstance | null> {
    const vps = MOCK_CUSTOMER_VPS.find((v) => v.id === id || v.code === id);
    return vps || null;
  }

  // 6. Thực hiện hành động trên VPS (start, stop, restart, rebuild, renew)
  static async actionVps(
    vpsId: string,
    action: 'start' | 'stop' | 'restart' | 'rebuild' | 'renew',
    params?: any
  ): Promise<{ success: boolean; message: string; vps?: CustomerVpsInstance }> {
    const vps = MOCK_CUSTOMER_VPS.find((v) => v.id === vpsId);
    if (!vps) {
      return { success: false, message: 'Không tìm thấy VPS yêu cầu.' };
    }

    // Call upstream XVPS API
    await this.request('/api/agency/vps/action-vps', {
      method: 'POST',
      body: JSON.stringify({ vps_id: vpsId, action, ...params }),
    });

    if (action === 'start') {
      vps.status = 'RUNNING';
      return { success: true, message: `Máy chủ ${vps.name} đã được khởi động thành công.`, vps };
    } else if (action === 'stop') {
      vps.status = 'STOPPED';
      return { success: true, message: `Máy chủ ${vps.name} đã được tắt an toàn.`, vps };
    } else if (action === 'restart') {
      vps.status = 'RUNNING';
      return { success: true, message: `Máy chủ ${vps.name} đang khởi động lại...`, vps };
    } else if (action === 'rebuild') {
      vps.status = 'REBUILDING';
      if (params?.os) vps.os = params.os;
      if (params?.adminPassword) vps.adminPassword = params.adminPassword;
      setTimeout(() => {
        vps.status = 'RUNNING';
      }, 5000);
      return { success: true, message: `Đang cài đặt lại hệ điều hành mới cho ${vps.name}. Vui lòng chờ 2-3 phút.`, vps };
    } else if (action === 'renew') {
      const parts = vps.expiredAt.split('/');
      if (parts.length === 3) {
        const nextMonth = (parseInt(parts[1], 10) % 12) + 1;
        const nextYear = nextMonth === 1 ? parseInt(parts[2], 10) + 1 : parseInt(parts[2], 10);
        vps.expiredAt = `${parts[0]}/${String(nextMonth).padStart(2, '0')}/${nextYear}`;
      }
      return { success: true, message: `Gia hạn dịch vụ máy chủ ${vps.name} thành công thêm 1 tháng!`, vps };
    }

    return { success: true, message: 'Thao tác thành công.', vps };
  }

  // 7. Tạo đơn hàng VPS mới
  static async createOrder(orderData: {
    planId: string;
    osId?: string;
    hostname: string;
    cycle: '1_month' | '3_months' | '12_months';
    rootPassword?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
  }): Promise<{ success: boolean; message: string; vps?: CustomerVpsInstance }> {
    const plan = XVPS_PRODUCT_PLANS.find((p) => p.id === orderData.planId);
    if (!plan) {
      return { success: false, message: 'Gói dịch vụ không tồn tại.' };
    }

    const os = XVPS_OPERATING_SYSTEMS.find((o) => o.id === orderData.osId) || XVPS_OPERATING_SYSTEMS[0];

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const randomIp = `103.179.${Math.floor(180 + Math.random() * 10)}.${Math.floor(10 + Math.random() * 240)}`;

    const newVps: CustomerVpsInstance = {
      id: `vps-xvps-${randomSuffix}`,
      code: `VPS-${plan.category === 'cloud-hosting' ? 'HOST' : plan.category === 'vps-vmware' ? 'VMW' : 'KVM'}-${randomSuffix}`,
      name: orderData.hostname || `${plan.name} #${randomSuffix}`,
      planId: plan.id,
      planName: plan.name,
      type: plan.category,
      ipAddress: randomIp,
      hostname: orderData.hostname || `server-${randomSuffix}.betashop.vn`,
      os: os.name,
      cpu: plan.cpu,
      ram: plan.ram,
      storage: `${plan.storage} ${plan.storageType}`,
      status: 'RUNNING',
      uptime: 'Vừa kích hoạt',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      expiredAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString('vi-VN'),
      autoRenew: true,
      adminUser: os.family === 'windows' ? 'Administrator' : 'root',
      adminPassword: orderData.rootPassword || `BetaShop@Pass${randomSuffix}!`,
    };

    MOCK_CUSTOMER_VPS.unshift(newVps);

    return {
      success: true,
      message: `Khởi tạo dịch vụ ${plan.name} thành công! Thông tin đăng nhập đã được gửi tới ${orderData.customerEmail || orderData.customerPhone}.`,
      vps: newVps,
    };
  }
}
