'use client';

import React from 'react';
import Link from 'next/link';
import { BiHomeAlt, BiChevronRight, BiBriefcase, BiCheckCircle, BiEnvelope } from 'react-icons/bi';

export default function CareerPage() {
  const jobs = [
    { title: 'Nhân viên Tư vấn bán hàng Online / Showroom', loc: 'Hà Nội & TP. HCM', type: 'Toàn thời gian', sal: '10 - 18 triệu' },
    { title: 'Kỹ thuật viên Lắp đặt & Bảo hành Gia dụng', loc: 'Hà Nội / Đà Nẵng', type: 'Toàn thời gian', sal: '12 - 20 triệu' },
    { title: 'Chuyên viên Vận hành Kho & Quản lý Tồn kho', loc: 'Hà Nội (Tổng kho Mỹ Đình)', type: 'Toàn thời gian', sal: '11 - 16 triệu' },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Tuyển dụng Betashop</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Gia nhập đội ngũ Betashop
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Cơ Hội Nghề Nghiệp Tại Hệ Thống Tổng Kho Betashop
          </h1>
          <p className="text-xs text-gray-500 mt-1">Môi trường làm việc năng động, đãi ngộ cạnh tranh, lộ trình thăng tiến rõ ràng</p>
        </div>

        <div className="space-y-3">
          {jobs.map((j, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-purple-300 transition bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{j.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>📍 {j.loc}</span>
                  <span>⏰ {j.type}</span>
                  <span className="text-orange-600 font-bold">💰 {j.sal}</span>
                </div>
              </div>
              <a
                href="mailto:tuyendung@betashop.vn?subject=Ung-tuyen-Betashop"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition"
              >
                Ứng tuyển ngay
              </a>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center gap-3">
          <BiEnvelope className="text-2xl text-purple-600 flex-shrink-0" />
          <span>Gửi CV trực tiếp tới phòng nhân sự: <strong>tuyendung@betashop.vn</strong> hoặc liên hệ hotline: <strong>1900 8237</strong></span>
        </div>
      </div>
    </div>
  );
}
