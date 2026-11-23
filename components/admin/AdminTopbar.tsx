'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Store,
  Warehouse,
  ChevronDown,
  User,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { AdminNotification } from '@/lib/adminDb';

const PATH_TITLES: Record<string, string> = {
  '/admin': 'Bảng Điều Khiển Tổng Quan',
  '/admin/dashboard': 'Bảng Điều Khiển Tổng Quan',
  '/admin/products': 'Quản Lý Sản Phẩm Gia Dụng',
  '/admin/products/variants': 'Quản Lý Biến Thể Gia Dụng',
  '/admin/products/new': 'Thêm Sản Phẩm Mới',
  '/admin/categories': 'Danh Mục Hàng Hóa',
  '/admin/brands': 'Thương Hiệu & Xuất Xứ',
  '/admin/suppliers': 'Nhà Cung Cấp & Công Nợ',
  '/admin/warehouses': 'Hệ Thống Kho & Chi Nhánh',
  '/admin/inventory/stock': 'Tồn Kho Thực Tế & Định Mức',
  '/admin/inventory/imports': 'Phiếu Nhập Kho (NCC)',
  '/admin/inventory/exports': 'Phiếu Xuất Kho',
  '/admin/inventory/transfers': 'Chuyển Kho Nội Bộ',
  '/admin/inventory/adjustments': 'Điều Chỉnh Kiểm Kê Kho',
  '/admin/inventory/history': 'Lịch Sử Biến Động Tồn Kho',
  '/admin/orders': 'Quản Lý Đơn Hàng',
  '/admin/orders/pos': 'Màn Hình Bán Hàng Tại Quầy (POS)',
  '/admin/orders/returns': 'Đổi Trả Hàng & Hoàn Tiền',
  '/admin/customers': 'Khách Hàng & CRM',
  '/admin/coupons': 'Mã Giảm Giá & Voucher',
  '/admin/promotions': 'Chương Trình Khuyến Mãi',
  '/admin/shipping': 'Cấu Hình Vận Chuyển',
  '/admin/reviews': 'Duyệt Đánh Giá Khách Hàng',
  '/admin/reports/revenue': 'Báo Cáo Doanh Thu & Lợi Nhuận',
  '/admin/reports/inventory': 'Báo Cáo Giá Trị Tồn Kho',
  '/admin/reports/products': 'Báo Cáo Sản Phẩm Bán Chạy',
  '/admin/reports/customers': 'Báo Cáo Khách Hàng',
  '/admin/staff': 'Quản Lý Nhân Viên',
  '/admin/roles': 'Phân Quyền Vai Trò (RBAC)',
  '/admin/settings': 'Cài Đặt Hệ Thống',
  '/admin/notifications': 'Trung Tâm Thông Báo',
};

export default function AdminTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('wh-01');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    fetch('/api/admin/data?slice=notifications')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const currentTitle = PATH_TITLES[pathname] || 'Trang Quản Trị';

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 text-slate-200 px-3 sm:px-4 flex items-center justify-between z-20 flex-shrink-0">
      {/* Left: Mobile hamburger & Breadcrumb title */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
          <span className="hidden sm:inline text-slate-500 font-normal">Admin /</span>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right widgets */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Warehouse Selector */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
          <Warehouse className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-transparent border-none text-xs font-semibold text-white focus:outline-none focus:ring-0 cursor-pointer pr-1"
          >
            <option value="wh-01" className="bg-slate-900 text-white">
              Kho Tổng Hà Nội - Mỹ Đình
            </option>
            <option value="wh-02" className="bg-slate-900 text-white">
              Kho Chi Nhánh TP.HCM - Tân Bình
            </option>
          </select>
        </div>

        {/* Quick POS Launch Button */}
        <Link
          href="/admin/orders/pos"
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bán Hàng POS</span>
          <span className="sm:hidden">POS</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white">Thông Báo Hệ Thống</span>
                <Link
                  href="/admin/notifications"
                  onClick={() => setShowNotifDropdown(false)}
                  className="text-emerald-400 hover:underline text-[11px]"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">Không có thông báo mới</div>
                ) : (
                  notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 transition hover:bg-slate-800/40 ${
                        !n.isRead ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {n.type === 'LOW_STOCK' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-200">{n.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {n.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-white">Super Admin</span>
              <span className="text-[10px] text-emerald-400">admin@example.com</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-bold text-white">Quản Trị Viên Cao Cấp</p>
                <p className="text-[11px] text-slate-400">Toàn quyền hệ thống</p>
              </div>
              <Link
                href="/admin/staff"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Hồ sơ & Tài khoản</span>
              </Link>
              <Link
                href="/"
                target="_blank"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Xem Website Bán Hàng</span>
              </Link>
              <div className="border-t border-slate-800 my-1"></div>
              <Link
                href="/dang-nhap"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
