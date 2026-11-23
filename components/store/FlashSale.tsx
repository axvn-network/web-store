'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AiFillFire } from 'react-icons/ai';
import { BiChevronRight, BiChevronLeft, BiTimeFive } from 'react-icons/bi';
import { STORE_PRODUCTS } from '@/data/storeData';
import ProductCard from './ProductCard';

export default function FlashSale() {
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const timeSlots = [
    { label: '09:00 - 12:00', status: 'Đang diễn ra', active: true },
    { label: '12:00 - 18:00', status: 'Sắp diễn ra', active: false },
    { label: '18:00 - 21:00', status: 'Ngày mai', active: false },
  ];

  const allFlash = STORE_PRODUCTS.filter((p) => p.isFlashSale);
  // Shuffled or slot-based products
  const flashProducts = activeSlot === 0 
    ? allFlash.slice(0, 8)
    : activeSlot === 1
    ? allFlash.slice(4, 12).concat(allFlash.slice(0, 2))
    : allFlash.slice(2, 10);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="my-4 sm:my-6 rounded-2xl p-3.5 sm:p-5 bg-gradient-to-r from-[#dc2626] via-[#f53d2d] to-[#ea580c] text-white shadow-lg overflow-hidden relative">
      {/* Top Header: Title, Clock & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/20">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-yellow-300 font-black text-lg sm:text-2xl uppercase tracking-tighter">
            <AiFillFire className="text-2xl sm:text-3xl animate-bounce text-yellow-300" />
            <span>FLASH SALE GIỜ VÀNG</span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1 text-xs sm:text-sm font-black bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/10">
            <BiTimeFive className="text-yellow-300 text-sm hidden xs:inline" />
            <span className="text-[11px] text-white/90 mr-1 hidden xs:inline">Kết thúc trong:</span>
            <span className="bg-black/90 text-yellow-300 px-2 py-0.5 rounded-md font-mono shadow">
              {pad(timeLeft.hours)}
            </span>
            <span>:</span>
            <span className="bg-black/90 text-yellow-300 px-2 py-0.5 rounded-md font-mono shadow">
              {pad(timeLeft.minutes)}
            </span>
            <span>:</span>
            <span className="bg-black/90 text-yellow-300 px-2 py-0.5 rounded-md font-mono shadow">
              {pad(timeLeft.seconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Scroll Navigation Buttons */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden md:flex p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-red-600 transition active:scale-95"
            title="Cuộn sang trái"
          >
            <BiChevronLeft className="text-xl" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden md:flex p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-red-600 transition active:scale-95"
            title="Cuộn sang phải"
          >
            <BiChevronRight className="text-xl" />
          </button>

          <Link
            href="/san-pham?filter=flash-sale"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold bg-white/20 hover:bg-white text-white hover:text-[#f53d2d] px-3 sm:px-4 py-1.5 rounded-full transition active:scale-95 shadow-sm"
          >
            <span>Xem tất cả ({allFlash.length})</span>
            <BiChevronRight className="text-base" />
          </Link>
        </div>
      </div>

      {/* Shopee-style Time Slots Selector */}
      <div className="flex items-center gap-2 pt-3 pb-2 overflow-x-auto no-scrollbar">
        {timeSlots.map((slot, index) => (
          <button
            key={slot.label}
            type="button"
            onClick={() => setActiveSlot(index)}
            className={`flex flex-col items-center px-4 py-1.5 rounded-xl text-xs transition shrink-0 ${
              activeSlot === index
                ? 'bg-yellow-400 text-slate-950 font-black shadow-md scale-102'
                : 'bg-white/10 hover:bg-white/20 text-white/90 font-medium'
            }`}
          >
            <span className="text-xs font-bold">{slot.label}</span>
            <span className="text-[10px] opacity-90">{slot.status}</span>
          </button>
        ))}
      </div>

      {/* Scrollable Horizontal Product Cards Carousel */}
      <div
        ref={scrollRef}
        className="mt-3 flex overflow-x-auto gap-3 pb-2 scroll-smooth no-scrollbar"
      >
        {flashProducts.map((p) => {
          const soldPercent = Math.min(95, Math.max(30, Math.floor((p.sold / (p.sold + 20)) * 100)));
          return (
            <div
              key={p.id}
              className="w-44 sm:w-52 shrink-0 flex flex-col justify-between bg-white rounded-xl p-2.5 text-gray-900 shadow-md transition hover:-translate-y-1"
            >
              <ProductCard product={p} />
              
              {/* Shopee-style Sold Progress Bar with Flame */}
              <div className="mt-2 space-y-1">
                <div className="relative w-full bg-orange-100 rounded-full h-3.5 overflow-hidden flex items-center justify-center">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${soldPercent}%` }}
                  />
                  <span className="relative z-10 text-[9px] font-extrabold text-white uppercase tracking-tight flex items-center gap-0.5">
                    <AiFillFire className="text-yellow-300 text-xs" />
                    <span>ĐÃ BÁN {soldPercent}%</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
