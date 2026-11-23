'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  Download,
  Phone,
  Mail,
  MapPin,
  Award,
  DollarSign,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { Customer } from '@/lib/adminDb';
import { exportToExcel } from '@/lib/excelExport';

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [rankFilter, setRankFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const fetchCustomers = () => {
    fetch('/api/admin/data?slice=customers')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setCustomers(res.data);
        }
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_customer',
        payload: { name, phone, email, address },
      }),
    });
    const result = await res.json();
    if (result.success) {
      setToast('Thêm khách hàng thành công!');
      setShowAdd(false);
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      fetchCustomers();
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchRank = rankFilter === 'all' || c.rank === rankFilter;
    return matchSearch && matchRank;
  });

  const handleExport = () => {
    const data = filtered.map((c) => ({
      'Mã Khách': c.code,
      'Họ Và Tên': c.name,
      'Số Điện Thoại': c.phone,
      Email: c.email || '—',
      'Hạng Thành Viên': c.rankText,
      'Tổng Chi Tiêu': c.totalSpent,
      'Số Đơn Hàng': c.orderCount,
      'Điểm Tích Lũy': c.points,
      'Địa Chỉ': c.address,
    }));
    exportToExcel(data, `Danh_Sach_Khach_Hang_Betashop_${Date.now()}`);
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Quản Lý Khách Hàng (CRM)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} khách hàng
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Phân hạng khách hàng (VIP, Thân thiết, Khách mới), lịch sử chi tiêu, tích điểm và công nợ mua hàng.
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
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khách Hàng</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên khách, số điện thoại, mã KH..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tất cả hạng thành viên</option>
              <option value="VIP">Khách Hàng VIP</option>
              <option value="REGULAR">Khách Hàng Thân Thiết</option>
              <option value="NEW">Khách Hàng Mới</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Mã KH</th>
                <th className="p-3">Họ Tên Khách Hàng</th>
                <th className="p-3">Số Điện Thoại</th>
                <th className="p-3">Hạng Thành Viên</th>
                <th className="p-3 text-right">Tổng Chi Tiêu</th>
                <th className="p-3 text-center">Số Đơn</th>
                <th className="p-3 text-center">Điểm Thưởng</th>
                <th className="p-3">Địa Chỉ Giao Hàng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-400">{c.code}</td>
                  <td className="p-3 font-bold text-white">{c.name}</td>
                  <td className="p-3 font-semibold text-slate-300">{c.phone}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.rank === 'VIP'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : c.rank === 'REGULAR'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c.rankText}
                    </span>
                  </td>
                  <td className="p-3 text-right font-black text-white">
                    {formatVND(c.totalSpent)}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-300">{c.orderCount}</td>
                  <td className="p-3 text-center font-bold text-amber-400">{c.points} đ</td>
                  <td className="p-3 text-slate-400 max-w-xs truncate">{c.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Thêm Khách Hàng Mới</span>
            </h3>

            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Họ và tên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Số điện thoại <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="0988 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Địa chỉ giao hàng
                </label>
                <input
                  type="text"
                  placeholder="Số nhà, đường, phường, quận..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Lưu Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
