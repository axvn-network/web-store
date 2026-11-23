'use client';

import React, { useState, useEffect } from 'react';
import { Percent, Plus, Search, Calendar, CheckCircle2 } from 'lucide-react';
import { Promotion } from '@/lib/adminDb';

export default function PromotionsAdminPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'FLASH_SALE' | 'COMBO' | 'BUY_X_GET_Y' | 'DISCOUNT_PERCENT'>('FLASH_SALE');
  const [discount, setDiscount] = useState(20);
  const [desc, setDesc] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const fetchPromos = () => {
    fetch('/api/admin/data?slice=promotions')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setPromotions(res.data);
        }
      });
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const typeNames = {
      FLASH_SALE: 'Flash Sale Giờ Vàng',
      COMBO: 'Combo Tiết Kiệm',
      BUY_X_GET_Y: 'Mua X Tặng Y',
      DISCOUNT_PERCENT: 'Giảm Giá Trực Tiếp',
    };

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_promotion',
        payload: {
          name,
          type,
          typeName: typeNames[type],
          discount: Number(discount),
          startDate: new Date().toLocaleDateString('vi-VN'),
          isActive: true,
          description: desc,
        },
      }),
    });

    const result = await res.json();
    if (result.success) {
      setToast('Tạo chương trình khuyến mãi thành công!');
      setShowAdd(false);
      setName('');
      setDesc('');
      fetchPromos();
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
            <Percent className="w-5 h-5 text-emerald-400" />
            <span>Chương Trình Khuyến Mãi & Flash Sale</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {promotions.length} chương trình
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Thiết lập chiến dịch Flash Sale đếm ngược, combo nhà bếp và mua kèm giảm giá.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Chương Trình</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                  {p.typeName}
                </span>
                <h3 className="font-bold text-white text-base mt-1.5">{p.name}</h3>
              </div>
              <span className="text-xl font-black text-amber-400">-{p.discount}%</span>
            </div>

            <p className="text-xs text-slate-400">{p.description}</p>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Bắt đầu: {p.startDate}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                Đang chạy
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Promotion */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span>Tạo Chiến Dịch Khuyến Mãi Mới</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên chiến dịch <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tuần Lễ Vàng Bếp Đôi Inverter..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hình thức
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="FLASH_SALE">Flash Sale</option>
                    <option value="COMBO">Combo Tiết Kiệm</option>
                    <option value="BUY_X_GET_Y">Mua X Tặng Y</option>
                    <option value="DISCOUNT_PERCENT">Giảm giá %</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mức giảm (%)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô tả</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Điều kiện áp dụng chương trình..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                ></textarea>
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
                  Kích Hoạt Chiến Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
