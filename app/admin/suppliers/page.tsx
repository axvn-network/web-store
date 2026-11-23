'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Download,
  Phone,
  Mail,
  MapPin,
  FileText,
  Star,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { Supplier } from '@/lib/adminDb';
import { exportToExcel } from '@/lib/excelExport';

export default function SuppliersAdminPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New Supplier form
  const [form, setForm] = useState({
    name: '',
    code: '',
    phone: '',
    email: '',
    address: '',
    taxCode: '',
    contactPerson: '',
    note: '',
  });

  const fetchSuppliers = () => {
    fetch('/api/admin/data?slice=suppliers')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSuppliers(res.data);
        }
      });
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_supplier', payload: form }),
    });
    const result = await res.json();
    if (result.success) {
      setToast('Thêm nhà cung cấp mới thành công!');
      setShowAdd(false);
      setForm({
        name: '',
        code: '',
        phone: '',
        email: '',
        address: '',
        taxCode: '',
        contactPerson: '',
        note: '',
      });
      fetchSuppliers();
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.contactPerson?.toLowerCase().includes(search.toLowerCase())
  );

  const totalDebt = suppliers.reduce((sum, s) => sum + s.balanceDue, 0);

  const handleExport = () => {
    const data = filtered.map((s) => ({
      'Mã NCC': s.code,
      'Tên Nhà Cung Cấp': s.name,
      'Người Liên Hệ': s.contactPerson,
      'Số Điện Thoại': s.phone,
      Email: s.email,
      'Mã Số Thuế': s.taxCode,
      'Tổng Tiền Nhập': s.totalImport,
      'Đã Thanh Toán': s.totalPaid,
      'Công Nợ Còn Lại': s.balanceDue,
    }));
    exportToExcel(data, `Danh_Sach_Nha_Cung_Cap_Betashop_${Date.now()}`);
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
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Nhà Cung Cấp & Công Nợ Mua Hàng</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {suppliers.length} đối tác
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý danh sách đối tác sản xuất gia dụng, theo dõi lịch sử nhập hàng và quản lý công nợ.
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
            <span>Thêm Nhà Cung Cấp</span>
          </button>
        </div>
      </div>

      {/* Total Debt Metric Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Tổng Công Nợ Phải Trả Cho Nhà Cung Cấp
            </h4>
            <p className="text-lg font-black text-white mt-0.5">
              {formatVND(totalDebt)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên nhà cung cấp, mã đối tác, người liên hệ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Mã NCC</th>
                <th className="p-3">Tên Nhà Cung Cấp</th>
                <th className="p-3">Người Liên Hệ & SĐT</th>
                <th className="p-3">Mã Số Thuế</th>
                <th className="p-3 text-right">Tổng Nhập</th>
                <th className="p-3 text-right">Đã Trả</th>
                <th className="p-3 text-right">Công Nợ Còn Lại</th>
                <th className="p-3 text-center">Đánh Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    {s.code}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white text-xs">{s.name}</div>
                    <div className="text-[11px] text-slate-400">{s.address}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-200">{s.contactPerson}</div>
                    <div className="text-[11px] text-slate-400">{s.phone}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{s.taxCode || '—'}</td>
                  <td className="p-3 text-right text-slate-300 font-semibold">
                    {formatVND(s.totalImport)}
                  </td>
                  <td className="p-3 text-right text-emerald-400 font-semibold">
                    {formatVND(s.totalPaid)}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`font-black text-xs ${
                        s.balanceDue > 0 ? 'text-red-400' : 'text-slate-400'
                      }`}
                    >
                      {formatVND(s.balanceDue)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" /> {s.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Thêm Nhà Cung Cấp Gia Dụng Mới</h3>
            <form onSubmit={handleAddSupplier} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tên NCC <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Công ty CP Elmich..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mã NCC
                  </label>
                  <input
                    type="text"
                    placeholder="NCC-ELMICH"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Số điện thoại <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1900 6369 25"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Người liên hệ
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="b2b@supplier.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mã số thuế
                  </label>
                  <input
                    type="text"
                    placeholder="0105151525"
                    value={form.taxCode}
                    onChange={(e) => setForm({ ...form, taxCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  placeholder="Địa chỉ trụ sở / văn phòng..."
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
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
                  Lưu Nhà Cung Cấp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
