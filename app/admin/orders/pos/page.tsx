'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Store,
  Search,
  Barcode,
  Trash2,
  Plus,
  Minus,
  Printer,
  CreditCard,
  QrCode,
  DollarSign,
  User,
  ArrowLeft,
  CheckCircle2,
  Boxes,
  RotateCcw,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { Product } from '@/data/storeData';
import { Customer } from '@/lib/adminDb';

interface PosCartItem {
  product: Product;
  quantity: number;
}

export default function PosTerminalPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('Khách Vãng Lai (Mua tại quầy)');
  const [customerPhone, setCustomerPhone] = useState('0912 345 678');
  const [selectedWarehouse, setSelectedWarehouse] = useState('wh-01');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'VIETQR' | 'CARD' | 'MOMO'>('CASH');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [receiptOrder, setReceiptOrder] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data.products || []);
          setCustomers(res.data.customers || []);
        }
      });
  }, []);

  // Quick Add by Barcode or click
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => String(item.product.id) === String(product.id));
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string | number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (String(item.product.id) === String(productId)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[];
    });
  };

  const removeItem = (productId: string | number) => {
    setCart((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
  };

  const clearCart = () => setCart([]);

  // Price calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const changeReturned = Math.max(0, (amountReceived || 0) - finalTotal);

  useEffect(() => {
    setAmountReceived(finalTotal);
  }, [finalTotal]);

  // Handle Checkout POS
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm vào giỏ POS!');
      return;
    }

    const payload = {
      orderType: 'POS',
      customerName: selectedCustomer,
      phone: customerPhone,
      address: 'Mua trực tiếp tại Showroom Cầu Giấy (Tổng Kho Hà Nội)',
      warehouseId: selectedWarehouse,
      items: cart.map((c) => ({
        productId: c.product.id,
        title: c.product.title,
        price: c.product.price,
        quantity: c.quantity,
        image: c.product.image,
      })),
      totalAmount: subtotal,
      discountAmount,
      shippingFee: 0,
      finalTotal,
      paymentMethod,
      paymentStatus: 'PAID',
      amountReceived,
      changeReturned,
      staffName: 'Trần Thu Ngân (Thu ngân POS)',
    };

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_order', payload }),
    });

    const result = await res.json();
    if (result.success && result.data) {
      setReceiptOrder(result.data);
      clearCart();
      setToast('Thanh toán đơn hàng POS thành công! Đã tự động trừ kho.');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* POS Top Control */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-400" />
              <span>Màn Hình Bán Hàng Tại Quầy (POS Terminal)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Thu ngân: <strong>Trần Thu Ngân</strong> • Chi nhánh xuất kho: <strong>Kho Hà Nội</strong>
            </p>
          </div>
        </div>

        {/* Barcode scanner input */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Barcode className="w-4 h-4 absolute left-3 top-2.5 text-emerald-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Quét mã Barcode hoặc gõ tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg"
              title="Xóa giỏ hàng"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main 2-column POS workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Product Selection Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Category Quick Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === c
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {c === 'all' ? 'Tất Cả' : c}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar pr-1">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/60 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition active:scale-95 group"
              >
                <div className="w-full aspect-square bg-slate-950 rounded-lg overflow-hidden mb-2 flex items-center justify-center p-2 relative">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                  />
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-slate-300 text-[9px] font-mono">
                    Tồn: {p.stock || 20}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition">
                    {p.title}
                  </h4>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs font-black text-emerald-400">
                      {formatVND(p.price)}
                    </span>
                    <span className="text-[10px] text-slate-500">{p.brand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart & Fast Checkout (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
          {/* Customer Selection */}
          <div className="space-y-2 border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Khách Hàng Mua:</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">Khách lẻ tại quầy</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                placeholder="Tên khách hàng"
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Số điện thoại"
                className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto max-h-64 divide-y divide-slate-800/80 pr-1 space-y-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Chưa có sản phẩm nào trong giỏ POS.
                <p className="text-[11px] mt-1 text-slate-600">Nhấp vào sản phẩm hoặc quét mã vạch để thêm.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.product.title}</h5>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      {formatVND(item.product.price)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-white w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="p-1 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Payment & Totals */}
          <div className="border-t border-slate-800 pt-3 space-y-3">
            {/* Payment method selector */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-1.5">
                Hình Thức Thanh Toán
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-1.5 rounded-lg border transition ${
                    paymentMethod === 'CASH'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Tiền Mặt
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('VIETQR')}
                  className={`py-1.5 rounded-lg border transition ${
                    paymentMethod === 'VIETQR'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  VietQR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`py-1.5 rounded-lg border transition ${
                    paymentMethod === 'CARD'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Quẹt Thẻ
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MOMO')}
                  className={`py-1.5 rounded-lg border transition ${
                    paymentMethod === 'MOMO'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Ví MoMo
                </button>
              </div>
            </div>

            {/* Calculations summary */}
            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span>Tổng tiền hàng:</span>
                <span className="font-bold text-white">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Chiết khấu (%):</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-16 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-right text-xs text-white"
                />
              </div>
              <div className="flex justify-between text-sm font-black border-t border-slate-800 pt-1 text-emerald-400">
                <span>Khách phải trả:</span>
                <span>{formatVND(finalTotal)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
                <span>Tiền khách đưa:</span>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number(e.target.value))}
                  className="w-32 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-xs font-bold text-emerald-400"
                />
              </div>
              <div className="flex justify-between font-bold text-amber-400">
                <span>Tiền thối lại khách:</span>
                <span>{formatVND(changeReturned)}</span>
              </div>
            </div>

            {/* Big Action Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition active:scale-95 disabled:opacity-40"
            >
              THANH TOÁN & IN HÓA ĐƠN ({formatVND(finalTotal)})
            </button>
          </div>
        </div>
      </div>

      {/* 80mm Thermal Receipt Print Modal */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="text-center border-b pb-3 space-y-0.5">
              <h2 className="font-black text-base">BETASHOP GIA DỤNG</h2>
              <p className="text-[11px] text-gray-600">ĐC: 18 Phạm Hùng, Cầu Giấy, HN</p>
              <p className="text-[11px] text-gray-600">Hotline: 1900 8237</p>
              <h3 className="font-bold text-xs uppercase pt-1">HÓA ĐƠN THANH TOÁN (K80)</h3>
              <p className="text-[10px] text-gray-500">Mã: #{receiptOrder.code}</p>
              <p className="text-[10px] text-gray-500">Ngày: {receiptOrder.createdAt}</p>
            </div>

            <div className="text-[11px] space-y-0.5">
              <p>Khách: <strong>{receiptOrder.customerName}</strong></p>
              <p>SĐT: <strong>{receiptOrder.phone}</strong></p>
              <p>Thu ngân: <strong>{receiptOrder.staffName}</strong></p>
            </div>

            <div className="border-t border-b py-2 space-y-1.5">
              {receiptOrder.items?.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <div className="truncate max-w-[180px]">
                    {it.title}
                    <div className="text-[10px] text-gray-500">
                      {it.quantity} x {formatVND(it.price)}
                    </div>
                  </div>
                  <div className="font-bold">{formatVND(it.price * it.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right text-[11px]">
              <div className="flex justify-between">
                <span>Tổng tiền hàng:</span>
                <span>{formatVND(receiptOrder.totalAmount)}</span>
              </div>
              {receiptOrder.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Giảm giá:</span>
                  <span>-{formatVND(receiptOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black border-t pt-1">
                <span>THANH TOÁN:</span>
                <span>{formatVND(receiptOrder.finalTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tiền khách đưa:</span>
                <span>{formatVND(receiptOrder.amountReceived || receiptOrder.finalTotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-700">
                <span>Tiền thối:</span>
                <span>{formatVND(receiptOrder.changeReturned || 0)}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-500 border-t pt-3">
              <p>Cảm ơn quý khách đã mua sắm tại Betashop!</p>
              <p>Bảo hành chính hãng 12-36 tháng theo hóa đơn.</p>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setReceiptOrder(null)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Nhiệt 80mm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
