import React from 'react';
import HeroSection from '@/components/store/HeroSection';
import FlashSale from '@/components/store/FlashSale';
import CategoryGrid from '@/components/store/CategoryGrid';
import BannerSection from '@/components/store/BannerSection';
import TabProducts from '@/components/store/TabProducts';
import TrendingSection from '@/components/store/TrendingSection';
import BrandsSection from '@/components/store/BrandsSection';

export default function HomePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Carousel & Promotion News */}
      <HeroSection />

      {/* Categories Grid (Mobile-friendly) */}
      <CategoryGrid />

      {/* Flash Sale with Countdown */}
      <FlashSale />

      {/* 3 Promos / Banners */}
      <BannerSection />

      {/* Tabbed Products Selection */}
      <TabProducts />

      {/* Trending Items in Week */}
      <TrendingSection />

      {/* Brands Slider / Grid */}
      <BrandsSection />
    </div>
  );
}
