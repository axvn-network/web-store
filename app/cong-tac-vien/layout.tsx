'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiGrid,
  FiLink,
  FiShoppingBag,
  FiPercent,
  FiDollarSign,
  FiFileText,
  FiUserPlus,
  FiChevronRight,
  FiAward,
} from 'react-icons/fi';

export default function CongTacVienLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/cong-tac-vien/tong-quan', label: 'Tổng quan KPI', icon: FiGrid },
    { href: '/cong-tac-vien/link-gioi-thieu', label: 'Link giới thiệu & QR', icon: FiLink },
    { href: '/cong-tac-vien/don-hang-gioi-thieu', label: 'Đơn hàng phát sinh', icon: FiShoppingBag },
    { href: '/cong-tac-vien/hoa-hong', label: 'Bảng kê hoa hồng', icon: FiPercent },
    { href: '/cong-tac-vien/rut-tien', label: 'Yêu cầu rút tiền', icon: FiDollarSign },
    { href: '/cong-tac-vien/tai-lieu-marketing', label: 'Tài liệu & Media', icon: FiFileText },
    { href: '/cong-tac-vien/dang-ky', label: 'Đăng ký CTV mới', icon: FiUserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#f53d2d] transition">
            Trang chủ
          </Link>
          <FiChevronRight className="text-gray-400" />
          <Link href="/tai-khoan" className="hover:text-[#f53d2d] transition">
            Tài khoản
          </Link>
          <FiChevronRight className="text-gray-400" />
          <span className="text-gray-800 font-semibold">Cộng tác viên (Affiliate)</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#f53d2d] via-[#ff5522] to-[#ff7744] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-300 border border-white/20 mb-2">
              <FiAward className="text-sm" />
              <span>Chương trình CTV Bán Hàng Gia Dụng 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Kênh Đối Tác & Cộng Tác Viên
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Quảng bá thiết bị gia dụng chính hãng BetaShop, nhận hoa hồng trọn đời lên đến <strong className="text-white">10%</strong> trên mỗi đơn hàng hoàn tất.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-white/15 backdrop-blur-md p-4 rounded-xl border border-white/20 self-start md:self-auto">
            <div>
              <span className="text-[11px] text-orange-100 block font-medium">Hoa hồng khả dụng:</span>
              <span className="text-2xl font-black text-yellow-300 tracking-tight">
                2.840.000 ₫
              </span>
            </div>
            <Link
              href="/cong-tac-vien/rut-tien"
              className="px-4 py-2.5 bg-white hover:bg-orange-50 text-[#f53d2d] font-bold rounded-xl text-xs shadow-sm transition active:scale-95"
            >
              Rút tiền ngay
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#f53d2d] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-[#f53d2d]'
                }`}
              >
                <Icon className={`text-base ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
