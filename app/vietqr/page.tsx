'use client';

import React from 'react';
import Link from 'next/link';
import { BiHomeAlt, BiChevronRight, BiQr, BiCheckCircle, BiShieldQuarter, BiCopy } from 'react-icons/bi';

export default function VietQRGuidePage() {
  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Thanh toán VietQR</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Chuyển khoản nhanh 24/7 Napas 247
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Hướng Dẫn Thanh Toán Qua Mã VietQR Chuẩn Quốc Gia
          </h1>
          <p className="text-xs text-gray-500 mt-1">Hỗ trợ tất cả ứng dụng ngân hàng và ví điện tử tại Việt Nam</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BiQr className="text-emerald-600 text-xl" />
              Lợi Ích Khi Quét Mã VietQR
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Chính xác 100%:</strong> Tự động điền số tài khoản, tên người thụ hưởng và số tiền chính xác từng đồng.</li>
              <li><strong>Tức thì 24/7:</strong> Tiền vào tài khoản chỉ sau 2 giây kể cả ban đêm, thứ 7 và chủ nhật.</li>
              <li><strong>Hoàn toàn miễn phí:</strong> Không phát sinh thêm bất kỳ chi phí chuyển khoản nào.</li>
            </ul>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Tài khoản chính thức Betashop</div>
            <div>
              <span className="text-slate-400 block text-[10px]">Ngân hàng:</span>
              <span className="font-bold text-white text-sm">Vietcombank (Chi nhánh Thăng Long, Hà Nội)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Số tài khoản:</span>
              <span className="font-bold text-emerald-400 text-base">9999 8888 6666</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Chủ tài khoản:</span>
              <span className="font-bold text-white">CONG TY CO PHAN BETASHOP VIET NAM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
