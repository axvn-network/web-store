'use client';

import React from 'react';
import Link from 'next/link';
import { useCustomer } from '@/lib/customerContext';
import {
  FiShoppingBag,
  FiAward,
  FiTag,
  FiCreditCard,
  FiArrowRight,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShield,
} from 'react-icons/fi';

export default function TaiKhoanOverviewPage() {
  const { user } = useCustomer();

  return (
    <div className="space-y-6">
      {/* Top Banner with Welcome and Tier Progress */}
      <div className="bg-gradient-to-r from-[#f53d2d] via-[#ff5522] to-[#ff7744] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-orange-200">
                Thành viên BetaShop VIP
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Xin chào, {user?.name || 'Nguyễn Văn An'}!
              </h1>
              <p className="text-orange-100 text-sm mt-1">
                Chúc bạn một ngày mua sắm vui vẻ với nhiều ưu đãi đồ gia dụng chính hãng.
              </p>
            </div>
            <Link
              href="/tai-khoan/thong-tin"
              className="inline-flex items-center gap-2 self-start sm:self-auto bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-xl transition border border-white/20"
            >
              <span>Chỉnh sửa hồ sơ</span>
              <FiArrowRight />
            </Link>
          </div>

          {/* Tier Progress bar */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-orange-100">
                Hạng hiện tại: <strong className="text-white uppercase font-black">{user?.tier || 'GOLD'}</strong>
              </span>
              <span className="text-orange-100">
                Tiến độ lên <strong className="text-white uppercase font-black">KIM CƯƠNG</strong> (12.5M / 20M ₫)
              </span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-300 rounded-full w-[62.5%] transition-all duration-500" />
            </div>
            <p className="text-[11px] text-orange-100 mt-2">
              Chỉ cần mua sắm thêm <strong>7.500.000 ₫</strong> để đạt Hạng Kim Cương và nhận đặc quyền hoàn tiền 5% + miễn phí giao hàng trọn đời!
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-xl shrink-0">
            <FiCreditCard />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Tổng chi tiêu</span>
            <span className="text-base sm:text-lg font-black text-gray-900">
              {(user?.totalSpent || 12500000).toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <FiShoppingBag />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Đơn hàng</span>
            <span className="text-base sm:text-lg font-black text-gray-900">3 đơn</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FiAward />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Điểm thưởng</span>
            <span className="text-base sm:text-lg font-black text-gray-900">
              {(user?.points || 1250).toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <FiTag />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">Voucher</span>
            <span className="text-base sm:text-lg font-black text-gray-900">4 Mã còn hạn</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h2>
            <p className="text-xs text-gray-400 mt-0.5">Theo dõi trạng thái giao hàng các đơn hàng của bạn</p>
          </div>
          <Link
            href="/don-hang"
            className="text-xs font-bold text-[#f53d2d] hover:underline flex items-center gap-1 transition"
          >
            <span>Xem tất cả</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="space-y-4">
          {/* Order Item 1 */}
          <div className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:border-orange-200 transition bg-gray-50/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">Mã đơn: #ORD-2026-9812</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">14/11/2026</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[11px]">
                <FiTruck className="text-xs" />
                <span>Đang vận chuyển</span>
              </span>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=120&q=80"
                  alt="Nồi chiên không dầu"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Nồi chiên không dầu Philips Rapid Air HD9252/90 4.1L
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">Số lượng: 01 • Màu Đen bóng</p>
                </div>
              </div>
              <div className="text-right sm:border-l sm:pl-6 border-gray-200">
                <span className="text-xs text-gray-400 block">Thành tiền</span>
                <span className="text-base font-extrabold text-[#f53d2d]">2.490.000 ₫</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
              <span className="text-gray-500">Đơn vị vận chuyển: GHN Express (Mã vận đơn: GHN8829103)</span>
              <Link
                href="/don-hang/ORD-2026-9812"
                className="font-bold text-[#f53d2d] hover:underline"
              >
                Tra cứu lộ trình &rarr;
              </Link>
            </div>
          </div>

          {/* Order Item 2 */}
          <div className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:border-orange-200 transition bg-gray-50/50">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">Mã đơn: #ORD-2026-8741</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">02/11/2026</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
                <FiCheckCircle className="text-xs" />
                <span>Giao hàng thành công</span>
              </span>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=120&q=80"
                  alt="Robot hút bụi"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Robot hút bụi lau nhà Dreame L10s Ultra Gen 2
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">Số lượng: 01 • Bản Quốc Tế</p>
                </div>
              </div>
              <div className="text-right sm:border-l sm:pl-6 border-gray-200">
                <span className="text-xs text-gray-400 block">Thành tiền</span>
                <span className="text-base font-extrabold text-[#f53d2d]">10.010.000 ₫</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-medium">Đã nhận hàng và đánh giá 5 sao ★★★★★</span>
              <Link
                href="/don-hang/ORD-2026-8741"
                className="font-bold text-[#f53d2d] hover:underline"
              >
                Xem chi tiết &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/tai-khoan/dia-chi"
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f53d2d] flex items-center justify-center text-lg group-hover:scale-110 transition">
            <FiMapPin />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Sổ địa chỉ nhận hàng</h4>
            <p className="text-xs text-gray-400">Quản lý nơi nhận hàng nhanh</p>
          </div>
        </Link>

        <Link
          href="/tai-khoan/bao-mat"
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition">
            <FiShield />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Bảo mật tài khoản 2FA</h4>
            <p className="text-xs text-gray-400">Bảo vệ thông tin cá nhân</p>
          </div>
        </Link>

        <Link
          href="/cong-tac-vien"
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f53d2d] flex items-center justify-center text-lg group-hover:scale-110 transition">
            <FiAward />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Cộng tác viên kiếm tiền</h4>
            <p className="text-xs text-gray-400">Nhận hoa hồng lên đến 10%</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
