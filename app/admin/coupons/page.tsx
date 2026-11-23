'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Search, CheckCircle2, Trash2 } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { Coupon } from '@/lib/adminDb';

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(500000);
  const [usageLimit, setUsageLimit] = useState(500);
  const [toast, setToast] = useState<string | null>(null);

  const fetchCoupons = () => {
    fetch('/api/admin/data?slice=coupons')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setCoupons(res.data);
        }
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_coupon',
        payload: {
          code: code.trim().toUpperCase(),
          description,
          type,
          value: Number(value),
          minOrder: Number(minOrder),
          usageLimit: Number(usageLimit),
          startDate: new Date().toLocaleDateString('vi-VN'),
          isActive: true,
        },
      }),
    });

    const result = await res.json();
    if (result.success) {
      setToast('Tạo mã giảm giá mới thành công!');
      setShowAdd(false);
      setCode('');
      setDescription('');
      fetchCoupons();
      setTimeout(() => setToast(null), 3000);
    }
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
            <Ticket className="w-5 h-5 text-emerald-400" />
            <span>Mã Giảm Giá & Voucher Khuyến Mãi</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {coupons.length} mã
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấu hình mã giảm giá phần trăm (%) hoặc số tiền cố định, giới hạn đơn tối thiểu và lượt sử dụng.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Mới</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-3">Mã Voucher</th>
              <th className="p-3">Mô Tả Áp Dụng</th>
              <th className="p-3">Mức Giảm</th>
              <th className="p-3 text-right">Đơn Tối Thiểu</th>
              <th className="p-3 text-center">Đã Dùng / Giới Hạn</th>
              <th className="p-3 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-mono font-bold text-emerald-400 text-sm">
                  {c.code}
                </td>
                <td className="p-3 text-slate-300 max-w-sm">{c.description}</td>
                <td className="p-3 font-bold text-white">
                  {c.type === 'PERCENT' ? `${c.value}%` : formatVND(c.value)}
                </td>
                <td className="p-3 text-right font-semibold text-slate-200">
                  {formatVND(c.minOrder)}
                </td>
                <td className="p-3 text-center font-semibold text-slate-300">
                  {c.usedCount} / {c.usageLimit || '∞'}
                </td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    Đang kích hoạt
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Coupon */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-400" />
              <span>Tạo Mã Giảm Giá Mới</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mã Voucher (Code) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="GIADUNG100K"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono font-bold text-emerald-400 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô tả</label>
                <input
                  type="text"
                  placeholder="Giảm 100k cho đơn từ 2 triệu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Loại Giảm</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="PERCENT">Giảm phần trăm (%)</option>
                    <option value="FIXED">Giảm số tiền cố định (₫)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Giá Trị</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Đơn Tối Thiểu (₫)
                  </label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Số Lượt Dùng Tối Đa
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
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
                  Lưu Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
