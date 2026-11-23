'use client';

import React from 'react';
import Link from 'next/link';
import { BiHomeAlt, BiChevronRight, BiMapPin, BiPhoneCall, BiTimeFive } from 'react-icons/bi';

export default function StoreLocationsPage() {
  const stores = [
    {
      city: 'Hà Nội (Trụ sở & Tổng kho miền Bắc)',
      addr: 'Số 18 đường Phạm Hùng, P. Mỹ Đình 2, Q. Nam Từ Liêm, TP. Hà Nội',
      phone: '1900 8237 – 0988 123 456',
      hours: '08:00 - 21:30 (Thứ 2 - Chủ Nhật)',
    },
    {
      city: 'TP. Hồ Chí Minh (Tổng kho miền Nam)',
      addr: 'Số 256 đường Nguyễn Thị Thập, P. Tân Quy, Quận 7, TP. Hồ Chí Minh',
      phone: '1900 8237 – 0977 654 321',
      hours: '08:00 - 21:30 (Thứ 2 - Chủ Nhật)',
    },
    {
      city: 'Đà Nẵng (Chi nhánh miền Trung)',
      addr: 'Số 89 đường Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, TP. Đà Nẵng',
      phone: '1900 8237 – 0912 345 678',
      hours: '08:00 - 21:00 (Thứ 2 - Chủ Nhật)',
    },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Hệ thống showroom & tổng kho</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full uppercase tracking-wider">
            Trải nghiệm trực tiếp tại kho
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Hệ Thống Showroom & Tổng Kho Gia Dụng Betashop
          </h1>
          <p className="text-xs text-gray-500 mt-1">Hỗ trợ xem hàng mẫu, test máy thực tế và nhận hàng ngay trong 30 phút</p>
        </div>

        <div className="space-y-4">
          {stores.map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <BiMapPin className="text-orange-600 text-lg" />
                <span>{s.city}</span>
              </h3>
              <p className="text-xs text-gray-600"><strong>Địa chỉ:</strong> {s.addr}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><BiPhoneCall className="text-orange-600" /> {s.phone}</span>
                <span className="flex items-center gap-1"><BiTimeFive className="text-orange-600" /> {s.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
