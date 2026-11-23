'use client';

import React from 'react';
import Link from 'next/link';
import { BiHomeAlt, BiChevronRight, BiShoppingBag, BiSearch, BiCreditCard, BiCheckCircle } from 'react-icons/bi';

export default function ShoppingGuidePage() {
  const steps = [
    {
      num: '01',
      title: 'Tìm Kiếm & Chọn Sản Phẩm',
      desc: 'Duyệt theo danh mục đồ gia dụng, thương hiệu, hoặc nhập từ khóa cần tìm tại thanh tìm kiếm trên trang chủ.',
    },
    {
      num: '02',
      title: 'Thêm Vào Giỏ & Kiểm Tra Khuyến Mãi',
      desc: 'Bấm "Mua Ngay" hoặc "Thêm vào giỏ", áp dụng mã giảm giá voucher (nếu có) để nhận ưu đãi tốt nhất.',
    },
    {
      num: '03',
      title: 'Điền Thông Tin Giao Hàng & Chọn Thanh Toán',
      desc: 'Cung cấp họ tên, số điện thoại, địa chỉ nhận hàng và lựa chọn thanh toán COD khi nhận hàng hoặc quét mã VietQR tiện lợi.',
    },
    {
      num: '04',
      title: 'Xác Nhận Đơn Hàng & Nhận Hàng',
      desc: 'Tổng kho Betashop đóng gói kiểm định và bàn giao cho đơn vị vận chuyển giao tận nơi trong vòng 24 - 48h.',
    },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Hướng dẫn mua hàng</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full uppercase tracking-wider">
            Đặt hàng nhanh gọn 4 bước
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Hướng Dẫn Mua Hàng & Đặt Hàng Trực Tuyến
          </h1>
          <p className="text-xs text-gray-500 mt-1">Hỗ trợ giao hàng COD toàn quốc hoặc thanh toán VietQR chuyển khoản nhanh</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((st) => (
            <div key={st.num} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
              <span className="text-2xl font-black text-orange-600">{st.num}</span>
              <h3 className="text-sm font-bold text-gray-900">{st.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <BiShoppingBag className="text-base" />
            <span>Xem Danh Sách Đồ Gia Dụng Ngay</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
