'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tags,
  Building2,
  Warehouse,
  Boxes,
  FileDown,
  FileUp,
  ArrowLeftRight,
  ClipboardCheck,
  History,
  ShoppingCart,
  Store,
  RotateCcw,
  Users,
  Ticket,
  Percent,
  Truck,
  Star,
  BarChart3,
  UserCog,
  ShieldCheck,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  Server,
  Network,
  Key,
  Cpu,
} from 'lucide-react';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: { title: string; href: string; badge?: string }[];
}

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'TỔNG QUAN',
    items: [
      { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      {
        title: 'Tự động hóa (Auto)',
        href: '/admin/automation',
        icon: Cpu,
        badge: '≥90%',
      },
    ],
  },
  {
    label: 'HÀNG HÓA & DANH MỤC',
    items: [
      {
        title: 'Sản phẩm',
        icon: Package,
        children: [
          { title: 'Tất cả sản phẩm', href: '/admin/products' },
          { title: 'Biến thể gia dụng', href: '/admin/products/variants' },
          { title: 'Thêm sản phẩm mới', href: '/admin/products/new' },
        ],
      },
      { title: 'Danh mục', href: '/admin/categories', icon: Layers },
      { title: 'Thương hiệu', href: '/admin/brands', icon: Tags },
      { title: 'Nhà cung cấp', href: '/admin/suppliers', icon: Building2 },
    ],
  },
  {
    label: 'DỊCH VỤ CÔNG NGHỆ & CLOUD',
    items: [
      {
        title: 'Nhà cung cấp & API',
        href: '/admin/providers',
        icon: Network,
        badge: 'Aggregator',
      },
      {
        title: 'Kho Key & Account',
        href: '/admin/stock',
        icon: Key,
        badge: 'AES-256',
      },
      {
        title: 'Cloud & VPS (XVPS)',
        href: '/admin/cloud-services',
        icon: Server,
        badge: 'VIP 1',
      },
    ],
  },
  {
    label: 'QUẢN LÝ KHO (TRỌNG TÂM)',
    items: [
      { title: 'Chi nhánh & Kho', href: '/admin/warehouses', icon: Warehouse },
      {
        title: 'Kho vận & Tồn kho',
        icon: Boxes,
        children: [
          { title: 'Tồn kho hiện tại', href: '/admin/inventory/stock' },
          { title: 'Phiếu nhập kho (NCC)', href: '/admin/inventory/imports' },
          { title: 'Phiếu xuất kho', href: '/admin/inventory/exports' },
          { title: 'Chuyển kho nội bộ', href: '/admin/inventory/transfers' },
          { title: 'Điều chỉnh kiểm kê', href: '/admin/inventory/adjustments' },
          { title: 'Lịch sử biến động', href: '/admin/inventory/history' },
        ],
      },
    ],
  },
  {
    label: 'BÁN HÀNG & ĐƠN HÀNG',
    items: [
      {
        title: 'Bán tại quầy (POS)',
        href: '/admin/orders/pos',
        icon: Store,
        badge: 'HOT',
      },
      {
        title: 'Đơn hàng',
        icon: ShoppingCart,
        children: [
          { title: 'Tất cả đơn hàng', href: '/admin/orders' },
          { title: 'Đổi trả / Hoàn tiền', href: '/admin/orders/returns' },
        ],
      },
      { title: 'Khách hàng (CRM)', href: '/admin/customers', icon: Users },
    ],
  },
  {
    label: 'MARKETING & DỊCH VỤ',
    items: [
      { title: 'Mã giảm giá', href: '/admin/coupons', icon: Ticket },
      { title: 'Chương trình KM', href: '/admin/promotions', icon: Percent },
      { title: 'Vận chuyển', href: '/admin/shipping', icon: Truck },
      { title: 'Đánh giá & Bình luận', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    label: 'BÁO CÁO & THỐNG KÊ',
    items: [
      {
        title: 'Báo cáo',
        icon: BarChart3,
        children: [
          { title: 'Báo cáo doanh thu', href: '/admin/reports/revenue' },
          { title: 'Báo cáo tồn kho', href: '/admin/reports/inventory' },
          { title: 'Báo cáo sản phẩm', href: '/admin/reports/products' },
          { title: 'Báo cáo khách hàng', href: '/admin/reports/customers' },
        ],
      },
    ],
  },
  {
    label: 'HỆ THỐNG',
    items: [
      { title: 'Nhân viên', href: '/admin/staff', icon: UserCog },
      { title: 'Phân quyền (RBAC)', href: '/admin/roles', icon: ShieldCheck },
      { title: 'Cài đặt cửa hàng', href: '/admin/settings', icon: Settings },
      { title: 'Thông báo', href: '/admin/notifications', icon: Bell },
    ],
  },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Sản phẩm': true,
    'Kho vận & Tồn kho': true,
    'Đơn hàng': true,
    'Báo cáo': true,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-800 bg-slate-950/60">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md flex-shrink-0">
            B
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm tracking-wider text-white uppercase truncate">
                BETASHOP
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Tổng Kho Gia Dụng</span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition hidden lg:block"
          title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-2 space-y-4">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.label}
              </div>
            )}
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isChildActive =
                hasChildren && item.children?.some((c) => pathname === c.href);
              const isActive = item.href === pathname || isChildActive;
              const isOpen = openGroups[item.title] || isChildActive;

              if (hasChildren && !collapsed) {
                return (
                  <div key={iIdx} className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.title)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition ${
                        isChildActive
                          ? 'bg-slate-800/80 text-emerald-400'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isChildActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pl-6 space-y-0.5 border-l border-slate-800 ml-4 my-1">
                        {item.children?.map((sub, sIdx) => {
                          const subActive = pathname === sub.href;
                          return (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              className={`block px-2.5 py-1.5 rounded-md text-[11px] font-medium transition ${
                                subActive
                                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                              }`}
                            >
                              {sub.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={iIdx}
                  href={item.href || '#'}
                  title={collapsed ? item.title : undefined}
                  className={`flex items-center ${
                    collapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-2.5 py-2'
                  } rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Return Store */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/40">
        <Link
          href="/"
          target="_blank"
          title="Xem Website Bán Hàng"
          className={`flex items-center ${
            collapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
          } rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/70 transition`}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Xem Storefront</span>}
        </Link>
      </div>
    </aside>
  );
}
