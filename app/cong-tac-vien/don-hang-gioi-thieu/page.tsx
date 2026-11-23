'use client';

import React, { useState } from 'react';
import {
  FiShoppingBag,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiFilter,
} from 'react-icons/fi';

export default function DonHangGioiThieuPage() {
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'PAID'>('ALL');
  const [search, setSearch] = useState('');

  const orders = [
    { id: '1', code: '#ORD-2026-9812', customer: 'Nguyễn T*** (Hà Nội)', product: 'Nồi chiên không dầu Philips HD9252 4.1L', total: 2490000, rate: '7%', commission: 174300, status: 'APPROVED', statusText: 'Đã duyệt hoa hồng', date: '14/11/2026' },
    { id: '2', code: '#ORD-2026-9705', customer: 'Trần V*** (TP.HCM)', product: 'Robot hút bụi Dreame L10s Ultra Gen 2', total: 10010000, rate: '7%', commission: 700700, status: 'APPROVED', statusText: 'Đã duyệt hoa hồng', date: '11/11/2026' },
    { id: '3', code: '#ORD-2026-9540', customer: 'Lê H*** (Đà Nẵng)', product: 'Máy lọc không khí Xiaomi 4 Pro', total: 4690000, rate: '7%', commission: 328300, status: 'PAID', statusText: 'Đã thanh toán', date: '07/11/2026' },
    { id: '4', code: '#ORD-2026-9411', customer: 'Vũ T*** (Hải Phòng)', product: 'Bàn là hơi nước đứng Tefal IT3440', total: 1850000, rate: '7%', commission: 129500, status: 'PENDING', statusText: 'Chờ giao hàng', date: '05/11/2026' },
    { id: '5', code: '#ORD-2026-9288', customer: 'Đỗ M*** (Bình Dương)', product: 'Máy sấy tóc ion âm Panasonic EH-NA45', total: 1250000, rate: '7%', commission: 87500, status: 'PAID', statusText: 'Đã thanh toán', date: '28/10/2026' },
  ];

  const filtered = orders.filter((o) => {
    if (filter !== 'ALL' && o.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.code.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Đơn hàng phát sinh từ mã của bạn</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Dữ liệu được cập nhật theo thời gian thực mỗi khi có khách hàng click và đặt hàng
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, khách..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'ALL', label: 'Tất cả đơn' },
          { key: 'APPROVED', label: 'Đã duyệt' },
          { key: 'PENDING', label: 'Chờ đối soát' },
          { key: 'PAID', label: 'Đã thanh toán' },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === f.key
                ? 'bg-[#f53d2d] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Mã đơn hàng</th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Sản phẩm</th>
              <th className="py-3 px-4">Giá trị đơn</th>
              <th className="py-3 px-4">Mức hoa hồng</th>
              <th className="py-3 px-4">Tiền hoa hồng</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/50 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{o.code}</td>
                <td className="py-3.5 px-4 text-gray-600">{o.customer}</td>
                <td className="py-3.5 px-4 font-medium text-gray-900 max-w-[220px] truncate">{o.product}</td>
                <td className="py-3.5 px-4 font-semibold text-gray-800">{o.total.toLocaleString('vi-VN')} ₫</td>
                <td className="py-3.5 px-4 font-bold text-[#f53d2d]">{o.rate}</td>
                <td className="py-3.5 px-4 font-black text-emerald-600">+{o.commission.toLocaleString('vi-VN')} ₫</td>
                <td className="py-3.5 px-4">
                  {o.status === 'APPROVED' ? (
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                      {o.statusText}
                    </span>
                  ) : o.status === 'PAID' ? (
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full text-[10px]">
                      {o.statusText}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                      {o.statusText}
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-gray-400">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
