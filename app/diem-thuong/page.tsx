'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/lib/customerContext';
import {
  FiAward,
  FiGift,
  FiTrendingUp,
  FiChevronRight,
  FiCheck,
  FiClock,
  FiShield,
  FiTag,
} from 'react-icons/fi';

export default function DiemThuongPage() {
  const { user, updateUser } = useCustomer();
  const [points, setPoints] = useState(user?.points || 1250);
  const [redeemedVoucher, setRedeemedVoucher] = useState<string | null>(null);

  const history = [
    { id: 'h-1', title: 'Tích điểm đơn hàng #ORD-2026-9812', change: '+249', time: '14/11/2026', type: 'plus' },
    { id: 'h-2', title: 'Đánh giá sản phẩm Nồi chiên không dầu', change: '+50', time: '14/11/2026', type: 'plus' },
    { id: 'h-3', title: 'Đổi Voucher Giảm Giá 50.000₫', change: '-500', time: '10/11/2026', type: 'minus' },
    { id: 'h-4', title: 'Tích điểm đơn hàng #ORD-2026-8741', change: '+1001', time: '02/11/2026', type: 'plus' },
    { id: 'h-5', title: 'Thưởng đăng ký thành viên mới', change: '+100', time: '01/10/2026', type: 'plus' },
  ];

  const redeemOptions = [
    { id: 'rd-1', cost: 200, title: 'Voucher Giảm 20.000₫', minOrder: 'Đơn từ 200.000₫', code: 'POINT20K' },
    { id: 'rd-2', cost: 500, title: 'Voucher Giảm 50.000₫', minOrder: 'Đơn từ 500.000₫', code: 'POINT50K' },
    { id: 'rd-3', cost: 1000, title: 'Voucher Giảm 100.000₫', minOrder: 'Đơn từ 1.000.000₫', code: 'POINT100K' },
  ];

  const handleRedeem = (opt: typeof redeemOptions[0]) => {
    if (points < opt.cost) {
      alert('Bạn không đủ điểm thưởng để đổi voucher này.');
      return;
    }
    const newPoints = points - opt.cost;
    setPoints(newPoints);
    updateUser({ points: newPoints });
    setRedeemedVoucher(opt.code);
    alert(`Đổi thành công voucher ${opt.title}! Mã giảm giá: ${opt.code}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#f53d2d] transition">
            Trang chủ
          </Link>
          <FiChevronRight />
          <Link href="/tai-khoan" className="hover:text-[#f53d2d] transition">
            Tài khoản
          </Link>
          <FiChevronRight />
          <span className="text-gray-800 font-medium">Điểm thưởng thành viên</span>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[#f53d2d] via-[#ff5522] to-[#ff7744] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-200">
                BetaShop Rewards Club
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                {points.toLocaleString('vi-VN')}{' '}
                <span className="text-xl sm:text-2xl font-bold text-yellow-300">Điểm</span>
              </h1>
              <p className="text-xs sm:text-sm text-orange-100 mt-2">
                Tương đương <strong className="text-white">{(points * 100).toLocaleString('vi-VN')} ₫</strong> giảm trực tiếp vào giỏ hàng tiếp theo
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-start sm:self-auto text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-yellow-300 font-bold">
                <FiShield className="text-base text-yellow-300" />
                <span>Hạng Vàng (Gold Member)</span>
              </div>
              <p className="text-orange-100">
                Tích 1% mọi đơn hàng • Tặng quà sinh nhật • Miễn phí vận chuyển
              </p>
            </div>
          </div>
        </div>

        {/* Redeem Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3.5 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-2xl shrink-0">
              <FiGift />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Đổi điểm lấy Voucher</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Dùng điểm thưởng tích lũy để đổi các mã giảm giá áp dụng ngay khi thanh toán
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {redeemOptions.map((opt) => (
              <div
                key={opt.id}
                className="p-5 rounded-2xl border border-orange-100 bg-orange-50/20 hover:border-orange-300 transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-black text-[#f53d2d] uppercase tracking-wider block">
                    {opt.cost} Điểm thưởng
                  </span>
                  <h4 className="text-base font-bold text-gray-900 mt-1">{opt.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{opt.minOrder}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-orange-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                    {opt.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRedeem(opt)}
                    className="px-4 py-2 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow-sm transition"
                  >
                    Đổi mã
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <FiClock className="text-xl text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Lịch sử tích & đổi điểm</h2>
          </div>

          <div className="divide-y divide-gray-100 mt-4">
            {history.map((h) => (
              <div key={h.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{h.title}</h4>
                  <span className="text-xs text-gray-400 mt-0.5 block">{h.time}</span>
                </div>
                <span
                  className={`text-sm font-extrabold ${
                    h.type === 'plus' ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {h.change} Điểm
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
