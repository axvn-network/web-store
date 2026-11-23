'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiPercent,
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiInfo,
  FiArrowRight,
} from 'react-icons/fi';

export default function HoaHongPage() {
  const tiers = [
    { name: 'Hạng Đồng (Bronze)', rate: '5%', minRevenue: '0 - 20.000.000 ₫', desc: 'Mức khởi điểm cho mọi CTV mới gia nhập', current: false },
    { name: 'Hạng Bạc (Silver)', rate: '7%', minRevenue: '20.000.000 - 50.000.000 ₫', desc: 'Mức hiện tại của bạn (Doanh số: 42.5M ₫)', current: true },
    { name: 'Hạng Vàng (Gold VIP)', rate: '10%', minRevenue: 'Trên 50.000.000 ₫', desc: 'Đặc quyền hoa hồng cao nhất + thưởng quý', current: false },
  ];

  return (
    <div className="space-y-6">
      {/* 3 Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Tổng hoa hồng trọn đời</span>
          <span className="text-2xl font-black text-gray-900 mt-1 block">3.255.800 ₫</span>
          <span className="text-[11px] text-gray-400 mt-1 block">Từ 18 đơn hàng phát sinh</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Đã thanh toán về tài khoản</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">415.800 ₫</span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Đã đối soát kỳ trước</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Khả dụng có thể rút ngay</span>
          <span className="text-2xl font-black text-[#f53d2d] mt-1 block">2.840.000 ₫</span>
          <Link
            href="/cong-tac-vien/rut-tien"
            className="text-[11px] font-bold text-[#f53d2d] hover:underline mt-1 inline-block"
          >
            Yêu cầu chuyển khoản &rarr;
          </Link>
        </div>
      </div>

      {/* Tier Structure */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-lg">
            <FiAward />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900">Bảng phân cấp bậc hoa hồng</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Càng đạt doanh số bán hàng cao, tỉ lệ phần trăm hoa hồng của bạn càng lớn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition ${
                t.current
                  ? 'border-orange-300 bg-orange-50/40 ring-2 ring-[#f53d2d] shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-700">{t.name}</span>
                  {t.current && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#f53d2d] text-white">
                      Cấp hiện tại
                    </span>
                  )}
                </div>
                <div className="text-3xl font-black text-[#f53d2d] mb-2">{t.rate}</div>
                <span className="text-xs font-semibold text-gray-800 block mb-1">
                  Mốc doanh số: {t.minRevenue}
                </span>
                <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
              </div>

              {t.current && (
                <div className="mt-6 pt-4 border-t border-orange-200">
                  <span className="text-[11px] text-[#f53d2d] font-bold block">
                    Tiến độ thăng hạng Vàng: 85%
                  </span>
                  <div className="h-1.5 w-full bg-orange-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-[#f53d2d] to-[#ff6633] rounded-full w-[85%]" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payout Schedule Policy */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-lg">
            <FiCalendar />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-900">Quy định và Lịch đối soát thanh toán</h3>
            <p className="text-xs text-gray-400 mt-0.5">Minh bạch, đúng hạn, không giữ hoa hồng vô lý</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs text-gray-600">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <FiCheckCircle className="text-[#f53d2d]" />
              <span>Kỳ chi trả định kỳ 2 lần/tháng</span>
            </h4>
            <p className="leading-relaxed">
              BetaShop tự động đối soát và chi trả hoa hồng vào <strong>ngày 15</strong> (cho các đơn hoàn tất từ ngày 01 đến 15) và <strong>ngày 30</strong> (cho các đơn hoàn tất từ ngày 16 đến cuối tháng).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <FiCheckCircle className="text-[#f53d2d]" />
              <span>Hạn mức rút tiền tối thiểu</span>
            </h4>
            <p className="leading-relaxed">
              Bạn có thể tạo yêu cầu rút tiền bất cứ lúc nào khi số dư khả dụng đạt tối thiểu <strong>200.000 ₫</strong>. Miễn 100% phí chuyển khoản về tài khoản ngân hàng Napas 247 hoặc Ví MoMo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
