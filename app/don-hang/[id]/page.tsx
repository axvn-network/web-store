'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FiArrowLeft,
  FiTruck,
  FiCheckCircle,
  FiMapPin,
  FiCreditCard,
  FiPrinter,
  FiMessageSquare,
  FiClock,
  FiPackage,
  FiShield,
} from 'react-icons/fi';

export default function ChiTietDonHangPage() {
  const params = useParams();
  const orderId = (params?.id as string) || 'ORD-2026-9812';

  const orderData = {
    code: orderId,
    date: '14/11/2026 14:30',
    status: 'SHIPPING',
    shippingCarrier: 'Giao Hàng Nhanh (GHN Express)',
    trackingNumber: 'GHN8829103',
    expectedDelivery: '16/11/2026 - 17/11/2026',
    receiver: {
      name: 'Nguyễn Văn An',
      phone: '0988 123 456',
      address: 'Số 18, Ngõ 86 Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội',
    },
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    paymentStatus: 'Chưa thanh toán (Thanh toán khi nhận kiện)',
    items: [
      {
        id: '1',
        title: 'Nồi chiên không dầu Philips Rapid Air HD9252/90 4.1L',
        image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=150&q=80',
        variant: 'Màu Đen bóng • Dung tích 4.1 Lít • Công suất 1400W',
        quantity: 1,
        unitPrice: 2490000,
        totalPrice: 2490000,
      },
    ],
    pricing: {
      subtotal: 2490000,
      shippingFee: 30000,
      shippingDiscount: -30000, // Freeship voucher
      voucherDiscount: 0,
      totalPayment: 2490000,
    },
    timeline: [
      { time: '15/11/2026 08:30', title: 'Đang vận chuyển', desc: 'Kiện hàng đã rời kho trung chuyển Hà Nội và đang được tài xế giao tới bạn.', active: true },
      { time: '14/11/2026 18:00', title: 'Đã giao cho đơn vị vận chuyển', desc: 'Bưu tá GHN đã lấy hàng từ kho tổng BetaShop.', active: true },
      { time: '14/11/2026 15:10', title: 'Người bán đang chuẩn bị hàng', desc: 'Đơn hàng đã được xác nhận và đóng gói kỹ càng với tem bảo hành chính hãng.', active: true },
      { time: '14/11/2026 14:30', title: 'Đặt hàng thành công', desc: 'Đơn hàng được khởi tạo thành công trên hệ thống.', active: true },
    ],
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Back Action & Print */}
        <div className="flex items-center justify-between">
          <Link
            href="/don-hang"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-orange-600 transition"
          >
            <FiArrowLeft />
            <span>Quay lại danh sách đơn hàng</span>
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            <FiPrinter />
            <span>In hóa đơn</span>
          </button>
        </div>

        {/* Tracking Timeline Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng #{orderData.code}</h1>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">
                  Đang vận chuyển
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Thời gian đặt hàng: {orderData.date} • Dự kiến giao: <strong className="text-gray-800">{orderData.expectedDelivery}</strong>
              </p>
            </div>

            <div className="text-xs text-right">
              <span className="text-gray-400 block">Đơn vị vận chuyển:</span>
              <strong className="text-orange-600">{orderData.shippingCarrier}</strong>
              <div className="text-gray-500 mt-0.5">Mã vận đơn: {orderData.trackingNumber}</div>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="mt-8 relative pl-6 border-l-2 border-orange-500 space-y-6">
            {orderData.timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-orange-600 ring-4 ring-orange-100" />
                <span className="text-xs font-semibold text-gray-400">{item.time}</span>
                <h4 className="text-sm font-bold text-gray-900 mt-0.5">{item.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 text-sm font-bold text-gray-900">
              <FiMapPin className="text-orange-600" />
              <span>Địa chỉ nhận hàng</span>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-gray-700">
              <div className="font-bold text-gray-900 text-sm">{orderData.receiver.name}</div>
              <div className="text-gray-500">{orderData.receiver.phone}</div>
              <div className="leading-relaxed">{orderData.receiver.address}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 text-sm font-bold text-gray-900">
              <FiCreditCard className="text-orange-600" />
              <span>Phương thức thanh toán</span>
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-gray-700">
              <div className="font-bold text-gray-900 text-sm">{orderData.paymentMethod}</div>
              <div className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg inline-block border border-amber-200 mt-1 font-semibold">
                {orderData.paymentStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Product Items & Price breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="font-bold text-base text-gray-900 pb-4 border-b border-gray-100">
            Kiện hàng
          </h3>

          <div className="divide-y divide-gray-100">
            {orderData.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {item.unitPrice.toLocaleString('vi-VN')} ₫ x {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-orange-600">
                    {item.totalPrice.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Tổng tiền hàng:</span>
              <span className="font-semibold text-gray-900">
                {orderData.pricing.subtotal.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển toàn quốc:</span>
              <span className="font-semibold text-gray-900">
                {orderData.pricing.shippingFee.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Ưu đãi miễn phí vận chuyển:</span>
              <span className="font-semibold">
                {orderData.pricing.shippingDiscount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100 text-sm font-bold text-gray-900">
              <span className="text-base">Tổng số tiền thanh toán:</span>
              <span className="text-xl font-black text-orange-600">
                {orderData.pricing.totalPayment.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
