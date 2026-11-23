'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, Search, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { AdjustmentVoucher, Warehouse as WarehouseType, ProductVariant } from '@/lib/adminDb';

export default function AdjustmentsAdminPage() {
  const [adjustments, setAdjustments] = useState<AdjustmentVoucher[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [warehouseId, setWarehouseId] = useState('wh-01');
  const [reason, setReason] = useState('Kiểm kê định kỳ tháng 11/2026');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<
    { variantId: string; bookQuantity: number; realQuantity: number }[]
  >([{ variantId: '', bookQuantity: 25, realQuantity: 25 }]);

  const fetchData = () => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setAdjustments(res.data.adjustments || []);
          setWarehouses(res.data.warehouses || []);
          setVariants(res.data.variants || []);
          if (res.data.variants?.[0]) {
            setItems([
              {
                variantId: res.data.variants[0].id,
                bookQuantity: 25,
                realQuantity: 25,
              },
            ]);
          }
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedWh = warehouses.find((w) => w.id === warehouseId);

    const detailedItems = items.map((i) => {
      const v = variants.find((varItem) => varItem.id === i.variantId);
      const diff = Number(i.realQuantity) - Number(i.bookQuantity);
      const cost = v?.costPrice || 2000000;
      return {
        variantId: i.variantId,
        productName: v?.name || 'Sản phẩm gia dụng',
        variantName: 'Bản Tiêu Chuẩn',
        sku: v?.sku || 'BS-STD',
        bookQuantity: Number(i.bookQuantity),
        realQuantity: Number(i.realQuantity),
        diffQuantity: diff,
        costPrice: cost,
        diffAmount: diff * cost,
        note: diff === 0 ? 'Khớp tồn' : diff > 0 ? 'Thừa' : 'Thiếu',
      };
    });

    const payload = {
      warehouseId,
      warehouseName: selectedWh?.name || 'Kho Tổng Hà Nội',
      reason,
      auditDate: new Date().toLocaleDateString('vi-VN'),
      createdBy: 'Nguyễn Văn Hùng (Quản lý)',
      note,
      items: detailedItems,
    };

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_adjustment', payload }),
    });

    const result = await res.json();
    if (result.success) {
      setToast('Tạo phiếu điều chỉnh kiểm kê thành công! Tồn kho đã được đồng bộ số thực tế.');
      setShowModal(false);
      fetchData();
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = adjustments.filter(
    (a) =>
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.warehouseName.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase())
  );

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
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            <span>Điều Chỉnh Kiểm Kê Kho</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} đợt kiểm kê
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Đối soát số lượng tồn sổ sách và số lượng đếm thực tế, tự động điều chỉnh cân bằng kho và ghi nhận lý do.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Lập Phiếu Kiểm Kê</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã phiếu PKK, lý do kiểm kê..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-3">Mã Phiếu</th>
              <th className="p-3">Kho Kiểm Kê</th>
              <th className="p-3">Mục Đích / Lý Do</th>
              <th className="p-3">Ngày Kiểm Kê</th>
              <th className="p-3">Người Kiểm Kê</th>
              <th className="p-3 text-center">Chênh Lệch</th>
              <th className="p-3 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((a) => {
              const totalDiff = a.items?.reduce((sum, i) => sum + i.diffQuantity, 0) || 0;
              return (
                <tr key={a.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-400">{a.code}</td>
                  <td className="p-3 font-semibold text-white">{a.warehouseName}</td>
                  <td className="p-3 text-slate-300">{a.reason}</td>
                  <td className="p-3 text-slate-400">{a.auditDate}</td>
                  <td className="p-3 text-slate-300">{a.createdBy}</td>
                  <td className="p-3 text-center font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        totalDiff === 0
                          ? 'bg-slate-800 text-slate-300'
                          : totalDiff > 0
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {totalDiff === 0 ? 'Khớp 100%' : `${totalDiff > 0 ? '+' : ''}${totalDiff} chiếc`}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      Đã cân bằng kho
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Add Adjustment */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              <span>Lập Phiếu Điều Chỉnh Kiểm Kê</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kho Kiểm Kê
                  </label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Lý Do Kiểm Kê
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Items row */}
              <div className="border border-slate-800 p-3 rounded-lg bg-slate-950 space-y-2">
                <span className="text-xs font-bold text-slate-200">Sản Phẩm Kiểm Đếm</span>
                {items.map((it, idx) => (
                  <div key={idx} className="space-y-2">
                    <select
                      value={it.variantId}
                      onChange={(e) => {
                        const n = [...items];
                        n[idx].variantId = e.target.value;
                        setItems(n);
                      }}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    >
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Tồn Sổ Sách</label>
                        <input
                          type="number"
                          value={it.bookQuantity}
                          onChange={(e) => {
                            const n = [...items];
                            n[idx].bookQuantity = Number(e.target.value);
                            setItems(n);
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Thực Tế Đếm Được</label>
                        <input
                          type="number"
                          value={it.realQuantity}
                          onChange={(e) => {
                            const n = [...items];
                            n[idx].realQuantity = Number(e.target.value);
                            setItems(n);
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-emerald-400 font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi Chú</label>
                <input
                  type="text"
                  placeholder="Ghi nhận nguyên nhân chênh lệch nếu có..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Cân Bằng & Lưu Kiểm Kê
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
