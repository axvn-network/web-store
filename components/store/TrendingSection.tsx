'use client';

import React from 'react';
import Link from 'next/link';
import { BiTrendingUp, BiChevronRight } from 'react-icons/bi';
import { formatVND } from '@/lib/utils';
import { STORE_PRODUCTS } from '@/data/storeData';

export default function TrendingSection() {
  const trendingItems = STORE_PRODUCTS.filter((p) => p.isTrending).slice(0, 4);

  return (
    <section className="my-4 sm:my-6 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 bg-gradient-to-r from-orange-100 via-amber-50 to-orange-50 border border-orange-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-orange-200/60 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#f53d2d] text-white rounded-lg">
            <BiTrendingUp className="text-xl" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 uppercase tracking-tight">
              Xu Hướng Mua Sắm
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-600">
              Các sản phẩm được tìm kiếm và mua nhiều nhất trong tuần
            </p>
          </div>
        </div>

        <Link
          href="/san-pham?filter=trending"
          className="text-xs sm:text-sm font-bold text-[#f53d2d] hover:underline flex items-center gap-0.5"
        >
          <span>Xem tất cả</span>
          <BiChevronRight />
        </Link>
      </div>

      {/* Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {trendingItems.map((item) => (
          <Link
            key={item.id}
            href={`/san-pham/${item.slug}`}
            className="group bg-white p-3 rounded-xl border border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <span className="absolute top-1 left-1 bg-[#f53d2d] text-white text-[9px] font-black px-1 rounded">
                HOT
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-orange-600 block">
                {item.category}
              </span>
              <h3 className="text-xs font-bold text-gray-800 line-clamp-2 mt-0.5 group-hover:text-[#f53d2d] transition">
                {item.title}
              </h3>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-[#f53d2d]">
                  {formatVND(item.price)}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-0.5">
                Đã bán {item.sold}+ cái
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
