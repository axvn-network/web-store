'use client';

import React from 'react';
import Link from 'next/link';
import { STORE_BANNERS } from '@/data/storeData';

export default function BannerSection() {
  return (
    <section className="my-4 sm:my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {STORE_BANNERS.map((banner) => (
          <Link
            key={banner.id}
            href={banner.slug}
            className="group relative block rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-32 sm:h-36 md:h-44"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-4 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-300">
                Ưu Đãi Đặc Biệt
              </span>
              <h3 className="text-xs sm:text-sm font-bold line-clamp-2 mt-0.5 group-hover:text-yellow-300 transition">
                {banner.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
