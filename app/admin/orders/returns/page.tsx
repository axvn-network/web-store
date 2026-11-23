'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, Search, CheckCircle2, DollarSign, Package } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { ReturnVoucher } from '@/lib/adminDb';

export default function ReturnsAdminPage() {
  const [returns, setReturns] = useState<ReturnVoucher[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Return voucher form
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [reason, setReason] = useState('Khách muốn đổi sang mẫu dung tích lớn hơn');
  const [refundMethod, setRefundMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'VOUCHER'>('BANK_TRANSFER');
  const [refundAmount, setRefundAmount] = useState(2890000);
  const [restockType, setRestockType] = useState<'RESTOCK_USABLE' | 'MOVE_TO_DEFECT'>('RESTOCK_USABLE');
  const [note, setNote] = useState('Hàng nguyên seal, phụ kiện đầy đủ');

  const fetchData = () => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setReturns(res.data.returns || []);
          setOrders(res.data.orders || []);
          if (res.data.orders?.[0]) {
            setSelectedOrderId(res.data.orders[0].id);
          }
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    const ord = orders.find((o) => o.id === selectedOrderId);

    const payload = {
      orderId: selectedOrderId,
      orderCode: ord?.code || 'BS2611-ORDER',
      customerName: ord?.customerName || 'Khách Hàng',
      reason,
      refundMethod,
      refundAmount: Number(refundAmount),
      restockType,
      createdBy: 'CSKH Betashop',
      note,
      items: ord?.items?.map((it: any) => ({
        variantId: it.variantId || 'var-sp-01-1',
        productName: it.title,
        variantName: 'Bản Tiêu Chuẩn',
        sku: 'BS-STD',
        quantity: it.quantity || 1,
        price: it.price,
        total: it.price * (it.quantity || 1),
      })) || [],
    };

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_return_voucher', payload }),
    });

    const result = await res.json();
    if (result.success) {
      setToast('Tạo phiếu đổi trả & hoàn tiền thành công!');
      setShowModal(false);
      fetchData();
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = returns.filter(
    (r) =>
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase())
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
            <RotateCcw className="w-5 h-5 text-emerald-400" />
            <span>Đổi Trả Hàng & Hoàn Tiền Bảo Hành</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} phiếu
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Xử lý yêu cầu trả hàng, nhập lại kho (nếu còn nguyên vẹn) hoặc xuất kho hỏng, hoàn tiền qua tài khoản.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Phiếu Trả Hàng Mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã PTH, mã đơn hàng, tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Mã Phiếu</th>
                <th className="p-3">Mã Đơn Gốc</th>
                <th className="p-3">Khách Hàng</th>
                <th className="p-3">Lý Do Đổi Trả</th>
                <th className="p-3">Phương Thức Hoàn</th>
                <th className="p-3 text-right">Số Tiền Hoàn</th>
                <th className="p-3 text-center">Xử Lý Tồn Kho</th>
                <th className="p-3 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-400">{r.code}</td>
                  <td className="p-3 font-mono text-slate-300 font-bold">#{r.orderCode}</td>
                  <td className="p-3 font-bold text-white">{r.customerName}</td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{r.reason}</td>
                  <td className="p-3 text-slate-300 font-medium">{r.refundMethod}</td>
                  <td className="p-3 text-right font-black text-white">
                    {formatVND(r.refundAmount)}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.restockType === 'RESTOCK_USABLE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {r.restockType === 'RESTOCK_USABLE' ? 'Nhập lại bán' : 'Kho hỏng/lỗi'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      Đã hoàn tiền
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Return */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Tạo Phiếu Đổi Trả / Hoàn Tiền</span>
            </h3>

            <form onSubmit={handleCreateReturn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chọn Đơn Hàng Gốc
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => {
                    setSelectedOrderId(e.target.value);
                    const o = orders.find((item) => item.id === e.target.value);
                    if (o) setRefundAmount(o.finalTotal || o.totalAmount);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.code} - {o.customerName} ({formatVND(o.finalTotal || o.totalAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lý Do Đổi Trả
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hình Thức Hoàn Tiền
                  </label>
                  <select
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="BANK_TRANSFER">Chuyển khoản</option>
                    <option value="CASH">Tiền mặt tại quầy</option>
                    <option value="VOUCHER">Cấp voucher mua sắm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Số Tiền Hoàn (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tình Trạng Hàng Nhập Lại
                </label>
                <select
                  value={restockType}
                  onChange={(e) => setRestockType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="RESTOCK_USABLE">Hàng nguyên vẹn - Nhập lại kho bán bình thường</option>
                  <option value="MOVE_TO_DEFECT">Hàng lỗi NSX / hỏng - Chuyển kho chờ trả NCC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi Chú</label>
                <input
                  type="text"
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
                  Xác Nhận Đổi Trả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
