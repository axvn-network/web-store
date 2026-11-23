'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  Package,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchOrder = () => {
    fetch('/api/admin/data?slice=orders')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const found = res.data.find(
            (o: any) => o.id === orderId || o.code === orderId
          );
          if (found) setOrder(found);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string, statusText: string) => {
    setUpdating(true);
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_order_status',
        payload: { orderId: order.id, status: newStatus, statusText },
      }),
    });
    const result = await res.json();
    if (result.success) {
      setToast(`Đã chuyển trạng thái đơn hàng thành: ${statusText}`);
      setOrder({ ...order, status: newStatus, statusText });
      setTimeout(() => setToast(null), 3000);
    }
    setUpdating(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Đang tải chi tiết đơn hàng...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3">
        <p>Không tìm thấy đơn hàng trong hệ thống.</p>
        <Link href="/admin/orders" className="text-emerald-400 underline font-bold">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'PACKING', label: 'Đang đóng gói' },
    { key: 'SHIPPING', label: 'Đang giao hàng' },
    { key: 'COMPLETED', label: 'Đã hoàn thành' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Đơn Hàng #{order.code}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  order.orderType === 'POS'
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {order.orderType === 'POS' ? 'BÁN TẠI QUẦY (POS)' : 'ĐƠN ONLINE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Đặt lúc: {order.createdAt} • Thanh toán qua {order.paymentMethod}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Hóa Đơn A4/A5</span>
          </button>
        </div>
      </div>

      {/* Process Stepper */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Tiến Trình Xử Lý Đơn Hàng
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((st, idx) => {
            const isCompleted = idx <= (currentStepIdx === -1 ? 0 : currentStepIdx);
            const isCurrent = idx === currentStepIdx;

            return (
              <button
                key={st.key}
                type="button"
                onClick={() => handleStatusChange(st.key, st.label)}
                disabled={updating}
                className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : isCompleted
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold">Bước {idx + 1}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-xs font-bold mt-2">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Products in Order */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Danh Sách Sản Phẩm Trong Đơn</span>
            <span className="text-xs text-slate-400 font-normal">
              {order.items?.length || 1} sản phẩm
            </span>
          </h3>

          <div className="divide-y divide-slate-800">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center p-1 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="max-h-full object-contain" />
                    ) : (
                      <Package className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Đơn giá: {formatVND(item.price)} × Số lượng: <strong>{item.quantity}</strong>
                    </p>
                  </div>
                </div>
                <div className="font-extrabold text-sm text-emerald-400">
                  {formatVND(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Tổng tiền hàng:</span>
              <span className="font-semibold text-white">
                {formatVND(order.totalAmount || order.finalTotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-white">
                {order.shippingFee ? formatVND(order.shippingFee) : '0 ₫ (Miễn phí)'}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Giảm giá voucher:</span>
                <span>-{formatVND(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white border-t border-slate-800 pt-2">
              <span>Tổng thanh toán:</span>
              <span className="text-emerald-400">{formatVND(order.finalTotal || order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right: Customer & Delivery Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Thông Tin Khách Hàng
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="font-bold text-white">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Thông Tin Thanh Toán
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Hình thức:</span>
                <span className="font-bold text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-400">
                  {order.paymentStatus || 'ĐÃ THANH TOÁN'}
                </span>
              </div>
              {order.note && (
                <div className="border-t border-slate-800 pt-2">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Ghi chú của khách:</span>
                  <p className="italic text-slate-300">{order.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
