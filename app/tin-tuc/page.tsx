'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BiTimeFive, BiHomeAlt, BiChevronRight, BiNews, BiBookOpen, BiTag } from 'react-icons/bi';
import { STORE_PROMOTION_NEWS, STORE_PRODUCTS } from '@/data/storeData';
import ProductCard from '@/components/store/ProductCard';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tất Cả Bài Viết' },
    { id: 'meo-bep', name: 'Mẹo Bếp Hay' },
    { id: 'tu-van', name: 'Tư Vấn Chọn Mua' },
    { id: 'bao-duong', name: 'Bảo Dưỡng Thiết Bị' },
    { id: 'khuyen-mai', name: 'Tin Khuyến Mãi' },
  ];

  const featuredPost = STORE_PROMOTION_NEWS[0];
  const remainingPosts = STORE_PROMOTION_NEWS.slice(1);

  const filteredPosts = remainingPosts.filter((post) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'meo-bep') return post.slug.includes('noi-chien') || post.title.includes('nồi chiên');
    if (selectedCategory === 'tu-van') return post.slug.includes('bep-tu') || post.title.includes('bếp từ');
    if (selectedCategory === 'bao-duong') return post.slug.includes('hut-bui') || post.title.includes('hút bụi');
    if (selectedCategory === 'khuyen-mai') return post.slug.includes('khai-truong') || post.title.includes('khai trương');
    return true;
  });

  const featuredProducts = STORE_PRODUCTS.filter((p) => p.isFlashSale || p.isTrending).slice(0, 5);

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb - Standard Store Format */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-[#f53d2d] font-bold">Tin tức & Cẩm nang gia dụng</span>
      </nav>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-[#f53d2d] text-white rounded-lg text-lg">
              <BiNews />
            </span>
            <span className="text-xs uppercase font-extrabold text-[#f53d2d] tracking-wider">
              Góc Cẩm Nang & Kinh Nghiệm
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Mẹo Hay & Kiến Thức Đồ Gia Dụng
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl leading-relaxed">
            Tổng hợp các bí quyết nấu ăn ngon, kinh nghiệm lựa chọn thiết bị nhà bếp và cẩm nang bảo quản đồ gia đình bền đẹp từ chuyên gia Betashop.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-orange-200/80 self-start md:self-auto shrink-0 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-xl">
            <BiBookOpen />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Kho kiến thức</span>
            <span className="text-xs font-black text-gray-900">40+ Bài viết chọn lọc</span>
          </div>
        </div>
      </div>

      {/* Featured / Spotlight Post */}
      {featuredPost && (
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-gray-150 shadow-sm hover:shadow-md transition overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 aspect-[16/9] lg:aspect-auto lg:h-full overflow-hidden bg-gray-100 relative group">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#f53d2d] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                BÀI VIẾT NỔI BẬT
              </span>
            </div>

            <div className="lg:col-span-5 p-5 sm:p-8 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-0.5 bg-orange-50 text-[#f53d2d] rounded font-bold text-[11px]">
                    Mẹo Bếp Hay
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BiTimeFive /> {featuredPost.date}
                  </span>
                </div>

                <Link href={featuredPost.slug} className="block group">
                  <h2 className="text-base sm:text-xl font-black text-gray-900 group-hover:text-[#f53d2d] transition leading-snug">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                  Nồi chiên không dầu đang là thiết bị không thể thiếu trong gian bếp mỗi gia đình. Cùng điểm qua các tiêu chí lựa chọn dung tích, công nghệ đối lưu nhiệt 360 độ và danh sách các mẫu nồi chiên dung tích lớn được yêu thích nhất hiện nay.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={featuredPost.slug}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f53d2d] hover:bg-[#e03122] text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
                >
                  <span>Đọc bài viết chi tiết</span>
                  <BiChevronRight className="text-base" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 ${
              selectedCategory === cat.id
                ? 'bg-[#f53d2d] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={post.slug}
            className="group bg-white rounded-2xl border border-gray-150 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] w-full overflow-hidden bg-gray-50 relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Kiến Thức Gia Dụng
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <BiTimeFive />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span>5 phút đọc</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#f53d2d] transition line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  Hướng dẫn chi tiết từ chuyên gia kỹ thuật Betashop, giúp bạn sử dụng thiết bị an toàn, tiết kiệm điện và tăng độ bền sản phẩm.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <span className="text-xs font-bold text-orange-600 group-hover:text-[#f53d2d] inline-flex items-center gap-1 group-hover:translate-x-1 transition duration-200">
                Đọc bài viết &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Section: Recommended Products */}
      <section className="mt-10 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#f53d2d] rounded-full inline-block" />
              Sản Phẩm Đang Được Quan Tâm
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Các thiết bị gia dụng chính hãng đang có ưu đãi lớn trong tháng
            </p>
          </div>
          <Link
            href="/san-pham"
            className="text-xs font-bold text-orange-600 hover:text-[#f53d2d] hover:underline"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
