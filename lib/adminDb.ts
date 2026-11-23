import fs from 'fs';
import path from 'path';
import { STORE_PRODUCTS, STORE_CATEGORIES, Product } from '@/data/storeData';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  roleCode: 'SUPER_ADMIN' | 'WAREHOUSE_MANAGER' | 'CASHIER' | 'ACCOUNTANT' | 'CSKH';
  roleName: string;
  warehouseId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface RoleDef {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  contactPerson: string;
  totalImport: number;
  totalPaid: number;
  balanceDue: number; // Công nợ
  rating: number;
  note?: string;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  managerName: string;
  isDefault: boolean;
  totalCapacity?: number;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode: string;
  capacity?: string;
  power?: string;
  color?: string;
  voltage?: string;
  costPrice: number;
  retailPrice: number;
  salePrice?: number;
}

export interface StockItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  barcode: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;   // Tồn kho thực tế
  reserved: number;   // Đang giữ cho đơn hàng
  available: number;  // Sẵn sàng bán = quantity - reserved
  costPrice: number;
  retailPrice: number;
  minAlert: number;
  maxAlert: number;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  movementNo: string;
  variantId: string;
  productName: string;
  variantName: string;
  warehouseId: string;
  warehouseName: string;
  type: 'IMPORT' | 'EXPORT' | 'TRANSFER' | 'ADJUSTMENT' | 'SALE' | 'RETURN';
  typeName: string;
  refDocType: string;
  refDocCode: string;
  quantity: number; // Dương hoặc âm
  stockBefore: number;
  stockAfter: number;
  performedBy: string;
  note?: string;
  createdAt: string;
}

export interface ImportVoucherItem {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  costPrice: number;
  discount: number;
  total: number;
}

export interface ImportVoucher {
  id: string;
  code: string; // PNK-202611-001
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  invoiceNumber?: string;
  importDate: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  statusText: string;
  subtotal: number;
  discount: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  note?: string;
  createdBy: string;
  items: ImportVoucherItem[];
  createdAt: string;
}

export interface ExportVoucherItem {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ExportVoucher {
  id: string;
  code: string; // PXK-202611-001
  warehouseId: string;
  warehouseName: string;
  reason: 'SALE' | 'DEFECT' | 'RETURN_SUPPLIER' | 'INTERNAL_USE';
  reasonText: string;
  status: 'COMPLETED';
  exportDate: string;
  note?: string;
  createdBy: string;
  items: ExportVoucherItem[];
  createdAt: string;
}

export interface TransferVoucherItem {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
}

export interface TransferVoucher {
  id: string;
  code: string; // PCK-202611-001
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: 'PENDING_DISPATCH' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
  statusText: string;
  transferDate: string;
  receivedDate?: string;
  createdBy: string;
  receivedBy?: string;
  note?: string;
  items: TransferVoucherItem[];
  createdAt: string;
}

export interface AdjustmentItem {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  bookQuantity: number;
  realQuantity: number;
  diffQuantity: number;
  costPrice: number;
  diffAmount: number;
  note?: string;
}

export interface AdjustmentVoucher {
  id: string;
  code: string; // PKK-202611-001
  warehouseId: string;
  warehouseName: string;
  reason: string;
  status: 'COMPLETED';
  auditDate: string;
  createdBy: string;
  note?: string;
  items: AdjustmentItem[];
  createdAt: string;
}

export interface ReturnVoucherItem {
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ReturnVoucher {
  id: string;
  code: string; // PTH-202611-001
  orderId: string;
  orderCode: string;
  customerName: string;
  reason: string;
  refundMethod: 'CASH' | 'BANK_TRANSFER' | 'VOUCHER';
  refundAmount: number;
  status: 'COMPLETED';
  restockType: 'RESTOCK_USABLE' | 'MOVE_TO_DEFECT';
  createdBy: string;
  note?: string;
  items: ReturnVoucherItem[];
  createdAt: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  province?: string;
  district?: string;
  rank: 'NEW' | 'REGULAR' | 'VIP' | 'BLACKLIST';
  rankText: string;
  totalSpent: number;
  orderCount: number;
  points: number;
  debtAmount: number;
  notes?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  name: string;
  type: 'FLASH_SALE' | 'COMBO' | 'BUY_X_GET_Y' | 'DISCOUNT_PERCENT';
  typeName: string;
  discount: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  description?: string;
}

export interface ShippingRate {
  id: string;
  title: string;
  fee: number;
  freeThreshold?: number;
}

export interface ShippingZone {
  id: string;
  name: string;
  provinces: string[];
  rates: ShippingRate[];
  isActive: boolean;
}

export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  phone?: string;
  rating: number;
  comment: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  statusText: string;
  reply?: string;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER_NEW' | 'LOW_STOCK' | 'DEBT_DUE' | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  createdAt: string;
}

export interface SystemSetting {
  storeName: string;
  hotline: string;
  email: string;
  address: string;
  taxCode: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  vatDefault: number;
  currency: string;
  timezone: string;
  autoPrintReceipt: boolean;
  allowNegativeStock: boolean;
  primaryColor?: string;
  themePreset?: string;
}

export interface AdminDatabaseState {
  users: AdminUser[];
  roles: RoleDef[];
  warehouses: Warehouse[];
  suppliers: Supplier[];
  products: Product[];
  variants: ProductVariant[];
  stocks: StockItem[];
  stockMovements: StockMovement[];
  importVouchers: ImportVoucher[];
  exportVouchers: ExportVoucher[];
  transferVouchers: TransferVoucher[];
  adjustments: AdjustmentVoucher[];
  returns: ReturnVoucher[];
  customers: Customer[];
  coupons: Coupon[];
  promotions: Promotion[];
  shippingZones: ShippingZone[];
  reviews: ReviewItem[];
  notifications: AdminNotification[];
  activities: ActivityLogItem[];
  settings: SystemSetting;
  // compatibility with existing
  categories: { id: string | number; title: string; slug: string; itemCount: number }[];
  brands: string[];
  orders: any[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

// Ensure directory exists
function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getInitialAdminDb(): AdminDatabaseState {
  const warehouses: Warehouse[] = [
    {
      id: 'wh-01',
      code: 'KHO-HN',
      name: 'Kho Tổng Hà Nội - Mỹ Đình',
      address: 'Số 18 đường Phạm Hùng, Q. Nam Từ Liêm, TP. Hà Nội',
      phone: '024 3789 9999',
      managerName: 'Nguyễn Văn Hùng',
      isDefault: true,
      totalCapacity: 5000,
      createdAt: '01/01/2026',
    },
    {
      id: 'wh-02',
      code: 'KHO-SG',
      name: 'Kho Chi Nhánh TP.HCM - Tân Bình',
      address: 'Số 102 đường Cộng Hòa, Q. Tân Bình, TP. Hồ Chí Minh',
      phone: '028 3822 8888',
      managerName: 'Trần Minh Đức',
      isDefault: false,
      totalCapacity: 4000,
      createdAt: '15/01/2026',
    },
  ];

  const suppliers: Supplier[] = [
    {
      id: 'sup-01',
      code: 'NCC-ELMICH',
      name: 'Công ty Cổ phần Elmich Việt Nam',
      phone: '1900 6369 25',
      email: 'sales@elmich.vn',
      address: 'Tầng 17 tòa nhà Keangnam, Mễ Trì, Hà Nội',
      taxCode: '0105151525',
      contactPerson: 'Đỗ Thị Lan',
      totalImport: 450000000,
      totalPaid: 400000000,
      balanceDue: 50000000,
      rating: 4.9,
      note: 'Nhà cung cấp đồ gia dụng inox cao cấp tiêu chuẩn Châu Âu',
      createdAt: '05/01/2026',
    },
    {
      id: 'sup-02',
      code: 'NCC-SUNHOUSE',
      name: 'Tập đoàn Sunhouse Group',
      phone: '1800 6680',
      email: 'b2b@sunhouse.com.vn',
      address: 'Khu công nghiệp Ngọc Hồi, Thanh Trì, Hà Nội',
      taxCode: '0101569421',
      contactPerson: 'Hoàng Quốc Việt',
      totalImport: 780000000,
      totalPaid: 780000000,
      balanceDue: 0,
      rating: 4.8,
      note: 'Nhà sản xuất đồ gia dụng nhà bếp hàng đầu Việt Nam',
      createdAt: '10/01/2026',
    },
    {
      id: 'sup-03',
      code: 'NCC-PHILIPS',
      name: 'Philips Electronics Việt Nam',
      phone: '1800 5999 88',
      email: 'support.vn@philips.com',
      address: 'Tòa nhà Bitexco, Q. 1, TP. Hồ Chí Minh',
      taxCode: '0302482390',
      contactPerson: 'Mai Phương Uyên',
      totalImport: 920000000,
      totalPaid: 850000000,
      balanceDue: 70000000,
      rating: 5.0,
      note: 'Nồi chiên, máy xay, bàn ủi hơi nước cao cấp',
      createdAt: '12/01/2026',
    },
  ];

  const roles: RoleDef[] = [
    {
      id: 'role-01',
      name: 'Super Admin (Toàn quyền)',
      code: 'SUPER_ADMIN',
      description: 'Quản trị viên cấp cao nhất, toàn quyền cấu hình, tài chính, báo cáo và phân quyền',
      permissions: ['*'],
    },
    {
      id: 'role-02',
      name: 'Quản lý Kho & Vận hành',
      code: 'WAREHOUSE_MANAGER',
      description: 'Quản lý kho, tạo phiếu nhập/xuất/chuyển, kiểm kê tồn kho và công nợ nhà cung cấp',
      permissions: ['inventory:*', 'products:view', 'suppliers:*', 'reports:inventory'],
    },
    {
      id: 'role-03',
      name: 'Thu ngân & Bán hàng POS',
      code: 'CASHIER',
      description: 'Sử dụng màn hình POS bán hàng tại quầy, tra cứu sản phẩm, tạo hoá đơn',
      permissions: ['orders:pos', 'orders:view', 'customers:create', 'customers:view'],
    },
    {
      id: 'role-04',
      name: 'Kế toán & Tài chính',
      code: 'ACCOUNTANT',
      description: 'Theo dõi công nợ NCC/khách hàng, xuất hóa đơn VAT, báo cáo doanh thu & lợi nhuận',
      permissions: ['reports:*', 'suppliers:view', 'orders:view', 'settings:tax'],
    },
    {
      id: 'role-05',
      name: 'Chăm sóc Khách hàng (CSKH)',
      code: 'CSKH',
      description: 'Xử lý đơn hàng online, hỗ trợ khách, tạo yêu cầu đổi trả bảo hành',
      permissions: ['orders:*', 'returns:*', 'customers:*', 'reviews:*'],
    },
  ];

  const users: AdminUser[] = [
    {
      id: 'usr-01',
      name: 'Quản Trị Viên Cao Cấp',
      email: 'admin@example.com',
      phone: '0988 888 999',
      roleCode: 'SUPER_ADMIN',
      roleName: 'Super Admin',
      warehouseId: 'wh-01',
      isActive: true,
      createdAt: '01/01/2026',
    },
    {
      id: 'usr-02',
      name: 'Admin Betashop',
      email: 'admin@gmail.com',
      phone: '0912 345 678',
      roleCode: 'SUPER_ADMIN',
      roleName: 'Super Admin',
      warehouseId: 'wh-01',
      isActive: true,
      createdAt: '01/01/2026',
    },
    {
      id: 'usr-03',
      name: 'Lê Văn Kho (Thủ kho Hà Nội)',
      email: 'kho.hn@betashop.vn',
      phone: '0934 567 890',
      roleCode: 'WAREHOUSE_MANAGER',
      roleName: 'Quản lý Kho',
      warehouseId: 'wh-01',
      isActive: true,
      createdAt: '15/01/2026',
    },
    {
      id: 'usr-04',
      name: 'Trần Thu Ngân (POS Mỹ Đình)',
      email: 'pos.mydinh@betashop.vn',
      phone: '0966 789 012',
      roleCode: 'CASHIER',
      roleName: 'Thu ngân POS',
      warehouseId: 'wh-01',
      isActive: true,
      createdAt: '20/01/2026',
    },
  ];

  // Generate Variants and Stocks for STORE_PRODUCTS
  const variants: ProductVariant[] = [];
  const stocks: StockItem[] = [];

  STORE_PRODUCTS.forEach((p, idx) => {
    // Each appliance product has 1-2 standard variants
    const v1Id = `var-${p.id}-1`;
    const v1Sku = `BS-${String(p.id).toUpperCase()}-STD`;
    const v1Barcode = `893850${String(idx + 1).padStart(6, '0')}`;
    const v1Cost = Math.round(p.price * 0.72);

    variants.push({
      id: v1Id,
      productId: String(p.id),
      name: `${p.title.slice(0, 30)} - Tiêu chuẩn (220V)`,
      sku: v1Sku,
      barcode: v1Barcode,
      voltage: '220V',
      costPrice: v1Cost,
      retailPrice: p.price,
      salePrice: p.price,
    });

    // Stock for Warehouse 1 (HN)
    const hnQty = Math.max(8, p.stock || 25);
    stocks.push({
      id: `stk-${v1Id}-wh1`,
      productId: String(p.id),
      variantId: v1Id,
      productName: p.title,
      variantName: 'Bản Tiêu Chuẩn 220V',
      sku: v1Sku,
      barcode: v1Barcode,
      warehouseId: 'wh-01',
      warehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      quantity: hnQty,
      reserved: 2,
      available: hnQty - 2,
      costPrice: v1Cost,
      retailPrice: p.price,
      minAlert: 5,
      maxAlert: 100,
      updatedAt: '16/11/2026 12:00',
    });

    // Stock for Warehouse 2 (SG)
    const sgQty = Math.max(5, Math.round((p.stock || 20) * 0.6));
    stocks.push({
      id: `stk-${v1Id}-wh2`,
      productId: String(p.id),
      variantId: v1Id,
      productName: p.title,
      variantName: 'Bản Tiêu Chuẩn 220V',
      sku: v1Sku,
      barcode: v1Barcode,
      warehouseId: 'wh-02',
      warehouseName: 'Kho Chi Nhánh TP.HCM - Tân Bình',
      quantity: sgQty,
      reserved: 1,
      available: sgQty - 1,
      costPrice: v1Cost,
      retailPrice: p.price,
      minAlert: 5,
      maxAlert: 80,
      updatedAt: '16/11/2026 12:00',
    });
  });

  const stockMovements: StockMovement[] = [
    {
      id: 'mov-01',
      movementNo: 'LOG-2611-0001',
      variantId: variants[0]?.id || 'var-sp-01-1',
      productName: STORE_PRODUCTS[0]?.title || 'Nồi chiên không dầu Philips HD9280/90',
      variantName: 'Bản Tiêu Chuẩn 220V',
      warehouseId: 'wh-01',
      warehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      type: 'IMPORT',
      typeName: 'Nhập kho mua hàng',
      refDocType: 'ImportVoucher',
      refDocCode: 'PNK-202611-001',
      quantity: 50,
      stockBefore: 0,
      stockAfter: 50,
      performedBy: 'Lê Văn Kho',
      note: 'Nhập theo hóa đơn NCC Philips số 004812',
      createdAt: '10/11/2026 09:30',
    },
    {
      id: 'mov-02',
      movementNo: 'LOG-2611-0002',
      variantId: variants[1]?.id || 'var-sp-02-1',
      productName: STORE_PRODUCTS[1]?.title || 'Nồi cơm điện cao tần Cuckoo CRP-LHTR1010FW 1.8L',
      variantName: 'Bản Tiêu Chuẩn 220V',
      warehouseId: 'wh-01',
      warehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      type: 'SALE',
      typeName: 'Xuất bán đơn hàng',
      refDocType: 'Order',
      refDocCode: 'BS2611-9A82B',
      quantity: -1,
      stockBefore: 20,
      stockAfter: 19,
      performedBy: 'Hệ thống tự động',
      note: 'Xuất giao cho khách Trần Văn Hải',
      createdAt: '16/11/2026 10:15',
    },
    {
      id: 'mov-03',
      movementNo: 'LOG-2611-0003',
      variantId: variants[2]?.id || 'var-sp-03-1',
      productName: STORE_PRODUCTS[2]?.title || 'Bếp từ đôi Inverter Sunhouse Mama MMB9201DIH',
      variantName: 'Bản Tiêu Chuẩn 220V',
      warehouseId: 'wh-01',
      warehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      type: 'TRANSFER',
      typeName: 'Chuyển kho nội bộ',
      refDocType: 'TransferVoucher',
      refDocCode: 'PCK-202611-001',
      quantity: -10,
      stockBefore: 35,
      stockAfter: 25,
      performedBy: 'Lê Văn Kho',
      note: 'Điều chuyển sang Kho Chi Nhánh TP.HCM',
      createdAt: '14/11/2026 14:00',
    },
  ];

  const importVouchers: ImportVoucher[] = [
    {
      id: 'imp-01',
      code: 'PNK-202611-001',
      supplierId: 'sup-03',
      supplierName: 'Philips Electronics Việt Nam',
      warehouseId: 'wh-01',
      warehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      invoiceNumber: 'HD-PL-8921',
      importDate: '10/11/2026',
      status: 'COMPLETED',
      statusText: 'Đã hoàn thành',
      subtotal: 120000000,
      discount: 2000000,
      vatAmount: 11800000,
      totalAmount: 129800000,
      paidAmount: 100000000,
      debtAmount: 29800000,
      note: 'Nhập lô hàng nồi chiên và máy xay sinh tố phục vụ Black Friday',
      createdBy: 'Lê Văn Kho',
      items: [
        {
          variantId: variants[0]?.id || 'var-sp-01-1',
          productName: STORE_PRODUCTS[0]?.title || 'Nồi chiên không dầu Philips HD9280/90',
          variantName: 'Bản Tiêu Chuẩn 220V',
          sku: 'BS-SP-01-STD',
          quantity: 30,
          costPrice: 2080000,
          discount: 0,
          total: 62400000,
        },
      ],
      createdAt: '10/11/2026 09:15',
    },
    {
      id: 'imp-02',
      code: 'PNK-202611-002',
      supplierId: 'sup-02',
      supplierName: 'Tập đoàn Sunhouse Group',
      warehouseId: 'wh-01',
      warehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      invoiceNumber: 'SH-2026-901',
      importDate: '12/11/2026',
      status: 'COMPLETED',
      statusText: 'Đã hoàn thành',
      subtotal: 85000000,
      discount: 1000000,
      vatAmount: 8400000,
      totalAmount: 92400000,
      paidAmount: 92400000,
      debtAmount: 0,
      note: 'Nhập bếp từ đôi và nồi áp suất',
      createdBy: 'Lê Văn Kho',
      items: [
        {
          variantId: variants[2]?.id || 'var-sp-03-1',
          productName: STORE_PRODUCTS[2]?.title || 'Bếp từ đôi Inverter Sunhouse Mama MMB9201DIH',
          variantName: 'Bản Tiêu Chuẩn 220V',
          sku: 'BS-SP-03-STD',
          quantity: 20,
          costPrice: 3800000,
          discount: 0,
          total: 76000000,
        },
      ],
      createdAt: '12/11/2026 15:40',
    },
  ];

  const exportVouchers: ExportVoucher[] = [
    {
      id: 'exp-01',
      code: 'PXK-202611-001',
      warehouseId: 'wh-01',
      warehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      reason: 'SALE',
      reasonText: 'Xuất giao đơn bán hàng online',
      status: 'COMPLETED',
      exportDate: '15/11/2026',
      note: 'Giao hàng đợt 1 sáng',
      createdBy: 'Lê Văn Kho',
      items: [
        {
          variantId: variants[0]?.id || 'var-sp-01-1',
          productName: STORE_PRODUCTS[0]?.title || 'Nồi chiên không dầu Philips HD9280/90',
          variantName: 'Bản Tiêu Chuẩn 220V',
          sku: 'BS-SP-01-STD',
          quantity: 3,
          unitPrice: 2890000,
          total: 8670000,
        },
      ],
      createdAt: '15/11/2026 08:30',
    },
  ];

  const transferVouchers: TransferVoucher[] = [
    {
      id: 'trf-01',
      code: 'PCK-202611-001',
      fromWarehouseId: 'wh-01',
      fromWarehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      toWarehouseId: 'wh-02',
      toWarehouseName: 'Kho Chi Nhánh TP.HCM - Tân Bình',
      status: 'RECEIVED',
      statusText: 'Đã nhận đủ',
      transferDate: '14/11/2026',
      receivedDate: '16/11/2026',
      createdBy: 'Lê Văn Kho',
      receivedBy: 'Trần Minh Đức',
      note: 'Chi viện hàng cho chi nhánh miền Nam',
      items: [
        {
          variantId: variants[0]?.id || 'var-sp-01-1',
          productName: STORE_PRODUCTS[0]?.title || 'Nồi chiên không dầu Philips HD9280/90',
          variantName: 'Bản Tiêu Chuẩn 220V',
          sku: 'BS-SP-01-STD',
          quantity: 10,
        },
      ],
      createdAt: '14/11/2026 10:00',
    },
  ];

  const adjustments: AdjustmentVoucher[] = [
    {
      id: 'adj-01',
      code: 'PKK-202611-001',
      warehouseId: 'wh-01',
      warehouseName: 'Kho Tổng Hà Nội - Mỹ Đình',
      reason: 'Kiểm kê định kỳ tháng 11/2026',
      status: 'COMPLETED',
      auditDate: '01/11/2026',
      createdBy: 'Nguyễn Văn Hùng',
      note: 'Khớp số liệu tồn sổ sách và thực tế 99.8%',
      items: [
        {
          variantId: variants[0]?.id || 'var-sp-01-1',
          productName: STORE_PRODUCTS[0]?.title || 'Nồi chiên không dầu Philips HD9280/90',
          variantName: 'Bản Tiêu Chuẩn 220V',
          sku: 'BS-SP-01-STD',
          bookQuantity: 25,
          realQuantity: 25,
          diffQuantity: 0,
          costPrice: 2080000,
          diffAmount: 0,
          note: 'Chính xác',
        },
      ],
      createdAt: '01/11/2026 18:00',
    },
  ];

  const returns: ReturnVoucher[] = [
    {
      id: 'ret-01',
      code: 'PTH-202611-001',
      orderId: 'ord-1',
      orderCode: 'BS2611-9A82B',
      customerName: 'Hoàng Văn Nam',
      reason: 'Khách muốn đổi lên mẫu dung tích 7L lớn hơn',
      refundMethod: 'BANK_TRANSFER',
      refundAmount: 2890000,
      status: 'COMPLETED',
      restockType: 'RESTOCK_USABLE',
      createdBy: 'CSKH Thùy Linh',
      note: 'Hàng nguyên seal, phụ kiện đầy đủ, đã nhập lại kho sẵn sàng bán',
      items: [
        {
          variantId: variants[0]?.id || 'var-sp-01-1',
          productName: STORE_PRODUCTS[0]?.title || 'Nồi chiên không dầu Philips HD9280/90',
          variantName: 'Bản Tiêu Chuẩn 220V',
          sku: 'BS-SP-01-STD',
          quantity: 1,
          price: 2890000,
          total: 2890000,
        },
      ],
      createdAt: '15/11/2026 14:20',
    },
  ];

  const customers: Customer[] = [
    {
      id: 'cus-01',
      code: 'KH-0001',
      name: 'Nguyễn Thanh Tùng',
      phone: '0988 123 456',
      email: 'thanhtung.nguyen@gmail.com',
      address: 'Số 45 phố Nguyễn Khang, P. Yên Hòa, Cầu Giấy, Hà Nội',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      rank: 'VIP',
      rankText: 'Khách Hàng VIP',
      totalSpent: 42500000,
      orderCount: 8,
      points: 4250,
      debtAmount: 0,
      notes: 'Thường xuyên mua quà tặng doanh nghiệp dịp lễ Tết',
      createdAt: '10/01/2026',
    },
    {
      id: 'cus-02',
      code: 'KH-0002',
      name: 'Vũ Thị Minh Hạnh',
      phone: '0912 999 888',
      email: 'minhhanh.vu@yahoo.com',
      address: 'Biệt thự Vinhomes Riverside, Long Biên, Hà Nội',
      province: 'Hà Nội',
      district: 'Long Biên',
      rank: 'VIP',
      rankText: 'Khách Hàng VIP',
      totalSpent: 68900000,
      orderCount: 12,
      points: 6890,
      debtAmount: 0,
      notes: 'Yêu thích thương hiệu Philips, Dyson và Cuckoo',
      createdAt: '15/02/2026',
    },
    {
      id: 'cus-03',
      code: 'KH-0003',
      name: 'Phạm Quốc Hưng',
      phone: '0903 456 789',
      email: 'hung.pham@saigontech.vn',
      address: 'Chung cư Masteri Thảo Điền, Q. 2, TP. Thủ Đức',
      province: 'TP. Hồ Chí Minh',
      district: 'Thành phố Thủ Đức',
      rank: 'REGULAR',
      rankText: 'Thân Thiết',
      totalSpent: 12800000,
      orderCount: 3,
      points: 1280,
      debtAmount: 0,
      notes: 'Khách mua qua kênh Shopee và website',
      createdAt: '01/04/2026',
    },
    {
      id: 'cus-04',
      code: 'KH-0004',
      name: 'Trần Mai Hoa',
      phone: '0977 111 222',
      email: 'maihoa@gmail.com',
      address: 'Số 12 phố Huế, Hai Bà Trưng, Hà Nội',
      province: 'Hà Nội',
      district: 'Hai Bà Trưng',
      rank: 'NEW',
      rankText: 'Khách Mới',
      totalSpent: 3290000,
      orderCount: 1,
      points: 320,
      debtAmount: 0,
      notes: 'Mua máy lọc không khí Sharp',
      createdAt: '12/11/2026',
    },
  ];

  const coupons: Coupon[] = [
    {
      id: 'coup-01',
      code: 'WELCOME10',
      description: 'Giảm 10% tối đa 150.000 ₫ cho khách hàng mới đặt đơn đầu tiên',
      type: 'PERCENT',
      value: 10,
      minOrder: 500000,
      maxDiscount: 150000,
      usageLimit: 1000,
      usedCount: 142,
      startDate: '01/01/2026',
      isActive: true,
      createdAt: '01/01/2026',
    },
    {
      id: 'coup-02',
      code: 'SALE50K',
      description: 'Giảm ngay 50.000 ₫ cho đơn hàng gia dụng từ 1.000.000 ₫',
      type: 'FIXED',
      value: 50000,
      minOrder: 1000000,
      usageLimit: 500,
      usedCount: 88,
      startDate: '01/11/2026',
      isActive: true,
      createdAt: '01/11/2026',
    },
    {
      id: 'coup-03',
      code: 'FREESHIP',
      description: 'Miễn phí vận chuyển toàn quốc cho đơn hàng từ 2.000.000 ₫',
      type: 'FIXED',
      value: 40000,
      minOrder: 2000000,
      usageLimit: 2000,
      usedCount: 310,
      startDate: '01/01/2026',
      isActive: true,
      createdAt: '01/01/2026',
    },
  ];

  const promotions: Promotion[] = [
    {
      id: 'promo-01',
      name: 'Siêu Sale Gia Dụng Cuối Năm - Giảm Tới 50%',
      type: 'FLASH_SALE',
      typeName: 'Flash Sale',
      discount: 50,
      startDate: '10/11/2026',
      endDate: '30/11/2026',
      isActive: true,
      description: 'Áp dụng cho các dòng nồi chiên không dầu, bếp từ và máy hút bụi',
    },
    {
      id: 'promo-02',
      name: 'Combo Bếp Hoàn Hảo (Bếp từ đôi + Bộ nồi chảo Inox)',
      type: 'COMBO',
      typeName: 'Combo Tiết Kiệm',
      discount: 15,
      startDate: '01/11/2026',
      endDate: '31/12/2026',
      isActive: true,
      description: 'Mua kèm bộ nồi Inox 5 đáy Elmich giảm thêm 15%',
    },
  ];

  const shippingZones: ShippingZone[] = [
    {
      id: 'zone-01',
      name: 'Khu vực Nội thành Hà Nội',
      provinces: ['Hà Nội'],
      isActive: true,
      rates: [
        { id: 'rate-1', title: 'Giao siêu tốc 2 giờ', fee: 35000, freeThreshold: 3000000 },
        { id: 'rate-2', title: 'Giao trong ngày tiêu chuẩn', fee: 20000, freeThreshold: 1500000 },
      ],
    },
    {
      id: 'zone-02',
      name: 'Khu vực Nội thành TP. Hồ Chí Minh',
      provinces: ['TP. Hồ Chí Minh'],
      isActive: true,
      rates: [
        { id: 'rate-3', title: 'Giao siêu tốc 2 giờ', fee: 35000, freeThreshold: 3000000 },
        { id: 'rate-4', title: 'Giao tiêu chuẩn 24 giờ', fee: 20000, freeThreshold: 1500000 },
      ],
    },
    {
      id: 'zone-03',
      name: 'Các tỉnh thành khác toàn quốc (Napas/ViettelPost/GHTK)',
      provinces: ['Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Đồng Nai', 'Bình Dương', 'Khánh Hòa', 'Nghệ An'],
      isActive: true,
      rates: [
        { id: 'rate-5', title: 'Chuyển phát nhanh đường bay (24-48h)', fee: 45000, freeThreshold: 5000000 },
        { id: 'rate-6', title: 'Giao tiết kiệm đường bộ (3-5 ngày)', fee: 30000, freeThreshold: 2500000 },
      ],
    },
  ];

  const reviews: ReviewItem[] = [
    {
      id: 'rev-01',
      productId: 'sp-01',
      productName: 'Nồi chiên không dầu Philips HD9280/90 6.2L',
      authorName: 'Chị Mai Linh',
      phone: '0988***456',
      rating: 5,
      comment: 'Nồi chiên dung tích lớn, chiên được nguyên con gà 2kg vàng giòn không bị khô. Rất ưng ý với phục vụ của Betashop!',
      status: 'APPROVED',
      statusText: 'Đã duyệt',
      reply: 'Betashop cảm ơn chị Mai Linh đã tin tưởng và đánh giá sản phẩm. Chúc chị và gia đình có nhiều món ăn ngon!',
      createdAt: '15/11/2026',
    },
    {
      id: 'rev-02',
      productId: 'sp-03',
      productName: 'Bếp từ đôi Inverter Sunhouse Mama MMB9201DIH',
      authorName: 'Anh Tuấn',
      phone: '0912***789',
      rating: 5,
      comment: 'Bếp đun sôi cực nhanh, quạt gió êm, mặt kính Schott Ceran sáng bóng dễ lau chùi. Hàng chuẩn chính hãng.',
      status: 'APPROVED',
      statusText: 'Đã duyệt',
      reply: 'Dạ Betashop rất vui vì anh hài lòng ạ. Bếp được bảo hành chính hãng 36 tháng tại nhà anh nhé!',
      createdAt: '16/11/2026',
    },
  ];

  const notifications: AdminNotification[] = [
    {
      id: 'notif-01',
      title: 'Đơn hàng mới từ Web',
      message: 'Khách hàng Lê Thị Thu vừa đặt đơn #BS2611-3E51F (Trị giá 2.890.000 ₫)',
      type: 'ORDER_NEW',
      link: '/admin/orders',
      isRead: false,
      createdAt: '16/11/2026 11:30',
    },
    {
      id: 'notif-02',
      title: 'Cảnh báo sắp hết hàng',
      message: 'Sản phẩm "Robot hút bụi Dreame L20 Ultra" chỉ còn 3 chiếc tại Kho Tổng Hà Nội (dưới định mức 5 chiếc)',
      type: 'LOW_STOCK',
      link: '/admin/inventory/stock',
      isRead: false,
      createdAt: '16/11/2026 09:00',
    },
    {
      id: 'notif-03',
      title: 'Công nợ nhà cung cấp đến hạn',
      message: 'Khoản công nợ 50.000.000 ₫ với NCC Elmich Việt Nam đến hạn thanh toán vào 20/11/2026',
      type: 'DEBT_DUE',
      link: '/admin/suppliers',
      isRead: false,
      createdAt: '15/11/2026 08:30',
    },
  ];

  const activities: ActivityLogItem[] = [
    {
      id: 'act-01',
      userName: 'Quản Trị Viên Cao Cấp',
      action: 'UPDATE',
      module: 'PRODUCTS',
      details: 'Cập nhật giá khuyến mãi cho sản phẩm "Nồi cơm điện Cuckoo 1.8L"',
      createdAt: '16/11/2026 11:45',
    },
    {
      id: 'act-02',
      userName: 'Lê Văn Kho',
      action: 'CREATE',
      module: 'INVENTORY',
      details: 'Tạo phiếu nhập kho PNK-202611-002 từ NCC Sunhouse Group',
      createdAt: '12/11/2026 15:40',
    },
    {
      id: 'act-03',
      userName: 'Trần Thu Ngân',
      action: 'CREATE',
      module: 'ORDERS',
      details: 'Tạo đơn hàng POS tại quầy cho khách lẻ #BS2611-POS001',
      createdAt: '16/11/2026 10:20',
    },
  ];

  const settings: SystemSetting = {
    storeName: 'BETASHOP – TỔNG KHO ĐỒ GIA DỤNG VIỆT NAM',
    hotline: '1900 8237',
    email: 'cskh@betashop.vn',
    address: 'Số 18 đường Phạm Hùng, P. Mỹ Đình 2, Q. Nam Từ Liêm, TP. Hà Nội',
    taxCode: '0109988776',
    bankName: 'Vietcombank (Chi nhánh Thăng Long, Hà Nội)',
    bankAccount: '9999 8888 6666',
    bankAccountName: 'CONG TY CO PHAN BETASHOP VIET NAM',
    vatDefault: 10,
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    autoPrintReceipt: true,
    allowNegativeStock: false,
    primaryColor: '#f53d2d',
    themePreset: 'orange',
  };

  const sampleOrders = [
    {
      id: 'ord-1',
      code: 'BS2611-9A82B',
      orderType: 'ONLINE',
      customerName: 'Trần Văn Hải',
      phone: '0988 123 456',
      email: 'hai.tran@gmail.com',
      address: 'Số 45 phố Nguyễn Khang, P. Yên Hòa',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      items: [
        {
          productId: 'sp-03',
          variantId: variants[2]?.id || 'var-sp-03-1',
          title: 'Bếp từ đôi Inverter Sunhouse Mama MMB9201DIH',
          price: 5290000,
          quantity: 1,
          image: STORE_PRODUCTS[2]?.image || '',
        },
      ],
      totalAmount: 5290000,
      shippingFee: 0,
      finalTotal: 5290000,
      status: 'COMPLETED',
      statusText: 'Đã hoàn thành',
      paymentMethod: 'VIETQR',
      paymentStatus: 'PAID',
      createdAt: '16/11/2026 10:15',
    },
    {
      id: 'ord-2',
      code: 'BS2611-3E51F',
      orderType: 'ONLINE',
      customerName: 'Lê Thị Thu',
      phone: '0977 456 789',
      email: 'thule@gmail.com',
      address: 'Tòa nhà Landmark 81, P. 22',
      province: 'TP. Hồ Chí Minh',
      district: 'Bình Thạnh',
      items: [
        {
          productId: 'sp-01',
          variantId: variants[0]?.id || 'var-sp-01-1',
          title: 'Nồi chiên không dầu điện tử Philips HD9280/90 6.2L',
          price: 2890000,
          quantity: 1,
          image: STORE_PRODUCTS[0]?.image || '',
        },
      ],
      totalAmount: 2890000,
      shippingFee: 30000,
      finalTotal: 2920000,
      status: 'PENDING',
      statusText: 'Chờ xác nhận',
      paymentMethod: 'COD',
      paymentStatus: 'UNPAID',
      createdAt: '16/11/2026 11:30',
    },
    {
      id: 'ord-3',
      code: 'BS2611-POS001',
      orderType: 'POS',
      customerName: 'Khách Lẻ Mua Tại Quầy',
      phone: '0912 345 678',
      address: 'Mua trực tiếp tại Showroom Cầu Giấy',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      items: [
        {
          productId: 'sp-06',
          variantId: variants[5]?.id || 'var-sp-06-1',
          title: 'Bình đun siêu tốc thông minh Xiaomi Smart Kettle Pro',
          price: 790000,
          quantity: 2,
          image: STORE_PRODUCTS[5]?.image || '',
        },
      ],
      totalAmount: 1580000,
      shippingFee: 0,
      finalTotal: 1580000,
      status: 'COMPLETED',
      statusText: 'Đã hoàn thành',
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      createdAt: '16/11/2026 10:20',
    },
    {
      id: 'ord-4',
      code: 'BS2611-7F89C',
      orderType: 'ONLINE',
      customerName: 'Phạm Minh Tuấn',
      phone: '0966 222 333',
      address: 'Số 88 đường Láng Hạ',
      province: 'Hà Nội',
      district: 'Đống Đa',
      items: [
        {
          productId: 'sp-04',
          variantId: variants[3]?.id || 'var-sp-04-1',
          title: 'Robot hút bụi lau nhà Dreame L20 Ultra tự giặt sấy giẻ',
          price: 18990000,
          quantity: 1,
          image: STORE_PRODUCTS[3]?.image || '',
        },
      ],
      totalAmount: 18990000,
      shippingFee: 0,
      finalTotal: 18990000,
      status: 'SHIPPING',
      statusText: 'Đang giao hàng',
      paymentMethod: 'VIETQR',
      paymentStatus: 'PAID',
      createdAt: '16/11/2026 08:45',
    },
  ];

  return {
    users,
    roles,
    warehouses,
    suppliers,
    products: STORE_PRODUCTS,
    variants,
    stocks,
    stockMovements,
    importVouchers,
    exportVouchers,
    transferVouchers,
    adjustments,
    returns,
    customers,
    coupons,
    promotions,
    shippingZones,
    reviews,
    notifications,
    activities,
    settings,
    categories: STORE_CATEGORIES.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug.replace('/danh-muc/', ''),
      itemCount: c.itemCount || 10,
    })),
    brands: ['Philips', 'Panasonic', 'Cuckoo', 'Sunhouse', 'Dreame', 'Xiaomi', 'Lock&Lock', 'Tefal', 'Sharp', 'Dyson', 'Elmich', 'Hurom'],
    orders: sampleOrders,
  };
}

// -------------------------------------------------------------
// DATA ADAPTERS (SUPABASE RECORD <-> ADMIN STATE MODEL)
// -------------------------------------------------------------

function getOrderStatusText(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Chờ xác nhận';
    case 'PROCESSING':
    case 'CONFIRMED':
    case 'PACKING':
      return 'Đang xử lý';
    case 'SHIPPING':
      return 'Đang giao hàng';
    case 'COMPLETED':
      return 'Đã hoàn thành';
    case 'CANCELLED':
    case 'CANCELED':
      return 'Đã hủy';
    default:
      return status;
  }
}

export function mapCategoryRow(c: any) {
  return {
    id: c.id,
    name: c.name,
    title: c.name,
    nameVi: c.nameVi || c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || null,
    parentId: c.parentId || null,
    parent: c.parentId || 'Danh mục gốc',
    itemCount: 0,
    sortOrder: c.sortOrder || 0,
    isActive: c.isActive !== false,
    partnerSource: c.partnerSource || 'local',
    partnerId: c.partnerId || null,
    lastSyncedAt: c.lastSyncedAt || null,
  };
}

export function sanitizeWhiteLabel(text: string): string {
  if (!text) return '';
  return text
    .replace(/taikhoan\.site/gi, 'BetaShop')
    .replace(/vuavia\.io/gi, 'BetaShop')
    .replace(/hupsms\.com/gi, 'BetaShop')
    .replace(/thanhplus\.vn/gi, 'BetaShop')
    .replace(/thapcammmo\.vn/gi, 'BetaShop')
    .replace(/đồng bộ từ [^.]+[\s.]*/gi, 'chính hãng tại BetaShop. ')
    .replace(/kích hoạt tự động qua API [^.]*\./gi, 'Kích hoạt tự động 24/7 qua hệ thống BetaShop.')
    .replace(/qua API [a-zA-Z0-9_.-]+/gi, 'qua hệ thống BetaShop')
    .replace(/qua hệ thống API/gi, 'qua hệ thống BetaShop');
}

export function mapProductRow(p: any, isPublic?: boolean | number): Product {
  const publicMode = typeof isPublic === 'boolean' ? isPublic : false;
  const costPrice = p.costPrice || p.partnerPrice || 0;
  const markup = p.markupPercent || 20;
  const suggestedPrice = Math.round(costPrice * (1 + markup / 100));
  const effectivePrice =
    p.customPrice !== null && p.customPrice !== undefined
      ? p.customPrice
      : (p.retailPrice || suggestedPrice);

  let specs = {};
  if (p.specsJson) {
    try {
      specs = typeof p.specsJson === 'string' ? JSON.parse(p.specsJson) : p.specsJson;
    } catch (e) {
      specs = {};
    }
  }

  let features: string[] = [];
  if (p.featuresJson) {
    try {
      features = typeof p.featuresJson === 'string' ? JSON.parse(p.featuresJson) : p.featuresJson;
    } catch (e) {
      features = [];
    }
  }

  const rawDesc = p.description || p.shortDesc || '';
  const cleanDesc = sanitizeWhiteLabel(rawDesc);
  const cleanName = sanitizeWhiteLabel(p.name || '');

  const productData: any = {
    id: p.id,
    title: cleanName,
    name: cleanName,
    slug: p.slug,
    sku: p.sku || `BS-${p.id}`,
    barcode: p.barcode || undefined,
    price: effectivePrice,
    originalPrice: p.salePrice || (effectivePrice > 0 ? Math.round(effectivePrice * 1.25) : 0),
    image: p.thumbnail || 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80',
    images: [p.thumbnail].filter(Boolean),
    rating: p.rating || 5.0,
    reviewCount: p.reviewCount || 0,
    sold: p.soldCount || 0,
    category: p.category?.name || 'Đồ Gia Dụng',
    categorySlug: p.category?.slug || 'do-gia-dung',
    categoryId: p.categoryId,
    brand: p.brand?.name || 'Chính Hãng',
    brandId: p.brandId,
    status: p.status || 'ACTIVE',
    stock: p.partnerStock !== undefined ? p.partnerStock : 50,
    quantity: p.partnerStock !== undefined ? p.partnerStock : 50,
    description: cleanDesc,
    features: features.map(sanitizeWhiteLabel),
    specs,
    badge: p.badge || undefined,
  };

  if (!publicMode) {
    productData.costPrice = costPrice;
    productData.retailPrice = p.retailPrice || effectivePrice;
    productData.customPrice = p.customPrice;
    productData.markupPercent = markup;
    productData.partnerSource = p.partnerSource || 'local';
    productData.partnerId = p.partnerId || null;
  }

  return productData as Product;
}

export function mapSettingsRows(rows: any[]): SystemSetting {
  const map: Record<string, any> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return {
    storeName: map['storeName'] || map['store_name'] || 'BETASHOP – TỔNG KHO ĐỒ GIA DỤNG VIỆT NAM',
    hotline: map['hotline'] || '1900 8237',
    email: map['email'] || 'cskh@betashop.vn',
    address: map['address'] || 'Số 18 đường Phạm Hùng, P. Mỹ Đình 2, Q. Nam Từ Liêm, TP. Hà Nội',
    taxCode: map['taxCode'] || map['tax_code'] || '0109988776',
    bankName: map['bankName'] || map['bank_name'] || 'Vietcombank (Chi nhánh Thăng Long, Hà Nội)',
    bankAccount: map['bankAccount'] || map['bank_account'] || '9999 8888 6666',
    bankAccountName: map['bankAccountName'] || map['bank_account_name'] || 'CONG TY CO PHAN BETASHOP VIET NAM',
    vatDefault: Number(map['vatDefault'] || map['vat_default'] || 10),
    currency: map['currency'] || 'VND',
    timezone: map['timezone'] || 'Asia/Ho_Chi_Minh',
    autoPrintReceipt: map['autoPrintReceipt'] !== 'false',
    allowNegativeStock: map['allowNegativeStock'] === 'true',
    primaryColor: map['primaryColor'] || map['primary_color'] || '#f53d2d',
    themePreset: map['themePreset'] || map['theme_preset'] || 'orange',
  };
}

export function mapOrderRow(o: any) {
  return {
    id: o.id,
    code: o.code,
    orderType: o.orderType || 'ONLINE',
    customerName: o.customerName,
    phone: o.customerPhone,
    customerPhone: o.customerPhone,
    email: o.customerEmail || undefined,
    customerEmail: o.customerEmail || undefined,
    address: o.shippingAddress,
    shippingAddress: o.shippingAddress,
    province: o.province || '',
    district: o.district || '',
    note: o.note || undefined,
    items: (o.items || []).map((it: any) => ({
      productId: it.variant?.productId || it.variantId || it.id,
      variantId: it.variantId,
      title: it.title,
      price: it.price,
      quantity: it.quantity,
      total: it.total,
      image:
        it.variant?.product?.thumbnail ||
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80',
    })),
    totalAmount: o.subtotal || o.finalTotal || 0,
    subtotal: o.subtotal || o.finalTotal || 0,
    shippingFee: o.shippingFee || 0,
    discountAmount: o.discountAmount || 0,
    finalTotal: o.finalTotal || 0,
    status: o.status,
    statusText: getOrderStatusText(o.status),
    paymentMethod: o.paymentMethod || 'COD',
    paymentStatus: o.paymentStatus || 'UNPAID',
    createdAt: o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN') : '',
  };
}

// -------------------------------------------------------------
// LOCAL FALLBACK DATABASE & AUTO-SEED ENGINE
// -------------------------------------------------------------

export function getLocalFallbackDb(): AdminDatabaseState {
  ensureDir();
  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      const initial = getInitialAdminDb();
      return {
        ...initial,
        ...parsed,
      };
    } catch (e) {
      // fallback to initial
    }
  }
  return getInitialAdminDb();
}

let seedEnsured = false;

export async function ensureSeedData(): Promise<void> {
  if (seedEnsured) return;
  try {
    // 1. Setting check
    const { count: settingCount } = await supabaseAdmin.from('Setting').select('*', { count: 'exact', head: true });
    if (!settingCount || settingCount === 0) {
      const localDb = getLocalFallbackDb();
      const settingEntries = Object.entries(localDb.settings || {}).map(([key, val]) => ({
        id: `set-${key}`,
        key,
        value: String(val),
        group: 'GENERAL',
        updatedAt: new Date().toISOString(),
      }));
      if (settingEntries.length > 0) {
        await supabaseAdmin.from('Setting').upsert(settingEntries, { onConflict: 'id' });
      }
    }

    // 2. ProductVariant & Stock check
    const { count: variantCount } = await supabaseAdmin.from('ProductVariant').select('*', { count: 'exact', head: true });
    if (!variantCount || variantCount === 0) {
      const localDb = getLocalFallbackDb();
      const { data: supaProducts } = await supabaseAdmin.from('Product').select('id');
      const validProductIds = new Set((supaProducts || []).map((p: any) => p.id));

      const validVariants = (localDb.variants || []).filter((v) => validProductIds.has(v.productId));
      if (validVariants.length > 0) {
        const variantsPayload = validVariants.map((v) => ({
          id: v.id,
          productId: v.productId,
          name: v.name,
          sku: v.sku,
          barcode: v.barcode || null,
          costPrice: v.costPrice || 0,
          retailPrice: v.retailPrice || 0,
          salePrice: v.salePrice || null,
        }));
        await supabaseAdmin.from('ProductVariant').upsert(variantsPayload, { onConflict: 'id' });

        const validVariantIds = new Set(validVariants.map((v) => v.id));
        const validStocks = (localDb.stocks || []).filter((s) => validVariantIds.has(s.variantId));
        if (validStocks.length > 0) {
          const stocksPayload = validStocks.map((s) => ({
            id: s.id,
            variantId: s.variantId,
            warehouseId: s.warehouseId,
            quantity: s.quantity,
            reserved: s.reserved,
            available: s.available,
          }));
          await supabaseAdmin.from('Stock').upsert(stocksPayload, { onConflict: 'id' });
        }
      }
    }

    // 3. Customer check
    const { count: customerCount } = await supabaseAdmin.from('Customer').select('*', { count: 'exact', head: true });
    if (!customerCount || customerCount === 0) {
      const localDb = getLocalFallbackDb();
      if (localDb.customers && localDb.customers.length > 0) {
        const customersPayload = localDb.customers.map((c) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          phone: c.phone,
          email: c.email || null,
          rank: c.rank || 'NEW',
          totalSpent: c.totalSpent || 0,
          orderCount: c.orderCount || 0,
          points: c.points || 0,
          debtAmount: c.debtAmount || 0,
        }));
        await supabaseAdmin.from('Customer').upsert(customersPayload, { onConflict: 'id' });
      }
    }

    seedEnsured = true;
  } catch (err) {
    console.warn('[adminDb] Auto-seed warning:', err);
  }
}

// -------------------------------------------------------------
// SLICE LOADER & HYBRID THENABLE DATA ACCESS LAYER
// -------------------------------------------------------------

export async function readAdminDbSlice<K extends keyof AdminDatabaseState>(
  slice: K
): Promise<AdminDatabaseState[K]> {
  await ensureSeedData();
  const localDb = getLocalFallbackDb();

  try {
    switch (slice) {
      case 'categories': {
        const { data, error } = await supabaseAdmin
          .from('Category')
          .select('*')
          .order('sortOrder', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(mapCategoryRow) as any;
        }
        return localDb.categories as any;
      }

      case 'products': {
        const { data, error } = await supabaseAdmin
          .from('Product')
          .select('*, category:Category(name, slug), brand:Brand(name, slug)')
          .order('createdAt', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(mapProductRow) as any;
        }
        return localDb.products as any;
      }

      case 'settings': {
        const { data, error } = await supabaseAdmin.from('Setting').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return mapSettingsRows(data) as any;
        }
        return localDb.settings as any;
      }

      case 'orders': {
        const { data, error } = await supabaseAdmin
          .from('Order')
          .select('*, items:OrderItem(*, variant:ProductVariant(*, product:Product(thumbnail)))')
          .order('createdAt', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map(mapOrderRow) as any;
        }
        return localDb.orders as any;
      }

      case 'customers': {
        const { data, error } = await supabaseAdmin
          .from('Customer')
          .select('*')
          .order('createdAt', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((c: any) => ({
            ...c,
            rankText: c.rank === 'VIP' ? 'Khách VIP' : c.rank === 'REGULAR' ? 'Thân thiết' : 'Khách mới',
            createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : '',
          })) as any;
        }
        return localDb.customers as any;
      }

      case 'coupons': {
        const { data, error } = await supabaseAdmin.from('Coupon').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as any;
        return localDb.coupons as any;
      }

      case 'promotions': {
        const { data, error } = await supabaseAdmin.from('Promotion').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as any;
        return localDb.promotions as any;
      }

      case 'suppliers': {
        const { data, error } = await supabaseAdmin.from('Supplier').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as any;
        return localDb.suppliers as any;
      }

      case 'warehouses': {
        const { data, error } = await supabaseAdmin.from('Warehouse').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as any;
        return localDb.warehouses as any;
      }

      case 'variants': {
        const { data, error } = await supabaseAdmin.from('ProductVariant').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as any;
        return localDb.variants as any;
      }

      case 'stocks': {
        const { data, error } = await supabaseAdmin
          .from('Stock')
          .select('*, variant:ProductVariant(*, product:Product(name, sku, barcode, costPrice, retailPrice)), warehouse:Warehouse(name)');
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((s: any) => ({
            id: s.id,
            productId: s.variant?.productId || '',
            variantId: s.variantId,
            productName: s.variant?.product?.name || '',
            variantName: s.variant?.name || '',
            sku: s.variant?.sku || s.variant?.product?.sku || '',
            barcode: s.variant?.barcode || s.variant?.product?.barcode || '',
            warehouseId: s.warehouseId,
            warehouseName: s.warehouse?.name || '',
            quantity: s.quantity || 0,
            reserved: s.reserved || 0,
            available: s.available || (s.quantity - (s.reserved || 0)),
            costPrice: s.variant?.costPrice || s.variant?.product?.costPrice || 0,
            retailPrice: s.variant?.retailPrice || s.variant?.product?.retailPrice || 0,
            minAlert: 5,
            maxAlert: 100,
            updatedAt: s.updatedAt ? new Date(s.updatedAt).toLocaleString('vi-VN') : '',
          })) as any;
        }
        return localDb.stocks as any;
      }

      case 'stockMovements': {
        const { data, error } = await supabaseAdmin.from('StockMovement').select('*').order('createdAt', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) return data as any;
        return localDb.stockMovements as any;
      }

      case 'users': {
        const { data, error } = await supabaseAdmin.from('User').select('*, role:Role(code, name)');
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || '',
            avatar: u.avatar || undefined,
            roleCode: u.role?.code || 'CSKH',
            roleName: u.role?.name || 'Nhân viên',
            warehouseId: u.warehouseId || undefined,
            isActive: u.isActive !== false,
            createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '',
          })) as any;
        }
        return localDb.users as any;
      }

      case 'roles': {
        const { data, error } = await supabaseAdmin.from('Role').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            name: r.name,
            code: r.code,
            description: r.description || '',
            permissions: [],
          })) as any;
        }
        return localDb.roles as any;
      }

      case 'reviews': {
        const { data, error } = await supabaseAdmin.from('Review').select('*, product:Product(name)').order('createdAt', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            productId: r.productId,
            productName: r.product?.name || 'Sản phẩm',
            authorName: r.authorName,
            phone: r.phone || undefined,
            rating: r.rating || 5,
            comment: r.comment,
            status: r.status,
            statusText: r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'REJECTED' ? 'Đã từ chối' : 'Chờ duyệt',
            reply: r.reply || undefined,
            createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '',
          })) as any;
        }
        return localDb.reviews as any;
      }

      case 'notifications': {
        const { data, error } = await supabaseAdmin.from('Notification').select('*').order('createdAt', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) return data as any;
        return localDb.notifications as any;
      }

      case 'activities': {
        const { data, error } = await supabaseAdmin.from('ActivityLog').select('*').order('createdAt', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) return data as any;
        return localDb.activities as any;
      }

      case 'brands': {
        const { data, error } = await supabaseAdmin.from('Brand').select('name').order('name');
        if (error) throw error;
        if (data && data.length > 0) return data.map((b: any) => b.name) as any;
        return localDb.brands as any;
      }

      default:
        return (localDb as any)[slice];
    }
  } catch (err) {
    console.warn(`[adminDb] readAdminDbSlice(${String(slice)}) error, falling back to local:`, err);
    return (localDb as any)[slice];
  }
}

export async function readAdminDbAsync(): Promise<AdminDatabaseState> {
  await ensureSeedData();
  const localDb = getLocalFallbackDb();

  const [
    categories,
    products,
    settings,
    orders,
    customers,
    coupons,
    promotions,
    suppliers,
    warehouses,
    variants,
    stocks,
    stockMovements,
    users,
    roles,
    reviews,
    notifications,
    activities,
    brands,
  ] = await Promise.all([
    readAdminDbSlice('categories'),
    readAdminDbSlice('products'),
    readAdminDbSlice('settings'),
    readAdminDbSlice('orders'),
    readAdminDbSlice('customers'),
    readAdminDbSlice('coupons'),
    readAdminDbSlice('promotions'),
    readAdminDbSlice('suppliers'),
    readAdminDbSlice('warehouses'),
    readAdminDbSlice('variants'),
    readAdminDbSlice('stocks'),
    readAdminDbSlice('stockMovements'),
    readAdminDbSlice('users'),
    readAdminDbSlice('roles'),
    readAdminDbSlice('reviews'),
    readAdminDbSlice('notifications'),
    readAdminDbSlice('activities'),
    readAdminDbSlice('brands'),
  ]);

  const state: AdminDatabaseState = {
    users,
    roles,
    warehouses,
    suppliers,
    products,
    variants,
    stocks,
    stockMovements,
    importVouchers: localDb.importVouchers || [],
    exportVouchers: localDb.exportVouchers || [],
    transferVouchers: localDb.transferVouchers || [],
    adjustments: localDb.adjustments || [],
    returns: localDb.returns || [],
    customers,
    coupons,
    promotions,
    shippingZones: localDb.shippingZones || [],
    reviews,
    notifications,
    activities,
    settings,
    categories,
    brands,
    orders,
  };

  memoryCache = state;
  return state;
}

let memoryCache: AdminDatabaseState | null = null;

export function readAdminDb(): AdminDatabaseState & PromiseLike<AdminDatabaseState> {
  const syncFallback = memoryCache || getLocalFallbackDb();

  const promise = (async () => {
    try {
      return await readAdminDbAsync();
    } catch (err) {
      console.warn('[adminDb] Fallback to local database:', err);
      return syncFallback;
    }
  })();

  return Object.assign(syncFallback, {
    then(
      onfulfilled?: ((value: AdminDatabaseState) => any) | null,
      onrejected?: ((reason: any) => any) | null
    ) {
      return promise.then(onfulfilled, onrejected);
    },
  });
}

export function writeAdminDb(data: AdminDatabaseState): void {
  memoryCache = data;
  ensureDir();
  try {
    let existing = {};
    if (fs.existsSync(DB_PATH)) {
      try {
        existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      } catch (e) {}
    }
    const merged = { ...existing, ...data };
    fs.writeFileSync(DB_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing admin database backup to disk:', err);
  }
}

export async function writeAdminDbAsync(data: AdminDatabaseState): Promise<void> {
  writeAdminDb(data);
}

// -------------------------------------------------------------
// GRANULAR CRUD HELPERS (PERSIST DIRECTLY TO SUPABASE VIA supabaseAdmin)
// -------------------------------------------------------------

export async function createCategory(payload: any) {
  const title = payload.name || payload.title;
  if (!title || !title.trim()) {
    throw new Error('Tên danh mục không được để trống');
  }

  const catName = title.trim();
  const catSlug =
    payload.slug?.trim() ||
    catName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  const catId = payload.id || `cat-${Date.now().toString(36)}`;
  const parentId = payload.parentId && payload.parentId !== 'none' ? payload.parentId : null;

  const { data, error } = await supabaseAdmin
    .from('Category')
    .insert({
      id: catId,
      name: catName,
      nameVi: payload.nameVi || catName,
      slug: catSlug,
      description: payload.description || null,
      image: payload.image || null,
      parentId,
      sortOrder: Number(payload.sortOrder || 0),
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
      partnerSource: payload.partnerSource || 'local',
      partnerId: payload.partnerId || null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapCategoryRow(data);
}

export async function updateCategory(id: string, updates: any) {
  if (!id) throw new Error('Thiếu ID danh mục cần cập nhật');

  const patch: Record<string, any> = {};
  if (updates.name || updates.title) {
    patch.name = (updates.name || updates.title).trim();
    patch.nameVi = updates.nameVi || patch.name;
  }
  if (updates.slug) patch.slug = updates.slug.trim();
  if (updates.description !== undefined) patch.description = updates.description;
  if (updates.image !== undefined) patch.image = updates.image;
  if (updates.parentId !== undefined) {
    patch.parentId = updates.parentId === 'none' ? null : updates.parentId;
  }
  if (updates.sortOrder !== undefined) patch.sortOrder = Number(updates.sortOrder);
  if (updates.isActive !== undefined) patch.isActive = Boolean(updates.isActive);

  const { data, error } = await supabaseAdmin
    .from('Category')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapCategoryRow(data);
}

export async function deleteCategory(id: string) {
  if (!id) throw new Error('Thiếu ID danh mục cần xóa');

  const { count: productCount, error: countErr } = await supabaseAdmin
    .from('Product')
    .select('*', { count: 'exact', head: true })
    .eq('categoryId', id);

  if (productCount && productCount > 0) {
    throw new Error(
      `Không thể xóa danh mục đang có ${productCount} sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.`
    );
  }

  const { error } = await supabaseAdmin.from('Category').delete().eq('id', id);
  if (error) throw error;
  return { success: true, message: 'Đã xóa danh mục thành công' };
}

export async function updateProductPricing(
  id: string,
  customPrice?: number | null,
  markupPercent?: number,
  status?: string
) {
  if (!id) throw new Error('Thiếu ID sản phẩm cần điều chỉnh giá');

  const patch: Record<string, any> = {};
  if (customPrice !== undefined) {
    patch.customPrice = customPrice === null || (customPrice as any) === '' ? null : Number(customPrice);
    if (patch.customPrice !== null) {
      patch.retailPrice = patch.customPrice;
    }
  }
  if (markupPercent !== undefined) {
    patch.markupPercent = Number(markupPercent);
  }
  if (status !== undefined) {
    patch.status = status;
  }

  const { data, error } = await supabaseAdmin
    .from('Product')
    .update(patch)
    .eq('id', id)
    .select('*, category:Category(name, slug), brand:Brand(name, slug)')
    .single();

  if (error) throw error;
  return mapProductRow(data);
}

export async function createProduct(payload: any) {
  const title = payload.name || payload.title;
  if (!title) throw new Error('Tên sản phẩm không được để trống');

  const prodId = payload.id || `sp-${Date.now().toString(36)}`;
  const slug =
    payload.slug?.trim() ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  let categoryId = payload.categoryId;
  if (!categoryId) {
    const catQuery = payload.category || payload.categorySlug;
    if (catQuery) {
      const { data: foundCat } = await supabaseAdmin
        .from('Category')
        .select('id')
        .or(`name.ilike.%${catQuery}%,slug.eq.${catQuery}`)
        .limit(1)
        .maybeSingle();
      if (foundCat) categoryId = foundCat.id;
    }
    if (!categoryId) {
      const { data: firstCat } = await supabaseAdmin.from('Category').select('id').limit(1).single();
      categoryId = firstCat ? firstCat.id : '1';
    }
  }

  let brandId = payload.brandId || null;
  if (!brandId && payload.brand) {
    const { data: foundBrand } = await supabaseAdmin
      .from('Brand')
      .select('id')
      .ilike('name', `%${payload.brand}%`)
      .limit(1)
      .maybeSingle();
    if (foundBrand) brandId = foundBrand.id;
  }

  const costPrice = Number(payload.costPrice || payload.partnerPrice || Math.round((payload.price || 0) * 0.72));
  const retailPrice = Number(payload.price || payload.retailPrice || 0);
  const markup = Number(payload.markupPercent || 20);
  const customPrice = payload.customPrice !== undefined ? (payload.customPrice === null ? null : Number(payload.customPrice)) : null;

  const { data, error } = await supabaseAdmin
    .from('Product')
    .insert({
      id: prodId,
      name: title,
      slug,
      sku: payload.sku || `BS-${prodId.toUpperCase()}-STD`,
      barcode: payload.barcode || null,
      categoryId,
      brandId,
      thumbnail: payload.image || (payload.images && payload.images[0]) || null,
      costPrice,
      retailPrice: customPrice !== null ? customPrice : retailPrice,
      customPrice,
      markupPercent: markup,
      salePrice: payload.originalPrice ? Number(payload.originalPrice) : null,
      partnerStock: Number(payload.stock || payload.quantity || 50),
      status: payload.status || 'ACTIVE',
      description: payload.description || '',
      featuresJson: payload.features ? JSON.stringify(payload.features) : null,
      specsJson: payload.specs ? JSON.stringify(payload.specs) : null,
      badge: payload.badge || null,
      partnerSource: payload.partnerSource || 'local',
      partnerId: payload.partnerId || null,
    })
    .select('*, category:Category(name, slug), brand:Brand(name, slug)')
    .single();

  if (error) throw error;

  const vId = `var-${prodId}-1`;
  await supabaseAdmin.from('ProductVariant').upsert(
    {
      id: vId,
      productId: prodId,
      name: `${title} - Bản Tiêu Chuẩn`,
      sku: payload.sku || `BS-${prodId.toUpperCase()}-STD`,
      barcode: payload.barcode || null,
      costPrice,
      retailPrice,
    },
    { onConflict: 'id' }
  );

  await supabaseAdmin.from('Stock').upsert(
    {
      id: `stock-${prodId}-wh-01`,
      variantId: vId,
      warehouseId: 'wh-01',
      quantity: Number(payload.stock || payload.quantity || 50),
      reserved: 0,
      available: Number(payload.stock || payload.quantity || 50),
    },
    { onConflict: 'id' }
  );

  return mapProductRow(data);
}

export async function updateProduct(id: string, updates: any) {
  if (!id) throw new Error('Thiếu ID sản phẩm cần cập nhật');

  const patch: Record<string, any> = {};
  if (updates.name || updates.title) patch.name = updates.name || updates.title;
  if (updates.slug) patch.slug = updates.slug;
  if (updates.sku) patch.sku = updates.sku;
  if (updates.barcode !== undefined) patch.barcode = updates.barcode;
  if (updates.price !== undefined) patch.retailPrice = Number(updates.price);
  if (updates.retailPrice !== undefined) patch.retailPrice = Number(updates.retailPrice);
  if (updates.costPrice !== undefined) patch.costPrice = Number(updates.costPrice);
  if (updates.customPrice !== undefined) {
    patch.customPrice = updates.customPrice === null ? null : Number(updates.customPrice);
    if (patch.customPrice !== null) patch.retailPrice = patch.customPrice;
  }
  if (updates.markupPercent !== undefined) patch.markupPercent = Number(updates.markupPercent);
  if (updates.image || (updates.images && updates.images[0])) {
    patch.thumbnail = updates.image || updates.images[0];
  }
  if (updates.status !== undefined) patch.status = updates.status;
  if (updates.stock !== undefined || updates.quantity !== undefined) {
    patch.partnerStock = Number(updates.stock !== undefined ? updates.stock : updates.quantity);
  }
  if (updates.description !== undefined) patch.description = updates.description;
  if (updates.features) patch.featuresJson = JSON.stringify(updates.features);
  if (updates.specs) patch.specsJson = JSON.stringify(updates.specs);
  if (updates.badge !== undefined) patch.badge = updates.badge;

  const { data, error } = await supabaseAdmin
    .from('Product')
    .update(patch)
    .eq('id', id)
    .select('*, category:Category(name, slug), brand:Brand(name, slug)')
    .single();

  if (error) throw error;
  return mapProductRow(data);
}

export async function deleteProduct(id: string) {
  if (!id) throw new Error('Thiếu ID sản phẩm cần xóa');
  const { error } = await supabaseAdmin.from('Product').delete().eq('id', id);
  if (error) throw error;
  return { success: true, message: 'Đã xóa sản phẩm thành công' };
}

export async function createOrder(payload: any) {
  const id = payload.id || `ord-${Date.now().toString(36)}`;
  const code = payload.code || `BS2611-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const { data: order, error: orderErr } = await supabaseAdmin
    .from('Order')
    .insert({
      id,
      code,
      orderType: payload.orderType || 'ONLINE',
      customerName: payload.customerName || 'Khách Vãng Lai',
      customerPhone: payload.phone || payload.customerPhone || '0900000000',
      customerEmail: payload.email || payload.customerEmail || null,
      shippingAddress: payload.address || payload.shippingAddress || 'Hà Nội',
      province: payload.province || null,
      district: payload.district || null,
      note: payload.note || null,
      subtotal: Number(payload.totalAmount || payload.subtotal || 0),
      shippingFee: Number(payload.shippingFee || 0),
      finalTotal: Number(payload.finalTotal || payload.totalAmount || 0),
      status: payload.status || 'PENDING',
      paymentMethod: payload.paymentMethod || 'COD',
      paymentStatus: payload.paymentStatus || 'UNPAID',
    })
    .select()
    .single();

  if (orderErr) throw orderErr;

  if (payload.items && payload.items.length > 0) {
    const itemsPayload = payload.items.map((it: any, index: number) => ({
      id: `item-${id}-${index + 1}`,
      orderId: id,
      variantId: it.variantId || 'var-default',
      title: it.title,
      price: Number(it.price),
      quantity: Number(it.quantity || 1),
      total: Number(it.price) * Number(it.quantity || 1),
    }));

    await supabaseAdmin.from('OrderItem').insert(itemsPayload);
  }

  return mapOrderRow(order);
}

export async function updateOrderStatus(id: string, status: string) {
  if (!id) throw new Error('Thiếu ID đơn hàng');
  const { data, error } = await supabaseAdmin
    .from('Order')
    .update({ status })
    .eq('id', id)
    .select('*, items:OrderItem(*)')
    .single();
  if (error) throw error;
  return mapOrderRow(data);
}

export async function createSupplier(payload: any) {
  const id = payload.id || `sup-${Date.now().toString(36)}`;
  const code = payload.code || `NCC-${Date.now().toString().slice(-4)}`;
  const { data, error } = await supabaseAdmin
    .from('Supplier')
    .insert({
      id,
      code,
      name: payload.name,
      phone: payload.phone,
      email: payload.email || null,
      address: payload.address || null,
      taxCode: payload.taxCode || null,
      contactPerson: payload.contactPerson || null,
      totalImport: Number(payload.totalImport || 0),
      totalPaid: Number(payload.totalPaid || 0),
      balanceDue: Number(payload.balanceDue || 0),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createWarehouse(payload: any) {
  const id = payload.id || `wh-${Date.now().toString(36)}`;
  const code = payload.code || `KHO-${Date.now().toString().slice(-4)}`;
  const { data, error } = await supabaseAdmin
    .from('Warehouse')
    .insert({
      id,
      code,
      name: payload.name,
      address: payload.address,
      phone: payload.phone || null,
      managerName: payload.managerName || null,
      isDefault: Boolean(payload.isDefault),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createCustomer(payload: any) {
  const id = payload.id || `kh-${Date.now().toString(36)}`;
  const code = payload.code || `KH-${Date.now().toString().slice(-4)}`;
  const { data, error } = await supabaseAdmin
    .from('Customer')
    .insert({
      id,
      code,
      name: payload.name,
      phone: payload.phone,
      email: payload.email || null,
      rank: payload.rank || 'NEW',
      totalSpent: Number(payload.totalSpent || 0),
      orderCount: Number(payload.orderCount || 0),
      points: Number(payload.points || 0),
      debtAmount: Number(payload.debtAmount || 0),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createCoupon(payload: any) {
  const id = payload.id || `cp-${Date.now().toString(36)}`;
  const { data, error } = await supabaseAdmin
    .from('Coupon')
    .insert({
      id,
      code: payload.code.toUpperCase(),
      type: payload.type || 'PERCENT',
      value: Number(payload.value || 0),
      minOrder: Number(payload.minOrder || 0),
      maxDiscount: payload.maxDiscount ? Number(payload.maxDiscount) : null,
      usageLimit: payload.usageLimit ? Number(payload.usageLimit) : null,
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createPromotion(payload: any) {
  const id = payload.id || `promo-${Date.now().toString(36)}`;
  const { data, error } = await supabaseAdmin
    .from('Promotion')
    .insert({
      id,
      name: payload.name,
      type: payload.type || 'FLASH_SALE',
      discount: Number(payload.discount || 0),
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
      description: payload.description || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function approveReview(id: string) {
  const { data, error } = await supabaseAdmin
    .from('Review')
    .update({ status: 'APPROVED' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function replyReview(id: string, reply: string) {
  const { data, error } = await supabaseAdmin
    .from('Review')
    .update({ reply })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSettings(settings: Partial<SystemSetting> | Record<string, any>) {
  const entries = Object.entries(settings).map(([key, val]) => ({
    id: `set-${key}`,
    key,
    value: String(val),
    group: 'GENERAL',
    updatedAt: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from('Setting')
    .upsert(entries, { onConflict: 'key' });

  if (error) throw error;
  return settings;
}

export async function markNotificationRead(id: string) {
  const { data, error } = await supabaseAdmin
    .from('Notification')
    .update({ isRead: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
