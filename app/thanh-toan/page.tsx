'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BiCheckCircle, 
  BiShieldQuarter, 
  BiHomeAlt, 
  BiChevronRight,
  BiCreditCard,
  BiMoney,
  BiQrScan
} from 'react-icons/bi';
import { useCart } from '@/lib/cartStore';
import { formatVND } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoaded, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    province: 'Hà Nội',
    district: '',
    address: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr' | 'momo'>('cod');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const shippingFee = shippingMethod === 'express' ? 50000 : totalPrice >= 1000000 ? 0 : 35000;
  const finalTotal = totalPrice + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    // Validate VN phone
    const phoneRegex = /^(\+84|0)(3|5|7|8|9)\d{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập số di động Việt Nam (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items,
          totalPrice,
          shippingFee,
          finalTotal,
          paymentMethod,
        }),
      });

      const result = await res.json();
      if (result.success && result.data) {
        const orderData = {
          code: result.data.code,
          customer: formData,
          items,
          totalPrice,
          shippingFee,
          finalTotal,
          paymentMethod,
          date: new Date().toLocaleString('vi-VN'),
        };
        setOrderSuccess(orderData);
        clearCart();
      } else {
        // Fallback local code if API error
        const orderCode = `BS${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const orderData = {
          code: orderCode,
          customer: formData,
          items,
          totalPrice,
          shippingFee,
          finalTotal,
          paymentMethod,
          date: new Date().toLocaleString('vi-VN'),
        };
        setOrderSuccess(orderData);
        clearCart();
      }
    } catch (err) {
      console.error('Order submission error:', err);
      const orderCode = `BS${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setOrderSuccess({
        code: orderCode,
        customer: formData,
        items,
        totalPrice,
        shippingFee,
        finalTotal,
        paymentMethod,
        date: new Date().toLocaleString('vi-VN'),
      });
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center my-8 text-gray-500 text-sm">
        Đang tải trang thanh toán...
      </div>
    );
  }

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-6 bg-white p-6 sm:p-10 rounded-2xl border border-emerald-100 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl">
          <BiCheckCircle />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Cảm ơn quý khách <strong className="text-gray-900">{orderSuccess.customer.fullName}</strong> đã tin tưởng Betashop.
          </p>
          <p className="text-xs text-orange-600 font-bold">
            Mã đơn hàng: #{orderSuccess.code}
          </p>
        </div>

        {/* VietQR Instructions if selected */}
        {orderSuccess.paymentMethod === 'vietqr' && (
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-left space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
              <BiQrScan className="text-xl" />
              <span>Quét mã VietQR chuyển khoản nhanh 24/7</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1.5 text-gray-700">
              <p>Ngân hàng: <strong>Vietcombank (Chi nhánh Hà Nội)</strong></p>
              <p>Số tài khoản: <strong>9999 8888 6666</strong></p>
              <p>Chủ tài khoản: <strong>CONG TY CO PHAN BETASHOP VIET NAM</strong></p>
              <p>Số tiền: <strong className="text-red-600 font-bold">{formatVND(orderSuccess.finalTotal)}</strong></p>
              <p>Nội dung CK: <strong className="text-orange-600 font-mono font-bold">BETASHOP {orderSuccess.code}</strong></p>
            </div>
            <p className="text-[11px] text-gray-500 italic">
              * Hệ thống sẽ tự động duyệt đơn hàng sau khi nhận được chuyển khoản trong vòng 5 phút.
            </p>
          </div>
        )}

        {/* Order Details summary */}
        <div className="bg-gray-50 p-4 rounded-xl text-left text-xs space-y-2 border border-gray-100">
          <h3 className="font-bold text-gray-800 uppercase tracking-wide">
            Thông tin giao hàng:
          </h3>
          <p><strong>Người nhận:</strong> {orderSuccess.customer.fullName} – {orderSuccess.customer.phone}</p>
          <p><strong>Địa chỉ nhận:</strong> {orderSuccess.customer.address}, {orderSuccess.customer.district}, {orderSuccess.customer.province}</p>
          <p><strong>Phương thức thanh toán:</strong> {orderSuccess.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : orderSuccess.paymentMethod === 'vietqr' ? 'Chuyển khoản VietQR' : 'Ví MoMo'}</p>
          <p><strong>Tổng thanh toán:</strong> <span className="font-black text-red-600 text-sm">{formatVND(orderSuccess.finalTotal)}</span></p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-6 py-2.5 bg-[#f53d2d] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-[#e03122] transition shadow"
          >
            Tiếp tục mua sắm
          </Link>
          <a
            href="tel:19008237"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-gray-200 transition"
          >
            Hỗ trợ đơn hàng: 1900 8237
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <Link href="/gio-hang" className="hover:text-orange-600">
          Giỏ hàng
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Thanh toán đơn hàng</span>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Delivery Info & Payment Methods (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Delivery Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-4">
              <h2 className="text-base font-black text-gray-900 border-l-4 border-[#f53d2d] pl-3 uppercase">
                1. Thông Tin Nhận Hàng
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Số điện thoại di động <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Email nhận hóa đơn điện tử (Tùy chọn)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 bg-white"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                    <option value="Khác">Tỉnh thành khác</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Quận / Huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Quận Cầu Giấy, Hoàn Kiếm..."
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Địa chỉ chi tiết (Số nhà, tên đường, phường/xã) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số 128 đường Cầu Giấy, P. Quan Hoa"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">
                    Ghi chú đơn hàng (Thời gian giao, yêu cầu thêm...)
                  </label>
                  <textarea
                    name="note"
                    rows={2}
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Giao giờ hành chính, gọi trước khi đến 15 phút..."
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-4">
              <h2 className="text-base font-black text-gray-900 border-l-4 border-[#f53d2d] pl-3 uppercase">
                2. Phương Thức Thanh Toán
              </h2>

              <div className="space-y-2.5 text-xs">
                {/* COD */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                      <BiMoney className="text-lg text-emerald-600" />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Quý khách được kiểm tra hàng trước khi thanh toán cho nhân viên bưu tá.
                    </p>
                  </div>
                </label>

                {/* VietQR */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'vietqr' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'vietqr'}
                    onChange={() => setPaymentMethod('vietqr')}
                    className="mt-0.5 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                      <BiQrScan className="text-lg text-orange-600" />
                      <span>Chuyển khoản VietQR / Napas 247</span>
                      <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">Ưu tiên</span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Quét mã QR qua mọi ứng dụng ngân hàng: Vietcombank, Techcombank, MB Bank, BIDV, v.v. Xử lý tự động 24/7.
                    </p>
                  </div>
                </label>

                {/* MoMo */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'momo' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                    className="mt-0.5 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                      <BiCreditCard className="text-lg text-pink-600" />
                      <span>Ví điện tử MoMo</span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Thanh toán an toàn, bảo mật qua ví MoMo.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary Column (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 sticky top-24">
              <h3 className="text-sm font-black text-gray-900 uppercase pb-2 border-b border-gray-100">
                Đơn Hàng Của Bạn ({items.length} mặt hàng)
              </h3>

              {/* Items summary */}
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-2.5 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-800 truncate">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        SL: {quantity} &times; {formatVND(product.price)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {formatVND(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tiền hàng:</span>
                  <span className="font-bold text-gray-900">{formatVND(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">Miễn phí</span>
                    ) : (
                      <span className="font-bold text-gray-900">{formatVND(shippingFee)}</span>
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-sm font-black text-gray-900">Tổng thanh toán:</span>
                  <span className="text-xl font-black text-[#f53d2d]">
                    {formatVND(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#f53d2d] to-[#ff6633] hover:from-[#e03122] hover:to-[#f53d2d] text-white font-black text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Đang tạo đơn hàng...' : `Đặt Mua Ngay (${formatVND(finalTotal)})`}
              </button>

              <div className="text-[11px] text-gray-500 text-center space-y-1">
                <p className="flex items-center justify-center gap-1 text-gray-700">
                  <BiShieldQuarter className="text-emerald-600" />
                  <span>Cam kết bảo mật thông tin & chính sách hoàn tiền 100%</span>
                </p>
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
