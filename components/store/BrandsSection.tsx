'use client';

import React from 'react';
import Link from 'next/link';
import { STORE_BRANDS } from '@/data/storeData';

export default function BrandsSection() {
  return (
    <section className="my-4 sm:my-6 bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <span className="w-1 sm:w-1.5 h-4 sm:h-5 bg-[#f53d2d] rounded-full inline-block" />
            Thương Hiệu Đồng Hành
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-500">
            100% thương hiệu uy tín phân phối chính hãng tại Việt Nam (Bảo hành 12 - 36 tháng)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3">
        {STORE_BRANDS.map((b) => (
          <Link
            key={b.id}
            href={`/san-pham?thuong-hieu=${encodeURIComponent(b.name)}`}
            className="group flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 hover:border-orange-400 hover:shadow-md transition bg-white"
          >
            <div className="h-10 sm:h-12 w-full flex items-center justify-center p-1.5">
              <img
                src={b.imgSrc}
                alt={b.name}
                className="max-h-full max-w-full object-contain filter group-hover:scale-110 transition duration-200"
                onError={(e) => {
                  // Fallback to text if CDN image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-gray-700 group-hover:text-orange-600 tracking-tight text-center line-clamp-1">
              {b.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
