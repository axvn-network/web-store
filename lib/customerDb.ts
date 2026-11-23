import fs from 'fs';
import path from 'path';

export interface CustomerUser {
  id: string;
  name: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  image?: string;
  passwordHash?: string;
  role: 'customer' | 'affiliate' | 'partner' | 'admin';
  status: 'active' | 'pending' | 'banned';
  tier: 'COPPER' | 'SILVER' | 'GOLD' | 'DIAMOND';
  totalSpent: number;
  points: number;
  twoFactorEnabled?: boolean;
  linkedAccounts?: {
    provider: 'google' | 'telegram' | 'phone' | 'email';
    providerId: string;
    connectedAt: string;
  }[];
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  userId: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  type: 'HOME' | 'OFFICE';
  isDefault: boolean;
}

export interface CustomerReview {
  id: string;
  userId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  rating: number;
  comment: string;
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reply?: string;
  createdAt: string;
}

export interface CustomerVoucher {
  id: string;
  code: string;
  title: string;
  discountType: 'PERCENT' | 'FIXED';
  value: number;
  minOrder: number;
  expiresAt: string;
  isUsed: boolean;
}

export interface AffiliateProfile {
  id: string;
  userId: string;
  code: string; // e.g. GIA-DUNG-99
  status: 'pending' | 'approved' | 'rejected';
  channel: string;
  channelUrl: string;
  followers: string;
  note: string;
  commissionRate: number; // e.g. 7 (%)
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  totalClicks: number;
  totalOrders: number;
  totalRevenue: number;
  approvedAt?: string;
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  affiliateId: string;
  code: string;
  label: string;
  targetUrl: string;
  clicks: number;
  createdAt: string;
}

export interface AffiliateReferral {
  id: string;
  affiliateId: string;
  orderId: string;
  orderCode: string;
  orderTotal: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export interface WithdrawalRequest {
  id: string;
  affiliateId: string;
  amount: number;
  method: 'BANK' | 'MOMO';
  bankName?: string;
  bankAccount?: string;
  accountName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  proofImage?: string;
  createdAt: string;
}

export interface PartnerApplication {
  id: string;
  type: 'DISTRIBUTOR' | 'DEALER' | 'SUPPLIER' | 'LOGISTICS' | 'OTHER';
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  description: string;
  attachmentUrl?: string;
  status: 'NEW' | 'CONTACTED' | 'NEGOTIATING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  createdAt: string;
}

export interface OtpRecord {
  id: string;
  identifier: string; // email or phone
  code: string;
  type: 'register' | 'login' | 'reset' | 'link';
  expiresAt: number; // timestamp
  attempts: number;
  consumed: boolean;
}

export interface LoginLogItem {
  id: string;
  userId: string;
  userName: string;
  method: 'email' | 'phone' | 'google' | 'telegram';
  ip: string;
  userAgent: string;
  success: boolean;
  createdAt: string;
}

export interface CustomerDatabaseState {
  users: CustomerUser[];
  addresses: CustomerAddress[];
  reviews: CustomerReview[];
  vouchers: CustomerVoucher[];
  affiliates: AffiliateProfile[];
  affiliateLinks: AffiliateLink[];
  affiliateReferrals: AffiliateReferral[];
  withdrawals: WithdrawalRequest[];
  partnerApplications: PartnerApplication[];
  otpCodes: OtpRecord[];
  loginLogs: LoginLogItem[];
  wishlist: { userId: string; productId: string; addedAt: string }[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'customer_db.json');

// Initial seed data
function getInitialCustomerDb(): CustomerDatabaseState {
  return {
    users: [
      {
        id: 'usr-01',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@gmail.com',
        emailVerified: true,
        phone: '0988123456',
        phoneVerified: true,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // 12345678
        role: 'customer',
        status: 'active',
        tier: 'GOLD',
        totalSpent: 12500000,
        points: 1250,
        twoFactorEnabled: false,
        linkedAccounts: [
          { provider: 'google', providerId: 'google-10982391283', connectedAt: '01/10/2026' },
          { provider: 'phone', providerId: '0988123456', connectedAt: '01/10/2026' },
        ],
        createdAt: '01/10/2026 09:30',
      },
      {
        id: 'usr-02',
        name: 'Trần Thị Mai (CTV Review Gia Dụng)',
        email: 'mai.review@gmail.com',
        emailVerified: true,
        phone: '0977888999',
        phoneVerified: true,
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
        role: 'affiliate',
        status: 'active',
        tier: 'DIAMOND',
        totalSpent: 35000000,
        points: 3500,
        twoFactorEnabled: true,
        linkedAccounts: [
          { provider: 'telegram', providerId: 'tele-88776655', connectedAt: '15/10/2026' },
          { provider: 'email', providerId: 'mai.review@gmail.com', connectedAt: '15/10/2026' },
        ],
        createdAt: '15/10/2026 14:15',
      },
      {
        id: 'usr-03',
        name: 'Lê Hoàng Nam (Khách Mới)',
        email: 'nam.le@gmail.com',
        emailVerified: false,
        phone: '0912345678',
        phoneVerified: true,
        role: 'customer',
        status: 'pending',
        tier: 'COPPER',
        totalSpent: 0,
        points: 50,
        linkedAccounts: [
          { provider: 'phone', providerId: '0912345678', connectedAt: '16/11/2026' },
        ],
        createdAt: '16/11/2026 11:00',
      },
    ],
    addresses: [
      {
        id: 'addr-01',
        userId: 'usr-01',
        name: 'Nguyễn Văn An',
        phone: '0988 123 456',
        province: 'Thành phố Hà Nội',
        district: 'Quận Cầu Giấy',
        ward: 'Phường Dịch Vọng Hậu',
        detail: 'Số 45 Ngõ 123 đường Duy Tân',
        type: 'OFFICE',
        isDefault: true,
      },
      {
        id: 'addr-02',
        userId: 'usr-01',
        name: 'Nguyễn Văn An (Nhà riêng)',
        phone: '0988 123 456',
        province: 'Thành phố Hà Nội',
        district: 'Quận Nam Từ Liêm',
        ward: 'Phường Mỹ Đình 2',
        detail: 'Căn hộ 12A08 Chung cư The Sun',
        type: 'HOME',
        isDefault: false,
      },
      {
        id: 'addr-03',
        userId: 'usr-02',
        name: 'Trần Thị Mai',
        phone: '0977 888 999',
        province: 'Thành phố Hồ Chí Minh',
        district: 'Quận 7',
        ward: 'Phường Tân Phong',
        detail: 'Số 88 đường Nguyễn Thị Thập',
        type: 'HOME',
        isDefault: true,
      },
    ],
    reviews: [
      {
        id: 'rev-01',
        userId: 'usr-01',
        productId: 'sp-01',
        productTitle: 'Nồi chiên không dầu Philips HD9280/90 6.2L Wifi',
        productImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=300&q=80',
        rating: 5,
        comment: 'Nồi chiên dùng cực thích, kết nối ứng dụng điện thoại tiện lợi, chiên gà giòn rụm không cần thêm dầu ăn.',
        images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=300&q=80'],
        status: 'APPROVED',
        reply: 'Cảm ơn anh An đã tin chọn Betashop! Chúc anh và gia đình có nhiều món ngon.',
        createdAt: '02/11/2026',
      },
    ],
    vouchers: [
      {
        id: 'vouch-01',
        code: 'BETACHAO100',
        title: 'Giảm 100.000 ₫ mừng thành viên mới',
        discountType: 'FIXED',
        value: 100000,
        minOrder: 800000,
        expiresAt: '31/12/2026',
        isUsed: false,
      },
      {
        id: 'vouch-02',
        code: 'GIADUNGVIP10',
        title: 'Giảm 10% tối đa 300.000 ₫ cho hạng Vàng',
        discountType: 'PERCENT',
        value: 10,
        minOrder: 2000000,
        expiresAt: '30/11/2026',
        isUsed: false,
      },
    ],
    affiliates: [
      {
        id: 'aff-01',
        userId: 'usr-02',
        code: 'MAIREVIEW',
        status: 'approved',
        channel: 'TikTok & Kênh Bếp Yêu',
        channelUrl: 'https://tiktok.com/@maireviewgiadung',
        followers: '150.000 followers',
        note: 'Chuyên làm video review nồi chiên không dầu và robot hút bụi',
        commissionRate: 8,
        availableBalance: 4250000,
        pendingBalance: 1280000,
        totalWithdrawn: 12000000,
        totalClicks: 3420,
        totalOrders: 68,
        totalRevenue: 245000000,
        approvedAt: '16/10/2026',
        createdAt: '15/10/2026',
      },
    ],
    affiliateLinks: [
      {
        id: 'afflink-01',
        affiliateId: 'aff-01',
        code: 'MAIREVIEW-NOICHIEN',
        label: 'Chiến dịch Nồi chiên Philips HD9280',
        targetUrl: '/san-pham/noi-chien-khong-dau-philips-hd9280-90',
        clicks: 1420,
        createdAt: '18/10/2026',
      },
      {
        id: 'afflink-02',
        affiliateId: 'aff-01',
        code: 'MAIREVIEW-ROBOT',
        label: 'Chiến dịch Robot Dreame L10s Ultra',
        targetUrl: '/san-pham/robot-hut-bui-dreame-l10s-ultra',
        clicks: 2000,
        createdAt: '22/10/2026',
      },
    ],
    affiliateReferrals: [
      {
        id: 'ref-01',
        affiliateId: 'aff-01',
        orderId: 'ord-101',
        orderCode: 'BS2611-9A82B',
        orderTotal: 5290000,
        commissionAmount: 423200,
        status: 'approved',
        createdAt: '01/11/2026 10:15',
        approvedAt: '08/11/2026',
      },
      {
        id: 'ref-02',
        affiliateId: 'aff-01',
        orderId: 'ord-102',
        orderCode: 'BS2611-C471A',
        orderTotal: 2890000,
        commissionAmount: 231200,
        status: 'pending',
        createdAt: '14/11/2026 16:40',
      },
    ],
    withdrawals: [
      {
        id: 'wdr-01',
        affiliateId: 'aff-01',
        amount: 5000000,
        method: 'BANK',
        bankName: 'Techcombank',
        bankAccount: '1903 8888 9999',
        accountName: 'TRAN THI MAI',
        status: 'APPROVED',
        adminNote: 'Đã chuyển khoản thành công qua Napas 247',
        proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=300&q=80',
        createdAt: '05/11/2026',
      },
    ],
    partnerApplications: [
      {
        id: 'part-01',
        type: 'DEALER',
        companyName: 'Công ty TNHH Thiết Bị Điện Gia Dụng Miền Trung',
        contactName: 'Hoàng Minh Tuấn',
        phone: '0905 123 789',
        email: 'tuan.hm@giadungmientrung.vn',
        address: 'Số 48 đường Hùng Vương, TP. Đà Nẵng',
        website: 'https://giadungmientrung.vn',
        description: 'Đăng ký làm Đại lý phân phối cấp 1 tại khu vực Đà Nẵng và Quảng Nam, cam kết sản lượng 300 triệu/tháng.',
        status: 'NEGOTIATING',
        adminNote: 'Đã gửi bảng chiết khấu đại lý qua email, hẹn họp trực tuyến vào thứ 5.',
        createdAt: '10/11/2026',
      },
      {
        id: 'part-02',
        type: 'SUPPLIER',
        companyName: 'Công ty Cổ phần Elmich Châu Âu',
        contactName: 'Trịnh Thanh Hằng',
        phone: '0983 456 789',
        email: 'hang.tt@elmich.com.vn',
        address: 'KCN Châu Sơn, TP. Phủ Lý, Hà Nam',
        website: 'https://elmich.vn',
        description: 'Đề xuất phân phối dòng sản phẩm chảo inox 304 nguyên khối và nồi áp suất thế hệ mới cho tổng kho Betashop.',
        status: 'APPROVED',
        adminNote: 'Đã ký hợp đồng cung ứng số 2611-ELMICH.',
        createdAt: '08/11/2026',
      },
    ],
    otpCodes: [
      {
        id: 'otp-demo',
        identifier: '0988123456',
        code: '123456',
        type: 'login',
        expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour for demo
        attempts: 0,
        consumed: false,
      },
    ],
    loginLogs: [
      {
        id: 'log-01',
        userId: 'usr-01',
        userName: 'Nguyễn Văn An',
        method: 'google',
        ip: '14.162.145.20',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0',
        success: true,
        createdAt: '16/11/2026 09:12',
      },
    ],
    wishlist: [
      { userId: 'usr-01', productId: 'sp-01', addedAt: '01/11/2026' },
      { userId: 'usr-01', productId: 'sp-03', addedAt: '05/11/2026' },
    ],
  };
}

export function readCustomerDb(): CustomerDatabaseState {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const init = getInitialCustomerDb();
      writeCustomerDb(init);
      return init;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    const init = getInitialCustomerDb();
    return {
      users: parsed.users || init.users,
      addresses: parsed.addresses || init.addresses,
      reviews: parsed.reviews || init.reviews,
      vouchers: parsed.vouchers || init.vouchers,
      affiliates: parsed.affiliates || init.affiliates,
      affiliateLinks: parsed.affiliateLinks || init.affiliateLinks,
      affiliateReferrals: parsed.affiliateReferrals || init.affiliateReferrals,
      withdrawals: parsed.withdrawals || init.withdrawals,
      partnerApplications: parsed.partnerApplications || init.partnerApplications,
      otpCodes: parsed.otpCodes || init.otpCodes,
      loginLogs: parsed.loginLogs || init.loginLogs,
      wishlist: parsed.wishlist || init.wishlist,
    };
  } catch (e) {
    return getInitialCustomerDb();
  }
}

export function writeCustomerDb(data: CustomerDatabaseState): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}
