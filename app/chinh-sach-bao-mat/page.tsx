'use client';

import React from 'react';
import Link from 'next/link';
import { BiHomeAlt, BiChevronRight, BiLockAlt, BiCheckShield } from 'react-icons/bi';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Chính sách bảo mật thông tin</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
            An toàn dữ liệu người dùng
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Chính Sách Bảo Mật Thông Tin Khách Hàng
          </h1>
          <p className="text-xs text-gray-500 mt-1">Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BiLockAlt className="text-emerald-600 text-xl" />
            1. Mục Đích Thu Thập Dữ Liệu
          </h2>
          <p>
            Betashop chỉ thu thập các thông tin cần thiết phục vụ cho việc: xử lý đơn hàng, xuất hóa đơn VAT, giao hàng tận nơi, và kích hoạt chế độ bảo hành điện tử chính hãng cho khách hàng.
          </p>

          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mt-6">
            <BiCheckShield className="text-emerald-600 text-xl" />
            2. Cam Kết Bảo Mật Tuyệt Đối
          </h2>
          <p>
            Thông tin của quý khách được mã hóa chuẩn SSL/TLS 256-bit và không bao giờ được chia sẻ hoặc bán cho bất kỳ bên thứ ba nào vì mục đích quảng cáo hoặc tiếp thị trái phép.
          </p>

          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mt-6">
            3. Quyền Lợi Của Khách Hàng
          </h2>
          <p>
            Quý khách có quyền yêu cầu kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách liên hệ với ban quản trị Betashop qua email: <strong>cskh@betashop.vn</strong> hoặc hotline: <strong>1900 8237</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
