'use client';

import React, { useState, useEffect } from 'react';
import {
  FileDown,
  Plus,
  Search,
  Building2,
  Warehouse,
  Printer,
  Calendar,
  CheckCircle2,
  DollarSign,
  Trash2,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { ImportVoucher, Supplier, Warehouse as WarehouseType, ProductVariant } from '@/lib/adminDb';

export default function ImportsAdminPage() {
  const [vouchers, setVouchers] = useState<ImportVoucher[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [printVoucher, setPrintVoucher] = useState<ImportVoucher | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // New import voucher form state
  const [supplierId, setSupplierId] = useState('sup-01');
  const [warehouseId, setWarehouseId] = useState('wh-01');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [note, setNote] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [items, setItems] = useState<
    { variantId: string; quantity: number; costPrice: number }[]
  >([{ variantId: '', quantity: 10, costPrice: 2000000 }]);

  const fetchData = () => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setVouchers(res.data.importVouchers || []);
          setSuppliers(res.data.suppliers || []);
          setWarehouses(res.data.warehouses || []);
          setVariants(res.data.variants || []);
          if (res.data.variants?.[0]) {
            setItems([
              {
                variantId: res.data.variants[0].id,
                quantity: 10,
                costPrice: res.data.variants[0].costPrice || 2000000,
              },
            ]);
          }
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = () => {
    if (variants.length > 0) {
      setItems([
        ...items,
        {
          variantId: variants[0].id,
          quantity: 5,
          costPrice: variants[0].costPrice || 1500000,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  const vatAmount = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + vatAmount;
  const debtAmount = Math.max(0, totalAmount - (paidAmount || 0));

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSup = suppliers.find((s) => s.id === supplierId);
    const selectedWh = warehouses.find((w) => w.id === warehouseId);

    const detailedItems = items.map((i) => {
      const v = variants.find((varItem) => varItem.id === i.variantId);
      return {
        variantId: i.variantId,
        productName: v?.name || 'Sản phẩm gia dụng',
        variantName: 'Bản Tiêu Chuẩn 220V',
        sku: v?.sku || 'BS-STD',
        quantity: Number(i.quantity),
        costPrice: Number(i.costPrice),
        discount: 0,
        total: Number(i.quantity) * Number(i.costPrice),
      };
    });

    const payload = {
      supplierId,
      supplierName: selectedSup?.name || 'NCC Gia Dụng',
      warehouseId,
      warehouseName: selectedWh?.name || 'Kho Tổng Hà Nội',
      invoiceNumber,
      importDate: new Date().toLocaleDateString('vi-VN'),
      subtotal,
      discount: 0,
      vatAmount,
      totalAmount,
      paidAmount: Number(paidAmount),
      debtAmount,
      note,
      createdBy: 'Lê Văn Kho (Thủ kho)',
      items: detailedItems,
    };

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_import_voucher', payload }),
    });

    const result = await res.json();
    if (result.success) {
      setToast('Tạo phiếu nhập kho thành công! Đã tự động cập nhật tồn kho & công nợ.');
      setShowModal(false);
      fetchData();
      setTimeout(() => setToast(null), 3500);
    }
  };

  const filtered = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      v.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
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
            <FileDown className="w-5 h-5 text-emerald-400" />
            <span>Phiếu Nhập Kho Từ Nhà Cung Cấp</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} phiếu
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tạo phiếu nhập hàng, tự động cộng tồn kho thực tế, in phiếu A4 và ghi nhận công nợ nhà cung cấp.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Lập Phiếu Nhập Kho Mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã phiếu (PNK), tên NCC, số hóa đơn..."
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
                <th className="p-3">Nhà Cung Cấp</th>
                <th className="p-3">Kho Nhập</th>
                <th className="p-3">Hóa Đơn / Ngày</th>
                <th className="p-3 text-right">Tổng Tiền (Gồm VAT)</th>
                <th className="p-3 text-right">Đã Thanh Toán</th>
                <th className="p-3 text-right">Công Nợ Ghi Sổ</th>
                <th className="p-3 text-center">Trạng Thái</th>
                <th className="p-3 text-right">In Phiếu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-400">{v.code}</td>
                  <td className="p-3 font-bold text-white">{v.supplierName}</td>
                  <td className="p-3 text-slate-300 font-medium">
                    {v.warehouseName.replace('Kho ', '')}
                  </td>
                  <td className="p-3 text-slate-400">
                    <div>{v.invoiceNumber ? `HĐ: ${v.invoiceNumber}` : '—'}</div>
                    <div className="text-[10px]">{v.importDate}</div>
                  </td>
                  <td className="p-3 text-right font-extrabold text-white">
                    {formatVND(v.totalAmount)}
                  </td>
                  <td className="p-3 text-right font-semibold text-emerald-400">
                    {formatVND(v.paidAmount)}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`font-black ${
                        v.debtAmount > 0 ? 'text-red-400' : 'text-slate-400'
                      }`}
                    >
                      {formatVND(v.debtAmount)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      {v.statusText || 'Đã hoàn thành'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setPrintVoucher(v)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white inline-flex items-center gap-1 font-semibold"
                      title="In phiếu nhập kho A4"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Import Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>Tạo Phiếu Nhập Kho Mua Hàng</span>
            </h3>

            <form onSubmit={handleCreateVoucher} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nhà Cung Cấp
                  </label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kho Nhập Hàng
                  </label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Số Hóa Đơn Đỏ VAT Của NCC (Nếu có)
                </label>
                <input
                  type="text"
                  placeholder="HD-2026-004812"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Items Table */}
              <div className="space-y-2 border border-slate-800 p-3 rounded-lg bg-slate-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Danh Sách Sản Phẩm Nhập
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm dòng
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <select
                          value={it.variantId}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].variantId = e.target.value;
                            const v = variants.find((item) => item.id === e.target.value);
                            if (v) newItems[idx].costPrice = v.costPrice;
                            setItems(newItems);
                          }}
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        >
                          {variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name} ({v.sku})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].quantity = Number(e.target.value);
                            setItems(newItems);
                          }}
                          placeholder="SL"
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white text-center"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={it.costPrice}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[idx].costPrice = Number(e.target.value);
                            setItems(newItems);
                          }}
                          placeholder="Giá nhập"
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white text-right"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Money Summary */}
              <div className="p-3 bg-slate-800/60 rounded-lg text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Tiền hàng:</span>
                  <span className="font-bold text-white">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế VAT (10%):</span>
                  <span className="font-bold text-white">{formatVND(vatAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t border-slate-700 pt-1 text-emerald-400">
                  <span>Tổng tiền thanh toán:</span>
                  <span>{formatVND(totalAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tiền Đã Thanh Toán Cho NCC
                  </label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-emerald-400 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Công Nợ Còn Lại (Ghi vào NCC)
                  </label>
                  <div className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-black text-red-400">
                    {formatVND(debtAmount)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi Chú</label>
                <input
                  type="text"
                  placeholder="Lý do nhập, số xe giao..."
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
                  Lưu & Tăng Tồn Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print A4 Invoice Modal */}
      {printVoucher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl p-8 max-w-2xl w-full space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-black text-emerald-700">BETASHOP VIỆT NAM</h2>
                <p className="text-xs text-gray-600">Tổng Kho Đồ Gia Dụng Toàn Quốc</p>
                <p className="text-xs text-gray-600">Hotline: 1900 8237 • Web: betashop.vn</p>
              </div>
              <div className="text-right">
                <h3 className="text-base font-black uppercase text-gray-800">
                  PHIẾU NHẬP KHO
                </h3>
                <p className="text-xs font-mono font-bold text-gray-600">{printVoucher.code}</p>
                <p className="text-xs text-gray-500">Ngày nhập: {printVoucher.importDate}</p>
              </div>
            </div>

            <div className="text-xs space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Nhà cung cấp: <strong>{printVoucher.supplierName}</strong></p>
              <p>Kho nhập hàng: <strong>{printVoucher.warehouseName}</strong></p>
              <p>Số hóa đơn đỏ: <strong>{printVoucher.invoiceNumber || '—'}</strong></p>
              <p>Thủ kho lập phiếu: <strong>{printVoucher.createdBy}</strong></p>
            </div>

            <table className="w-full text-left text-xs border border-gray-200">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-2">STT</th>
                  <th className="p-2">Tên Hàng Hóa</th>
                  <th className="p-2 text-center">SL</th>
                  <th className="p-2 text-right">Đơn Giá Nhập</th>
                  <th className="p-2 text-right">Thành Tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {printVoucher.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-center">{idx + 1}</td>
                    <td className="p-2 font-medium">{it.productName}</td>
                    <td className="p-2 text-center font-bold">{it.quantity}</td>
                    <td className="p-2 text-right">{formatVND(it.costPrice)}</td>
                    <td className="p-2 text-right font-bold">{formatVND(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-xs space-y-1 text-right">
              <p>Tổng tiền hàng: <strong>{formatVND(printVoucher.subtotal)}</strong></p>
              <p>Thuế VAT: <strong>{formatVND(printVoucher.vatAmount)}</strong></p>
              <p className="text-sm font-black text-emerald-700">
                Tổng thanh toán: {formatVND(printVoucher.totalAmount)}
              </p>
              <p className="text-gray-600">Đã trả: {formatVND(printVoucher.paidAmount)} | Còn nợ: <strong className="text-red-600">{formatVND(printVoucher.debtAmount)}</strong></p>
            </div>

            <div className="flex justify-between pt-8 text-center text-xs">
              <div>
                <p className="font-bold">Người Giao Hàng</p>
                <p className="text-gray-400 text-[10px] mt-8">(Ký, ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="font-bold">Thủ Kho Nhận Hàng</p>
                <p className="text-gray-400 text-[10px] mt-8">(Ký, đóng dấu)</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setPrintVoucher(null)}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
              >
                In Phiếu Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
