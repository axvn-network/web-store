'use client';

import React, { useState, useEffect } from 'react';
import { FileUp, Plus, Search, Warehouse, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { ExportVoucher, Warehouse as WarehouseType, ProductVariant } from '@/lib/adminDb';

export default function ExportsAdminPage() {
  const [vouchers, setVouchers] = useState<ExportVoucher[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New Export Form
  const [warehouseId, setWarehouseId] = useState('wh-01');
  const [reason, setReason] = useState<'SALE' | 'DEFECT' | 'RETURN_SUPPLIER' | 'INTERNAL_USE'>('INTERNAL_USE');
  const [note, setNote] = useState('');
  const [items, setItems] = useState<{ variantId: string; quantity: number; unitPrice: number }[]>([
    { variantId: '', quantity: 1, unitPrice: 2000000 },
  ]);

  const fetchData = () => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setVouchers(res.data.exportVouchers || []);
          setWarehouses(res.data.warehouses || []);
          setVariants(res.data.variants || []);
          if (res.data.variants?.[0]) {
            setItems([
              {
                variantId: res.data.variants[0].id,
                quantity: 1,
                unitPrice: res.data.variants[0].costPrice || 2000000,
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
      return {
        variantId: i.variantId,
        productName: v?.name || 'Sản phẩm',
        variantName: 'Bản Tiêu Chuẩn',
        sku: v?.sku || 'BS-STD',
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        total: Number(i.quantity) * Number(i.unitPrice),
      };
    });

    const reasonTexts = {
      SALE: 'Xuất giao đơn bán hàng',
      DEFECT: 'Xuất kho thanh lý hàng lỗi / hỏng',
      RETURN_SUPPLIER: 'Xuất trả nhà cung cấp',
      INTERNAL_USE: 'Xuất sử dụng nội bộ / trưng bày showroom',
    };

    const payload = {
      warehouseId,
      warehouseName: selectedWh?.name || 'Kho Tổng Hà Nội',
      reason,
      reasonText: reasonTexts[reason],
      exportDate: new Date().toLocaleDateString('vi-VN'),
      note,
      createdBy: 'Lê Văn Kho (Thủ kho)',
      items: detailedItems,
    };

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_export_voucher', payload }),
    });

    const result = await res.json();
    if (result.success) {
      setToast('Tạo phiếu xuất kho thành công! Đã tự động trừ tồn kho.');
      setShowModal(false);
      fetchData();
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.warehouseName.toLowerCase().includes(search.toLowerCase()) ||
      v.reasonText.toLowerCase().includes(search.toLowerCase())
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
            <FileUp className="w-5 h-5 text-emerald-400" />
            <span>Phiếu Xuất Kho Hàng Hóa</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} phiếu
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý xuất hàng giao khách, xuất trả nhà cung cấp, xuất trưng bày showroom và xuất hủy hàng lỗi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Lập Phiếu Xuất Kho</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã phiếu PXK, lý do xuất..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Mã Phiếu</th>
                <th className="p-3">Kho Xuất</th>
                <th className="p-3">Lý Do Xuất Kho</th>
                <th className="p-3">Ngày Xuất</th>
                <th className="p-3">Người Lập</th>
                <th className="p-3 text-center">Số Mặt Hàng</th>
                <th className="p-3 text-right">Tổng Giá Trị</th>
                <th className="p-3 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((v) => {
                const total = v.items?.reduce((sum, item) => sum + item.total, 0) || 0;
                return (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">{v.code}</td>
                    <td className="p-3 font-semibold text-white">
                      {v.warehouseName.replace('Kho ', '')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {v.reasonText}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{v.exportDate}</td>
                    <td className="p-3 text-slate-300">{v.createdBy}</td>
                    <td className="p-3 text-center font-bold text-white">
                      {v.items?.length || 1} SP
                    </td>
                    <td className="p-3 text-right font-extrabold text-white">
                      {formatVND(total)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        Đã xuất kho
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create Export */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-xl w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileUp className="w-4 h-4 text-emerald-400" />
              <span>Lập Phiếu Xuất Kho</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kho Xuất Hàng
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
                    Lý Do Xuất
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="SALE">Xuất giao đơn bán hàng</option>
                    <option value="INTERNAL_USE">Xuất trưng bày showroom / mẫu</option>
                    <option value="DEFECT">Xuất thanh lý / hủy hàng lỗi</option>
                    <option value="RETURN_SUPPLIER">Xuất trả hàng nhà cung cấp</option>
                  </select>
                </div>
              </div>

              {/* Items row */}
              <div className="border border-slate-800 p-3 rounded-lg bg-slate-950 space-y-2">
                <span className="text-xs font-bold text-slate-200">Sản Phẩm Xuất Kho</span>
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
                  placeholder="Lý do chi tiết..."
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
                  Xác Nhận Xuất Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
