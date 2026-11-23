'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BiPhoneCall, 
  BiMapPin, 
  BiEnvelope, 
  BiShieldQuarter,
  BiRefresh,
  BiCar
} from 'react-icons/bi';
import { STORE_FOOTER_CONTENT } from '@/data/storeData';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12 text-gray-700 pb-20 lg:pb-8">
      {/* Commitment Bar */}
      <div className="bg-[#fff7ed] border-b border-orange-100 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-orange-100 text-[#f53d2d] rounded-xl flex-shrink-0">
              <BiCar className="text-xl sm:text-2xl" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Giao Hàng Toàn Quốc</h4>
              <p className="text-[11px] text-gray-500">Nhanh chóng 24 - 48h</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-orange-100 text-[#f53d2d] rounded-xl flex-shrink-0">
              <BiRefresh className="text-xl sm:text-2xl" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Đổi Trả 30 Ngày</h4>
              <p className="text-[11px] text-gray-500">Lỗi 1 đổi 1 tận nhà</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-orange-100 text-[#f53d2d] rounded-xl flex-shrink-0">
              <BiShieldQuarter className="text-xl sm:text-2xl" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">100% Chính Hãng</h4>
              <p className="text-[11px] text-gray-500">Bảo hành điện tử 12-36T</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-orange-100 text-[#f53d2d] rounded-xl flex-shrink-0">
              <BiPhoneCall className="text-xl sm:text-2xl" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Hotline 1900 8237</h4>
              <p className="text-[11px] text-gray-500">Tư vấn miễn phí 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <span className="bg-[#f53d2d] text-white font-black text-xl px-2.5 py-1 rounded shadow-sm">
                BETASHOP
              </span>
              <span className="block text-xs font-bold text-gray-800 mt-1 uppercase tracking-wider">
                Hệ Thống Tổng Kho Đồ Gia Dụng Việt Nam
              </span>
            </Link>
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              Chuyên phân phối sỉ & lẻ đồ gia dụng nhà bếp, robot hút bụi, máy lọc không khí và thiết bị gia đình chính hãng giá tại kho.
            </p>

            <div className="space-y-1.5 text-xs text-gray-600">
              <p className="flex items-start gap-2">
                <BiMapPin className="text-base text-[#f53d2d] flex-shrink-0 mt-0.5" />
                <span>Số 128 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội</span>
              </p>
              <p className="flex items-center gap-2">
                <BiPhoneCall className="text-base text-[#f53d2d] flex-shrink-0" />
                <span>1900 8237 – (024) 7300 8237</span>
              </p>
              <p className="flex items-center gap-2">
                <BiEnvelope className="text-base text-[#f53d2d] flex-shrink-0" />
                <span>cskh@betashop.vn</span>
              </p>
            </div>
          </div>

          {/* Links Columns */}
          {STORE_FOOTER_CONTENT.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 border-l-2 border-[#f53d2d] pl-2 uppercase tracking-wide">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.children.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href={item.slug}
                      className="text-gray-600 hover:text-[#f53d2d] transition"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Payment Methods and Certification */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            <span className="font-semibold text-gray-700 block sm:inline mr-2">Phương thức thanh toán:</span>
            <div className="inline-flex items-center gap-2 mt-1 sm:mt-0 flex-wrap">
              <span className="bg-gray-100 px-2 py-1 rounded font-bold text-[10px] text-gray-700">VietQR</span>
              <span className="bg-gray-100 px-2 py-1 rounded font-bold text-[10px] text-gray-700">Napas 247</span>
              <span className="bg-gray-100 px-2 py-1 rounded font-bold text-[10px] text-gray-700">COD (Tiền mặt)</span>
              <span className="bg-gray-100 px-2 py-1 rounded font-bold text-[10px] text-gray-700">Visa / Master</span>
              <span className="bg-gray-100 px-2 py-1 rounded font-bold text-[10px] text-gray-700">Ví MoMo</span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Betashop.vn. Bảo lưu mọi quyền.</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Website thương mại điện tử chuyên đồ gia dụng chuẩn Responsive</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
