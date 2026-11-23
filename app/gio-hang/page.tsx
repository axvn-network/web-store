'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AiOutlineShoppingCart, 
  AiOutlineDelete, 
  AiOutlineArrowLeft,
  AiOutlineCheckCircle
} from 'react-icons/ai';
import { BiPlus, BiMinus, BiHomeAlt, BiChevronRight, BiShieldQuarter } from 'react-icons/bi';
import { useCart } from '@/lib/cartStore';
import { formatVND } from '@/lib/utils';

export default function CartPage() {
  const { items, isLoaded, totalCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const shippingFee = totalPrice >= 1000000 || totalPrice === 0 ? 0 : 35000;
  const finalTotal = Math.max(0, totalPrice + shippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'WELCOME10') {
      const discount = Math.round(totalPrice * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else if (code === 'SALE50K') {
      setDiscountAmount(50000);
      setCouponApplied(true);
    } else if (code === 'FREESHIP') {
      setDiscountAmount(shippingFee);
      setCouponApplied(true);
    } else {
      setCouponError('Mã khuyến mãi không hợp lệ hoặc đã hết hạn.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center my-8 text-gray-500 text-sm">
        Đang tải thông tin giỏ hàng...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 text-center my-6 max-w-lg mx-auto border border-gray-100 shadow-sm space-y-4">
        <div className="w-20 h-20 bg-orange-50 text-[#f53d2d] rounded-full flex items-center justify-center mx-auto text-4xl">
          <AiOutlineShoppingCart />
        </div>
        <h2 className="text-base sm:text-xl font-bold text-gray-800">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Hãy khám phá các thiết bị gia dụng nhà bếp và đời sống chính hãng với nhiều ưu đãi hấp dẫn.
        </p>
        <Link
          href="/san-pham"
          className="inline-block bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition shadow active:scale-95"
        >
          Khám phá sản phẩm ngay
        </Link>
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
        <span className="text-gray-800 font-semibold">Giỏ hàng của bạn ({totalCount})</span>
      </nav>

      {/* Main Grid: Cart Items (Col 8) + Summary (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h1 className="text-base sm:text-lg font-black text-gray-900 uppercase">
              Giỏ Hàng ({totalCount} sản phẩm)
            </h1>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 font-semibold"
            >
              <AiOutlineDelete /> Xóa toàn bộ
            </button>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-100">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                {/* Image and Title */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Link href={`/san-pham/${product.slug}`} className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-gray-100"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-orange-600 block">
                      {product.brand}
                    </span>
                    <Link
                      href={`/san-pham/${product.slug}`}
                      className="text-xs sm:text-sm font-bold text-gray-800 hover:text-[#f53d2d] line-clamp-2 transition"
                    >
                      {product.title}
                    </Link>
                    <span className="text-xs font-bold text-[#f53d2d] block sm:hidden mt-1">
                      {formatVND(product.price)}
                    </span>
                  </div>
                </div>

                {/* Price, Controls & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="hidden sm:block text-right">
                    <span className="text-sm font-black text-gray-900 block">
                      {formatVND(product.price * quantity)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatVND(product.price)} / chiếc
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 sm:p-2 hover:bg-gray-200 text-gray-600"
                      aria-label="Giảm"
                    >
                      <BiMinus className="text-xs" />
                    </button>
                    <span className="px-2.5 sm:px-3 text-xs font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 sm:p-2 hover:bg-gray-200 text-gray-600"
                      aria-label="Tăng"
                    >
                      <BiPlus className="text-xs" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                    aria-label="Xóa sản phẩm"
                  >
                    <AiOutlineDelete className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-1.5 text-xs text-orange-600 font-bold hover:underline"
            >
              <AiOutlineArrowLeft /> Tiếp tục chọn thêm sản phẩm khác
            </Link>
          </div>
        </div>

        {/* Order Summary (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Coupon Code Input */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Mã giảm giá / Voucher
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã (vd: WELCOME10, SALE50K)"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs uppercase placeholder:normal-case focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold transition active:scale-95"
              >
                Áp dụng
              </button>
            </form>
            {couponApplied && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <AiOutlineCheckCircle /> Áp dụng thành công mã {couponCode.toUpperCase()}!
              </p>
            )}
            {couponError && (
              <p className="text-xs text-red-500 font-semibold">{couponError}</p>
            )}
          </div>

          {/* Pricing Calculation Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase pb-2 border-b border-gray-100">
              Chi Tiết Đơn Hàng
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-bold text-gray-900">{formatVND(totalPrice)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Miễn phí giao hàng</span>
                  ) : (
                    <span className="font-bold text-gray-900">{formatVND(shippingFee)}</span>
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá voucher:</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-gray-900 block">Tổng thanh toán:</span>
                  <span className="text-[10px] text-gray-400">(Đã bao gồm thuế VAT)</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-[#f53d2d]">
                  {formatVND(finalTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/thanh-toan"
              className="w-full py-3.5 bg-gradient-to-r from-[#f53d2d] to-[#ff6633] hover:from-[#e03122] hover:to-[#f53d2d] text-white font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 active:scale-95 text-center"
            >
              Tiến hành thanh toán ngay &rarr;
            </Link>

            {/* Guarantee reminder */}
            <div className="pt-2 text-[11px] text-gray-500 space-y-1">
              <p className="flex items-center gap-1.5 text-gray-700">
                <BiShieldQuarter className="text-emerald-600 text-sm" />
                <span>Bảo mật thanh toán & thông tin 100%</span>
              </p>
              <p>Hỗ trợ kiểm tra hàng thoải mái trước khi thanh toán</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
