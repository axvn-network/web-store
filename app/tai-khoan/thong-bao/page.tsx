'use client';

import React, { useState } from 'react';
import {
  FiBell,
  FiShoppingBag,
  FiTag,
  FiCheck,
  FiInfo,
  FiTrash2,
  FiCheckCircle,
} from 'react-icons/fi';

interface NotificationItem {
  id: string;
  category: 'ORDER' | 'PROMO' | 'SYSTEM';
  title: string;
  desc: string;
  time: string;
  read: boolean;
  link?: string;
}

export default function ThongBaoPage() {
  const [filter, setFilter] = useState<'ALL' | 'ORDER' | 'PROMO' | 'SYSTEM'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      category: 'ORDER',
      title: 'Đơn hàng #ORD-2026-9812 đang được giao',
      desc: 'Tài xế GHN Express đang trên đường giao kiện hàng "Nồi chiên không dầu Philips Rapid Air" đến bạn.',
      time: '10 phút trước',
      read: false,
      link: '/don-hang/ORD-2026-9812',
    },
    {
      id: 'notif-2',
      category: 'PROMO',
      title: 'Tặng bạn Voucher 50.000₫ mua sắm đồ gia dụng',
      desc: 'Mã giảm giá GIADUNG50K đã được cộng vào ví Voucher của bạn. Áp dụng cho đơn từ 500k.',
      time: 'Hôm qua lúc 14:20',
      read: false,
      link: '/vi-voucher',
    },
    {
      id: 'notif-3',
      category: 'SYSTEM',
      title: 'Cập nhật chính sách tích điểm thành viên 2026',
      desc: 'Từ tháng 11/2026, mỗi 100.000₫ chi tiêu bạn sẽ nhận được 10 điểm thưởng (tương đương 10.000₫ giảm trực tiếp).',
      time: '05/11/2026',
      read: true,
      link: '/diem-thuong',
    },
    {
      id: 'notif-4',
      category: 'ORDER',
      title: 'Giao hàng thành công đơn hàng #ORD-2026-8741',
      desc: 'Kiện hàng Robot hút bụi Dreame L10s đã được giao thành công. Hãy đánh giá để nhận 50 điểm thưởng!',
      time: '02/11/2026',
      read: true,
      link: '/don-hang/ORD-2026-8741',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filtered = notifications.filter(
    (n) => filter === 'ALL' || n.category === filter
  );

  const getIcon = (category: string) => {
    switch (category) {
      case 'ORDER':
        return <FiShoppingBag className="text-orange-600" />;
      case 'PROMO':
        return <FiTag className="text-amber-600" />;
      default:
        return <FiInfo className="text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Thông báo</h1>
          <p className="text-gray-500 text-sm mt-1">
            Cập nhật tình trạng đơn hàng, mã giảm giá và tin tức từ BetaShop
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <FiCheck />
          <span>Đánh dấu đã đọc tất cả</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tất cả thông báo
        </button>
        <button
          type="button"
          onClick={() => setFilter('ORDER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            filter === 'ORDER'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Cập nhật đơn hàng
        </button>
        <button
          type="button"
          onClick={() => setFilter('PROMO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            filter === 'PROMO'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Khuyến mãi & Voucher
        </button>
        <button
          type="button"
          onClick={() => setFilter('SYSTEM')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            filter === 'SYSTEM'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tin hệ thống
        </button>
      </div>

      {/* Notification List */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <FiBell className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>Không có thông báo nào trong danh mục này</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                !item.read
                  ? 'border-orange-200 bg-orange-50/30 hover:bg-orange-50/50'
                  : 'border-gray-100 bg-white hover:bg-gray-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  !item.read ? 'bg-orange-100' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {getIcon(item.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm tracking-tight truncate ${
                      !item.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
