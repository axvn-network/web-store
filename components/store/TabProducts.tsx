'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STORE_PRODUCTS } from '@/data/storeData';
import ProductCard from './ProductCard';

export default function TabProducts() {
  const [activeTab, setActiveTab] = useState<'all' | 'bestseller' | 'vps' | 'proxy' | 'marketing' | 'mmo' | 'software' | 'home'>('all');

  const tabs = [
    { id: 'all', label: 'Tất Cả Sản Phẩm' },
    { id: 'bestseller', label: 'Bán Chạy Nhất' },
    { id: 'vps', label: 'Cloud VPS & Server' },
    { id: 'proxy', label: 'Proxy Tốc Độ Cao' },
    { id: 'marketing', label: 'Via & Tài Khoản Ads' },
    { id: 'mmo', label: 'Dịch Vụ MXH & MMO' },
    { id: 'software', label: 'Phần Mềm Bản Quyền' },
    { id: 'home', label: 'Thiết Bị Tiện Ích' },
  ];

  const filteredProducts = STORE_PRODUCTS.filter((p) => {
    if (activeTab === 'bestseller') return (p.sold || 0) > 100 || p.isFeatured;
    if (activeTab === 'vps') return p.parentCategorySlug === 'cloud-vps' || p.categorySlug === 'cloud-vps';
    if (activeTab === 'proxy') return p.parentCategorySlug === 'proxy-ip' || p.categorySlug === 'proxy-ip';
    if (activeTab === 'marketing') return p.parentCategorySlug === 'tai-khoan-quang-cao' || p.categorySlug === 'tai-khoan-quang-cao';
    if (activeTab === 'mmo') return p.parentCategorySlug === 'dich-vu-mmo' || p.categorySlug === 'dich-vu-mmo';
    if (activeTab === 'software') return p.parentCategorySlug === 'phan-mem-ban-quyen' || p.categorySlug === 'phan-mem-ban-quyen';
    if (activeTab === 'home') return p.parentCategorySlug === 'tien-ich-gia-dung' || p.categorySlug.includes('noi-') || p.categorySlug.includes('bep-');
    return true;
  });

  return (
    <section className="my-4 sm:my-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm">
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <span className="w-1 sm:w-1.5 h-4 sm:h-5 bg-[#f53d2d] rounded-full inline-block" />
            Sản Phẩm Đề Cử Hôm Nay
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
            Tuyển chọn sản phẩm số, dịch vụ công nghệ & thiết bị chất lượng cao
          </p>
        </div>

        {/* Tab Buttons - Horizontal scroll on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-[#f53d2d] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Product Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
        {filteredProducts.slice(0, 12).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-5 text-center">
        <Link
          href="/san-pham"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-[#f53d2d] text-gray-800 hover:text-[#f53d2d] font-bold text-xs sm:text-sm rounded-xl transition shadow-sm active:scale-95"
        >
          Xem Thêm Tất Cả Sản Phẩm ({STORE_PRODUCTS.length}) &rarr;
        </Link>
      </div>
    </section>
  );
}
