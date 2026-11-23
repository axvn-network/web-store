'use client';

import React from 'react';
import Link from 'next/link';
import { STORE_CATEGORIES } from '@/data/storeData';

export default function CategoryGrid() {
  return (
    <section className="my-4 sm:my-6 bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <span className="w-1 sm:w-1.5 h-4 sm:h-5 bg-[#f53d2d] rounded-full inline-block" />
            Danh Mục Nổi Bật
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
            Đa dạng sản phẩm số, proxy, tài khoản và tiện ích theo nhu cầu
          </p>
        </div>
        <Link
          href="/san-pham"
          className="text-xs sm:text-sm font-bold text-[#ff6633] hover:text-[#f53d2d] hover:underline"
        >
          Xem tất cả &rarr;
        </Link>
      </div>

      {/* Grid of Categories - Responsive on mobile (4 cols on mobile, 8 on desktop) */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3.5">
        {STORE_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/san-pham?danh-muc=${cat.slug.replace('/danh-muc/', '')}`}
            className="group flex flex-col items-center text-center p-2 rounded-xl hover:bg-orange-50/70 border border-transparent hover:border-orange-200 transition-all duration-200"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-1.5 overflow-hidden group-hover:scale-105 transition-transform duration-200 shadow-inner">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="mt-2 text-[11px] sm:text-xs font-semibold text-gray-700 group-hover:text-[#f53d2d] line-clamp-2 leading-snug">
              {cat.title}
            </h3>
            {cat.itemCount && (
              <span className="hidden sm:inline-block text-[10px] text-gray-400 mt-0.5">
                {cat.itemCount} sản phẩm
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
