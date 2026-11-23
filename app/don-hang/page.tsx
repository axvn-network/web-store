'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiSearch,
  FiRotateCcw,
  FiChevronRight,
  FiStar,
  FiArrowLeft,
} from 'react-icons/fi';

interface OrderItem {
  id: string;
  code: string;
  date: string;
  status: 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  statusText: string;
  total: number;
  shippingUnit: string;
  trackingCode: string;
  items: {
    id: string;
    title: string;
    image: string;
    variant: string;
    quantity: number;
    price: number;
  }[];
}

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: 'ord-01',
    code: 'ORD-2026-9812',
    date: '14/11/2026',
    status: 'SHIPPING',
    statusText: 'Đang vận chuyển',
    total: 2490000,
    shippingUnit: 'Giao Hàng Nhanh (GHN)',
    trackingCode: 'GHN8829103',
    items: [
      {
        id: 'p-1',
        title: 'Nồi chiên không dầu Philips Rapid Air HD9252/90 4.1L',
        image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=150&q=80',
        variant: 'Màu Đen bóng • Công suất 1400W',
        quantity: 1,
        price: 2490000,
      },
    ],
  },
  {
    id: 'ord-02',
    code: 'ORD-2026-8741',
    date: '02/11/2026',
    status: 'COMPLETED',
    statusText: 'Giao hàng thành công',
    total: 10010000,
    shippingUnit: 'Viettel Post 247',
    trackingCode: 'VTP9930192',
    items: [
      {
        id: 'p-2',
        title: 'Robot hút bụi lau nhà Dreame L10s Ultra Gen 2 Tự giặt giẻ',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=150&q=80',
        variant: 'Bản Quốc Tế • Trắng Tinh Khôi',
        quantity: 1,
        price: 10010000,
      },
    ],
  },
  {
    id: 'ord-03',
    code: 'ORD-2026-7230',
    date: '18/10/2026',
    status: 'COMPLETED',
    statusText: 'Giao hàng thành công',
    total: 1250000,
    shippingUnit: 'Giao Hàng Tiết Kiệm (GHTK)',
    trackingCode: 'GHTK1928301',
    items: [
      {
        id: 'p-3',
        title: 'Máy sấy tóc ion âm Panasonic EH-NA45 công nghệ nanoe',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80',
        variant: 'Đỏ Ruby',
        quantity: 1,
        price: 1250000,
      },
    ],
  },
];

export default function DonHangListPage() {
  const [tab, setTab] = useState<'ALL' | 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED' | 'RETURNED'>('ALL');
  const [search, setSearch] = useState('');

  const filteredOrders = SAMPLE_ORDERS.filter((ord) => {
    if (tab !== 'ALL' && ord.status !== tab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCode = ord.code.toLowerCase().includes(q);
      const matchProduct = ord.items.some((it) => it.title.toLowerCase().includes(q));
      return matchCode || matchProduct;
    }
    return true;
  });

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">
            <FiTruck className="text-xs" />
            <span>Đang vận chuyển</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
            <FiCheckCircle className="text-xs" />
            <span>Giao thành công</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-xs">
            <FiXCircle className="text-xs" />
            <span>Đã hủy</span>
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold text-xs">
            <FiRotateCcw className="text-xs" />
            <span>Trả hàng/Hoàn tiền</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-xs">
            <FiClock className="text-xs" />
            <span>Chờ xác nhận</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#f53d2d] transition">
            Trang chủ
          </Link>
          <FiChevronRight />
          <Link href="/tai-khoan" className="hover:text-[#f53d2d] transition">
            Tài khoản
          </Link>
          <FiChevronRight />
          <span className="text-gray-800 font-medium">Đơn hàng của tôi</span>
        </div>

        {/* Header & Search */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Đơn hàng của tôi</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Xem lịch sử mua sắm, theo dõi tiến độ vận chuyển và gửi yêu cầu đổi trả
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã đơn hoặc sản phẩm..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d] text-xs"
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
            {[
              { key: 'ALL', label: 'Tất cả' },
              { key: 'PENDING', label: 'Chờ xác nhận' },
              { key: 'SHIPPING', label: 'Đang vận chuyển' },
              { key: 'COMPLETED', label: 'Đã hoàn thành' },
              { key: 'CANCELLED', label: 'Đã hủy' },
              { key: 'RETURNED', label: 'Trả hàng' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  tab === t.key
                    ? 'bg-[#f53d2d] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order Cards List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <FiShoppingBag className="text-5xl mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800">Không tìm thấy đơn hàng nào</h3>
              <p className="text-xs text-gray-400 mt-1 mb-6">
                Bạn chưa có đơn hàng nào trong trạng thái này hoặc tìm kiếm không khớp
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#f53d2d] hover:bg-[#e03122] text-white font-semibold rounded-xl text-xs shadow transition"
              >
                Khám phá sản phẩm ngay
              </Link>
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-orange-200 transition"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-extrabold text-gray-900 tracking-tight">#{ord.code}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">Ngày đặt: {ord.date}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">Vận chuyển: {ord.shippingUnit}</span>
                  </div>
                  {getStatusBadge(ord.status)}
                </div>

                {/* Products */}
                <div className="divide-y divide-gray-100">
                  {ord.items.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 leading-snug">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                          <span className="text-xs text-gray-400 mt-1 block">x{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-[#f53d2d]">
                          {item.price.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer & Actions */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-gray-400">Tổng thanh toán: </span>
                    <span className="text-lg font-black text-[#f53d2d]">
                      {ord.total.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                      href={`/don-hang/${ord.code}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      Chi tiết đơn
                    </Link>

                    {ord.status === 'COMPLETED' && (
                      <>
                        <Link
                          href={`/don-hang/${ord.code}/tra-hang`}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
                        >
                          Yêu cầu trả hàng
                        </Link>
                        <Link
                          href="/danh-gia"
                          className="px-4 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition flex items-center gap-1.5"
                        >
                          <FiStar className="text-amber-500" />
                          <span>Đánh giá</span>
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => alert(`Đã thêm lại sản phẩm trong đơn #${ord.code} vào giỏ hàng!`)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#f53d2d] hover:bg-[#e03122] shadow-sm shadow-[#f53d2d]/20 transition"
                    >
                      Mua lại
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
