'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BiChevronLeft, BiChevronRight, BiTimeFive } from 'react-icons/bi';
import { STORE_SLIDERS, STORE_PROMOTION_NEWS } from '@/data/storeData';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto rotate banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % STORE_SLIDERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % STORE_SLIDERS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + STORE_SLIDERS.length) % STORE_SLIDERS.length);
  };

  return (
    <section className="my-3 sm:my-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        
        {/* Main Slider (100% on Mobile, 8-9 cols on Desktop) */}
        <div className="lg:col-span-8 xl:col-span-9 relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm group h-[220px] xs:h-[260px] sm:h-[340px] md:h-[400px]">
          {STORE_SLIDERS.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8 text-white">
                {slide.badge && (
                  <span className="inline-block bg-[#f53d2d] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded w-max mb-1.5 sm:mb-2 shadow">
                    {slide.badge}
                  </span>
                )}
                <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight max-w-xl drop-shadow-md">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-[11px] sm:text-sm text-gray-200 mt-1 max-w-lg line-clamp-2 drop-shadow">
                    {slide.subtitle}
                  </p>
                )}
                <div className="mt-3">
                  <Link
                    href={slide.slug}
                    className="inline-block bg-[#ff6633] hover:bg-[#f53d2d] text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition shadow-md active:scale-95"
                  >
                    Xem Ngay &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Arrow Controls */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
            aria-label="Slide trước"
          >
            <BiChevronLeft className="text-2xl" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
            aria-label="Slide tiếp theo"
          >
            <BiChevronRight className="text-2xl" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-1.5 sm:space-x-2">
            {STORE_SLIDERS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-6 sm:w-8 bg-[#ff6633]' : 'w-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Chuyển đến slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Promotion News Sidebar (Desktop vertical list, Mobile horizontal scroll) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
            <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              Tin Tức Khuyến Mãi
            </h3>
            <Link href="/tin-tuc" className="text-[11px] text-[#ff6633] font-semibold hover:underline">
              Xem tất cả
            </Link>
          </div>

          {/* Desktop vertical list / Mobile scroll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 overflow-hidden">
            {STORE_PROMOTION_NEWS.slice(0, 3).map((news) => (
              <Link
                key={news.id}
                href={news.slug}
                className="group flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-orange-50/60 transition"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-16 h-16 sm:w-20 sm:h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0 group-hover:scale-105 transition"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-[#f53d2d] transition leading-snug">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <BiTimeFive />
                    <span>{news.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Hotline Box Promo inside news */}
          <div className="mt-3 p-2.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 flex items-center justify-between text-xs">
            <div>
              <span className="block text-[11px] text-gray-600">Đặt hàng hỏa tốc qua Zalo/Call:</span>
              <strong className="text-sm font-black text-[#f53d2d]">1900 8237</strong>
            </div>
            <a
              href="tel:19008237"
              className="bg-[#f53d2d] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#e03122] transition active:scale-95 shadow"
            >
              Gọi Ngay
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
