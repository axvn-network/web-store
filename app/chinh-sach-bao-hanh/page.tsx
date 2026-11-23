'use client';

import React from 'react';
import Link from 'next/link';
import { BiHomeAlt, BiChevronRight, BiShieldQuarter, BiCheckCircle, BiRefresh, BiPhoneCall } from 'react-icons/bi';

export default function WarrantyPolicyPage() {
  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Chính sách bảo hành & Đổi trả</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full uppercase tracking-wider">
            Bảo hành điện tử chính hãng
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Chính Sách Bảo Hành & Đổi Mới 1:1 Tại Betashop
          </h1>
          <p className="text-xs text-gray-500 mt-1">Cập nhật lần cuối: Tháng 11/2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BiShieldQuarter className="text-orange-600 text-xl" />
            1. Thời Gian & Quy Định Bảo Hành
          </h2>
          <p>
            Mọi sản phẩm gia dụng (nồi chiên không dầu, bếp từ, robot hút bụi, máy xay sinh tố, nồi cơm điện...) mua tại Betashop đều được bảo hành chính hãng từ <strong>12 đến 36 tháng</strong> theo tiêu chuẩn nhà sản xuất (Philips, Panasonic, Cuckoo, Sunhouse, Dreame, Xiaomi, Lock&Lock, Tefal...).
          </p>

          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mt-6">
            <BiRefresh className="text-orange-600 text-xl" />
            2. Chính Sách Đổi Mới 1:1 Trong 30 Ngày
          </h2>
          <p>
            Trong vòng <strong>30 ngày</strong> kể từ ngày nhận hàng, nếu sản phẩm phát sinh lỗi kỹ thuật từ nhà sản xuất, khách hàng được đổi ngay sản phẩm mới 100% hoàn toàn miễn phí, có nhân viên hoặc đơn vị vận chuyển thu hồi và giao máy mới tận nơi.
          </p>

          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mt-6">
            <BiCheckCircle className="text-orange-600 text-xl" />
            3. Điều Kiện Được Bảo Hành Miễn Phí
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li>Sản phẩm còn trong thời hạn bảo hành căn cứ theo Số điện thoại mua hàng hoặc Phiếu bảo hành / Hóa đơn điện tử.</li>
            <li>Tem niêm phong, số seri sản phẩm còn nguyên vẹn, không bị cạo sửa, tẩy xóa.</li>
            <li>Hư hỏng do chất lượng linh kiện hoặc lỗi quy trình sản xuất của hãng.</li>
          </ul>

          <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-4 flex items-center justify-between gap-4 mt-6">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Cần hỗ trợ bảo hành nhanh?</h3>
              <p className="text-xs text-gray-600">Liên hệ tổng đài bảo hành & kỹ thuật Betashop (8h00 - 21h30)</p>
            </div>
            <a
              href="tel:19008237"
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-lg hover:bg-orange-700 transition"
            >
              <BiPhoneCall className="text-base" />
              <span>1900 8237</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
