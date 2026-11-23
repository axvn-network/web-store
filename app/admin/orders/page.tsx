'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Eye,
  Store,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { exportToExcel } from '@/lib/excelExport';

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch('/api/admin/data?slice=orders')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string, statusText: string) => {
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_order_status',
        payload: { orderId, status, statusText },
      }),
    });
    const result = await res.json();
    if (result.success) {
      fetchOrders();
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);

    const matchTab =
      activeTab === 'ALL' ||
      (activeTab === 'PENDING' && o.status === 'PENDING') ||
      (activeTab === 'SHIPPING' && o.status === 'SHIPPING') ||
      (activeTab === 'COMPLETED' && o.status === 'COMPLETED') ||
      (activeTab === 'CANCELLED' && (o.status === 'CANCELLED' || o.status === 'CANCELED')) ||
      (activeTab === 'POS' && o.orderType === 'POS');

    return matchSearch && matchTab;
  });

  const handleExport = () => {
    const data = filtered.map((o) => ({
      'Mã Đơn': o.code,
      'Kênh Bán': o.orderType === 'POS' ? 'Bán tại quầy' : 'Online',
      'Khách Hàng': o.customerName,
      'Số Điện Thoại': o.phone,
      'Địa Chỉ': o.address,
      'Tổng Tiền': o.finalTotal || o.totalAmount,
      'Thanh Toán': o.paymentMethod,
      'Trạng Thái': o.statusText || o.status,
      'Ngày Đặt': o.createdAt,
    }));
    exportToExcel(data, `Danh_Sach_Don_Hang_Betashop_${Date.now()}`);
  };

  const tabs = [
    { id: 'ALL', label: 'Tất Cả Đơn', count: orders.length },
    { id: 'PENDING', label: 'Chờ Xác Nhận', count: orders.filter((o) => o.status === 'PENDING').length },
    { id: 'SHIPPING', label: 'Đang Giao Hàng', count: orders.filter((o) => o.status === 'SHIPPING').length },
    { id: 'COMPLETED', label: 'Đã Hoàn Thành', count: orders.filter((o) => o.status === 'COMPLETED').length },
    { id: 'POS', label: 'Bán Tại Quầy (POS)', count: orders.filter((o) => o.orderType === 'POS').length },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <span>Quản Lý Đơn Hàng Đa Kênh (Online & POS)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} đơn
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Xử lý quy trình đơn hàng: Chờ xác nhận &rarr; Đóng gói &rarr; Xuất kho &rarr; Đang giao &rarr; Hoàn tất.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
          <Link
            href="/admin/orders/pos"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
          >
            <Store className="w-4 h-4" />
            <span>Mở Bán Hàng POS</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{t.label}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hàng, tên khách hàng, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Mã Đơn</th>
                <th className="p-3">Kênh</th>
                <th className="p-3">Khách Hàng</th>
                <th className="p-3">Sản Phẩm Đặt</th>
                <th className="p-3 text-right">Tổng Tiền</th>
                <th className="p-3">Thanh Toán</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                      #{o.code}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        o.orderType === 'POS'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {o.orderType === 'POS' ? 'POS' : 'ONLINE'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{o.customerName}</div>
                    <div className="text-[11px] text-slate-400">{o.phone}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-300 max-w-xs truncate">
                      {o.items?.[0]?.title || 'Sản phẩm gia dụng'}
                    </div>
                    {o.items?.length > 1 && (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        + {o.items.length - 1} sản phẩm khác
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right font-black text-white text-xs">
                    {formatVND(o.finalTotal || o.totalAmount)}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-300">{o.paymentMethod}</span>
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => {
                        const s = e.target.value;
                        const texts: Record<string, string> = {
                          PENDING: 'Chờ xác nhận',
                          CONFIRMED: 'Đã xác nhận',
                          PACKING: 'Đang đóng gói',
                          SHIPPING: 'Đang giao hàng',
                          COMPLETED: 'Đã hoàn thành',
                          CANCELLED: 'Đã hủy',
                        };
                        handleUpdateStatus(o.id, s, texts[s] || s);
                      }}
                      className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-[11px] font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="PACKING">Đang đóng gói</option>
                      <option value="SHIPPING">Đang giao hàng</option>
                      <option value="COMPLETED">Đã hoàn thành</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                  </td>
                  <td className="p-3 text-slate-400">{o.createdAt}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white inline-flex items-center gap-1 font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
