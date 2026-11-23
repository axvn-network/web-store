'use client';

import React from 'react';
import Link from 'next/link';
import { BiHomeAlt, BiChevronRight, BiCar, BiTimeFive, BiCheckShield } from 'react-icons/bi';

export default function ShippingPolicyPage() {
  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Chính sách giao hàng</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
            Vận chuyển chuyên nghiệp 63 tỉnh thành
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Chính Sách Giao Hàng & Biểu Phí Vận Chuyển
          </h1>
          <p className="text-xs text-gray-500 mt-1">Đồng hành cùng Giao Hàng Nhanh, Viettel Post, Ninja Van, J&T Express</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BiTimeFive className="text-blue-600 text-xl" />
            1. Thời Gian Giao Hàng Dự Kiến
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Nội thành Hà Nội & TP. Hồ Chí Minh:</strong> Giao nhanh trong 2 - 6 giờ hoặc trong ngày.</li>
            <li><strong>Các tỉnh thành miền Bắc, Trung, Nam:</strong> Giao trong 24h - 48h.</li>
            <li><strong>Khu vực huyện xã xa xôi / hải đảo:</strong> Giao trong 3 - 4 ngày làm việc.</li>
          </ul>

          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mt-6">
            <BiCar className="text-blue-600 text-xl" />
            2. Biểu Phí Vận Chuyển
          </h2>
          <p>
            <strong>Miễn phí vận chuyển (Freeship):</strong> Áp dụng cho tất cả đơn hàng có giá trị từ <strong>500.000 ₫</strong> trở lên trên toàn quốc. Các đơn hàng dưới 500.000 ₫ tính phí đồng giá 30.000 ₫.
          </p>

          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mt-6">
            <BiCheckShield className="text-blue-600 text-xl" />
            3. Đồng Kiểm Khi Nhận Hàng
          </h2>
          <p>
            Khách hàng được quyền <strong>mở hộp đồng kiểm hàng hóa</strong> trước mặt bưu tá (kiểm tra ngoại quan, linh kiện phụ kiện, tem niêm phong) trước khi thanh toán tiền mặt (COD).
          </p>
        </div>
      </div>
    </div>
  );
}
