'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiFillFire } from 'react-icons/ai';
import { BiChevronRight } from 'react-icons/bi';
import { STORE_PRODUCTS } from '@/data/storeData';
import ProductCard from './ProductCard';

export default function FlashSale() {
  const flashProducts = STORE_PRODUCTS.filter((p) => p.isFlashSale);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="my-4 sm:my-6 rounded-xl sm:rounded-2xl p-3 sm:p-5 bg-gradient-to-r from-[#e11d48] via-[#f53d2d] to-[#ff6633] text-white shadow-md">
      {/* Header with Title and Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/20">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-yellow-300 font-black text-base sm:text-xl md:text-2xl uppercase tracking-tighter">
            <AiFillFire className="text-2xl sm:text-3xl animate-bounce text-yellow-300" />
            <span>FLASH SALE GIỜ VÀNG</span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1 text-xs sm:text-sm font-black">
            <span className="text-[11px] text-white/90 mr-1 hidden xs:inline">Kết thúc trong:</span>
            <span className="bg-black/80 text-yellow-300 px-2 py-1 rounded shadow">
              {pad(timeLeft.hours)}
            </span>
            <span>:</span>
            <span className="bg-black/80 text-yellow-300 px-2 py-1 rounded shadow">
              {pad(timeLeft.minutes)}
            </span>
            <span>:</span>
            <span className="bg-black/80 text-yellow-300 px-2 py-1 rounded shadow">
              {pad(timeLeft.seconds)}
            </span>
          </div>
        </div>

        <Link
          href="/san-pham?filter=flash-sale"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold bg-white/20 hover:bg-white text-white hover:text-[#f53d2d] px-3 sm:px-4 py-1.5 rounded-full transition w-max active:scale-95 shadow-sm"
        >
          <span>Xem tất cả ({flashProducts.length})</span>
          <BiChevronRight className="text-base" />
        </Link>
      </div>

      {/* Product List - 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="mt-3.5 sm:mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {flashProducts.slice(0, 5).map((p) => (
          <div key={p.id} className="relative">
            <ProductCard product={p} />
            {/* Sale Progress Bar */}
            <div className="mt-1 bg-white/20 rounded-full h-2.5 overflow-hidden relative">
              <div
                className="bg-yellow-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(95, (p.sold / (p.sold + 30)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/90 font-medium px-1 mt-0.5">
              <span>Đang bán chạy</span>
              <span>Đã bán {p.sold}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
