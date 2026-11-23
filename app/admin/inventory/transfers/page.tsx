'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Plus, Search, CheckCircle2, Warehouse } from 'lucide-react';
import { TransferVoucher, Warehouse as WarehouseType, ProductVariant } from '@/lib/adminDb';

export default function TransfersAdminPage() {
  const [vouchers, setVouchers] = useState<TransferVoucher[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [fromWh, setFromWh] = useState('wh-01');
  const [toWh, setToWh] = useState('wh-02');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<{ variantId: string; quantity: number }[]>([
    { variantId: '', quantity: 5 },
  ]);

  const fetchData = () => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setVouchers(res.data.transferVouchers || []);
          setWarehouses(res.data.warehouses || []);
          setVariants(res.data.variants || []);
          if (res.data.variants?.[0]) {
            setItems([{ variantId: res.data.variants[0].id, quantity: 5 }]);
          }
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromWh === toWh) {
      alert('Kho chuyển và kho nhận không được trùng nhau!');
      return;
    }

    const srcWh = warehouses.find((w) => w.id === fromWh);
    const dstWh = warehouses.find((w) => w.id === toWh);

    const detailedItems = items.map((i) => {
      const v = variants.find((varItem) => varItem.id === i.variantId);
      return {
        variantId: i.variantId,
        productName: v?.name || 'Sản phẩm',
        variantName: 'Bản Tiêu Chuẩn',
        sku: v?.sku || 'BS-STD',
        quantity: Number(i.quantity),
      };
    });

    const payload = {
      fromWarehouseId: fromWh,
      fromWarehouseName: srcWh?.name || 'Kho Hà Nội',
      toWarehouseId: toWh,
      toWarehouseName: dstWh?.name || 'Kho TP.HCM',
      note,
      createdBy: 'Lê Văn Kho (Thủ kho)',
      items: detailedItems,
    };

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_transfer_voucher', payload }),
    });

    const result = await res.json();
    if (result.success) {
      setToast('Tạo phiếu chuyển kho thành công! Đã điều phối số lượng giữa 2 chi nhánh.');
      setShowModal(false);
      fetchData();
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.fromWarehouseName.toLowerCase().includes(search.toLowerCase()) ||
      v.toWarehouseName.toLowerCase().includes(search.toLowerCase())
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
            <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
            <span>Chuyển Kho Nội Bộ Đa Chi Nhánh</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} phiếu
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quy trình điều phối hàng hóa giữa Kho Tổng Hà Nội và Kho Chi Nhánh TP.HCM, quy trình 2 bước kiểm soát.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Phiếu Chuyển Kho</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã phiếu PCK, tên kho..."
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
              <th className="p-3">Kho Chuyển (Nguồn)</th>
              <th className="p-3">Kho Nhận (Đích)</th>
              <th className="p-3 text-center">Số Mặt Hàng</th>
              <th className="p-3">Ngày Lập</th>
              <th className="p-3">Người Lập</th>
              <th className="p-3 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-mono font-bold text-emerald-400">{v.code}</td>
                <td className="p-3 font-semibold text-white">{v.fromWarehouseName}</td>
                <td className="p-3 font-semibold text-emerald-300">{v.toWarehouseName}</td>
                <td className="p-3 text-center font-bold text-white">
                  {v.items?.length || 1} SP
                </td>
                <td className="p-3 text-slate-400">{v.transferDate}</td>
                <td className="p-3 text-slate-300">{v.createdBy}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    {v.statusText || 'Đã nhận đủ'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Transfer */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
              <span>Tạo Phiếu Chuyển Kho Nội Bộ</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Từ Kho (Nguồn)
                  </label>
                  <select
                    value={fromWh}
                    onChange={(e) => setFromWh(e.target.value)}
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
                    Đến Kho (Đích)
                  </label>
                  <select
                    value={toWh}
                    onChange={(e) => setToWh(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items row */}
              <div className="border border-slate-800 p-3 rounded-lg bg-slate-950 space-y-2">
                <span className="text-xs font-bold text-slate-200">Sản Phẩm Điều Chuyển</span>
                {items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-8">
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
                    </div>
                    <div className="col-span-4">
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) => {
                          const n = [...items];
                          n[idx].quantity = Number(e.target.value);
                          setItems(n);
                        }}
                        placeholder="Số lượng"
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white text-center"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi Chú</label>
                <input
                  type="text"
                  placeholder="Lý do chi viện kho..."
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
                  Xác Nhận Chuyển Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
