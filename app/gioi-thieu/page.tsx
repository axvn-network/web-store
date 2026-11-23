'use client';

import React from 'react';
import Link from 'next/link';
import { BiHomeAlt, BiChevronRight } from 'react-icons/bi';

export default function AboutPage() {
  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Giới thiệu về Betashop</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full uppercase tracking-wider">
            Uy tín hàng đầu Việt Nam
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Về Hệ Thống Tổng Kho Đồ Gia Dụng Betashop
          </h1>
          <p className="text-xs text-gray-500 mt-1">Đồng hành cùng hơn 500.000 gia đình Việt từ năm 2018</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>Công ty Cổ phần Betashop Việt Nam</strong> là chuỗi tổng kho và hệ thống bán lẻ thiết bị gia dụng nhà bếp, tiện ích thông minh hàng đầu tại Việt Nam. Với sứ mệnh mang lại cuộc sống tiện nghi, an toàn và hiện đại cho mọi gia đình, Betashop cam kết 100% sản phẩm là hàng chính hãng từ các thương hiệu danh tiếng quốc tế và nội địa: <strong>Philips, Panasonic, Cuckoo, Sunhouse, Dreame, Xiaomi, Lock&Lock, Tefal, Sharp, Dyson, Elmich, Hurom</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 text-center space-y-1">
              <span className="text-2xl font-black text-orange-600">500.000+</span>
              <p className="text-xs font-bold text-gray-900">Khách Hàng Tin Cậy</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-center space-y-1">
              <span className="text-2xl font-black text-blue-600">100%</span>
              <p className="text-xs font-bold text-gray-900">Sản Phẩm Chính Hãng</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center space-y-1">
              <span className="text-2xl font-black text-emerald-600">63 Tỉnh Thành</span>
              <p className="text-xs font-bold text-gray-900">Giao Hàng Tận Nhà</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
