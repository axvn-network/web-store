'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiMousePointer,
  FiShoppingBag,
  FiTrendingUp,
  FiDollarSign,
  FiCopy,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi';

export default function TongQuanCTVPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://betashop-store.netlify.app/?ref=GIADUNGVIP';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recentOrders = [
    { id: 'ref-1', code: '#ORD-2026-9812', product: 'Nồi chiên không dầu Philips 4.1L', total: 2490000, rate: '7%', commission: 174300, status: 'approved', time: '14/11/2026' },
    { id: 'ref-2', code: '#ORD-2026-9705', product: 'Robot hút bụi Dreame L10s Ultra', total: 10010000, rate: '7%', commission: 700700, status: 'approved', time: '11/11/2026' },
    { id: 'ref-3', code: '#ORD-2026-9540', product: 'Máy lọc không khí Xiaomi 4 Pro', total: 4690000, rate: '7%', commission: 328300, status: 'approved', time: '07/11/2026' },
    { id: 'ref-4', code: '#ORD-2026-9411', product: 'Bàn là hơi nước đứng Tefal', total: 1850000, rate: '7%', commission: 129500, status: 'pending', time: '05/11/2026' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Share Link Banner */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase text-[#f53d2d] tracking-wider">
            Link giới thiệu mặc định của bạn
          </span>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-xs sm:text-sm font-mono font-bold text-gray-800 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
              {referralLink}
            </code>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold text-xs shadow-sm transition active:scale-95"
          >
            {copied ? (
              <>
                <FiCheck className="text-white" />
                <span>Đã sao chép</span>
              </>
            ) : (
              <>
                <FiCopy />
                <span>Sao chép link</span>
              </>
            )}
          </button>
          <Link
            href="/cong-tac-vien/link-gioi-thieu"
            className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition"
          >
            Tạo link sản phẩm riêng
          </Link>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">
            <FiMousePointer />
          </div>
          <span className="text-xs text-gray-500 font-medium block">Số lượt Click</span>
          <span className="text-2xl font-black text-gray-900 tracking-tight mt-0.5 block">
            1.240
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            +18% so với tuần trước
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#f53d2d] flex items-center justify-center text-lg mb-3">
            <FiShoppingBag />
          </div>
          <span className="text-xs text-gray-500 font-medium block">Đơn hoàn tất</span>
          <span className="text-2xl font-black text-gray-900 tracking-tight mt-0.5 block">
            18 Đơn
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            Tỉ lệ chuyển đổi: 1.45%
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
            <FiTrendingUp />
          </div>
          <span className="text-xs text-gray-500 font-medium block">Doanh thu giới thiệu</span>
          <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5 block">
            42.500.000 ₫
          </span>
          <span className="text-[11px] text-gray-500 font-medium mt-1 block">
            Mức chiết khấu: 7%
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-[#f53d2d] flex items-center justify-center text-lg mb-3">
            <FiDollarSign />
          </div>
          <span className="text-xs text-gray-500 font-medium block">Hoa hồng khả dụng</span>
          <span className="text-xl sm:text-2xl font-black text-[#f53d2d] tracking-tight mt-0.5 block">
            2.840.000 ₫
          </span>
          <Link
            href="/cong-tac-vien/rut-tien"
            className="text-[11px] text-[#f53d2d] font-bold hover:underline mt-1 inline-block"
          >
            Yêu cầu rút tiền &rarr;
          </Link>
        </div>
      </div>

      {/* Revenue Chart & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">Biểu đồ doanh số 7 ngày gần nhất</h3>
              <p className="text-xs text-gray-400">Đơn vị tính: Triệu VNĐ</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Tăng trưởng ổn định
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between gap-2 h-44 pt-4 px-2">
            {[
              { day: 'T2', val: 3.2, h: '40%' },
              { day: 'T3', val: 4.8, h: '55%' },
              { day: 'T4', val: 2.1, h: '30%' },
              { day: 'T5', val: 6.5, h: '75%' },
              { day: 'T6', val: 8.9, h: '95%' },
              { day: 'T7', val: 7.4, h: '85%' },
              { day: 'CN', val: 9.6, h: '100%' },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition">
                  {col.val}M
                </span>
                <div className="w-full bg-orange-50 rounded-t-lg overflow-hidden h-32 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-[#f53d2d] to-[#ff7744] rounded-t-lg group-hover:brightness-110 transition-all duration-300"
                    style={{ height: col.h }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1">Cấp bậc CTV hiện tại</h3>
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-md border border-amber-200">
              Hạng Bạc (7% Hoa hồng)
            </span>

            <div className="mt-6 space-y-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Doanh thu tích lũy:</span>
                <strong className="text-gray-900">42.500.000 ₫</strong>
              </div>
              <div className="flex justify-between">
                <span>Mục tiêu Hạng Vàng:</span>
                <strong className="text-[#f53d2d]">50.000.000 ₫</strong>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#f53d2d] rounded-full w-[85%]" />
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Chỉ cần thêm <strong>7.500.000 ₫</strong> doanh số để nâng mức hoa hồng lên <strong>10%</strong> trọn đời!
              </p>
            </div>
          </div>

          <Link
            href="/cong-tac-vien/hoa-hong"
            className="w-full py-2.5 bg-gray-50 hover:bg-orange-50 hover:text-[#f53d2d] text-gray-700 text-xs font-bold rounded-xl text-center border border-gray-200 transition mt-6 block"
          >
            Xem chính sách hoa hồng &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Referral Orders Table */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900">Đơn hàng giới thiệu mới nhất</h3>
            <p className="text-xs text-gray-400 mt-0.5">Hoa hồng được ghi nhận tự động khi khách đặt qua link của bạn</p>
          </div>
          <Link
            href="/cong-tac-vien/don-hang-gioi-thieu"
            className="text-xs font-bold text-[#f53d2d] hover:text-[#e03122] flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Mã đơn</th>
                <th className="py-3 px-3">Sản phẩm</th>
                <th className="py-3 px-3">Giá trị đơn</th>
                <th className="py-3 px-3">Tỉ lệ</th>
                <th className="py-3 px-3">Hoa hồng</th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-3">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-gray-800">{ord.code}</td>
                  <td className="py-3 px-3 font-medium text-gray-900 max-w-[200px] truncate">{ord.product}</td>
                  <td className="py-3 px-3 font-semibold text-gray-800">{ord.total.toLocaleString('vi-VN')} ₫</td>
                  <td className="py-3 px-3 font-bold text-[#f53d2d]">{ord.rate}</td>
                  <td className="py-3 px-3 font-black text-emerald-600">+{ord.commission.toLocaleString('vi-VN')} ₫</td>
                  <td className="py-3 px-3">
                    {ord.status === 'approved' ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[10px]">
                        Đã duyệt
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded border border-amber-200 text-[10px]">
                        Chờ giao hàng
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-400">{ord.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
