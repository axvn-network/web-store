'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  BiFilterAlt, 
  BiSort, 
  BiChevronRight, 
  BiX, 
  BiHomeAlt,
  BiGridAlt,
  BiListUl,
  BiStar,
  BiCart
} from 'react-icons/bi';
import { STORE_PRODUCTS, STORE_CATEGORIES, Product } from '@/data/storeData';
import ProductCard from '@/components/store/ProductCard';
import { formatVND } from '@/lib/utils';
import { useCart } from '@/lib/cartStore';

function ProductsContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('danh-muc') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'flow'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const cleanCategory = (slug?: string) => (slug || '').replace(/^\//, '').replace(/^danh-muc\//, '');

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(STORE_PRODUCTS.map((p) => p.brand)));
    return ['all', ...list];
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return STORE_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const normSelected = cleanCategory(selectedCategory);
        const normProduct = cleanCategory(product.categorySlug);
        const normParent = cleanCategory(product.parentCategorySlug);
        if (normProduct !== normSelected && normParent !== normSelected) return false;
      }

      // Brand filter
      if (selectedBrand !== 'all') {
        if (product.brand !== selectedBrand) return false;
      }

      // Search query filter
      if (initialSearch.trim()) {
        const q = initialSearch.toLowerCase();
        const matched =
          product.title.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q);
        if (!matched) return false;
      }

      // Special tags (flash sale, trending, new)
      if (initialFilter === 'flash-sale' && !product.isFlashSale) return false;
      if (initialFilter === 'trending' && !product.isTrending) return false;
      if (initialFilter === 'hang-moi' && !product.isNew) return false;

      // Rating filter
      if (minRating > 0 && product.rating < minRating) return false;

      // Price filter
      if (priceRange === 'under-100k' && product.price >= 100000) return false;
      if (priceRange === '100k-500k' && (product.price < 100000 || product.price > 500000)) return false;
      if (priceRange === '500k-2m' && (product.price < 500000 || product.price > 2000000)) return false;
      if (priceRange === 'above-2m' && product.price <= 2000000) return false;
      if (priceRange === 'under-1m' && product.price >= 1000000) return false;
      if (priceRange === '1m-3m' && (product.price < 1000000 || product.price > 3000000)) return false;
      if (priceRange === '3m-7m' && (product.price < 3000000 || product.price > 7000000)) return false;
      if (priceRange === 'above-7m' && product.price <= 7000000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'bestseller') return b.sold - a.sold;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, selectedBrand, priceRange, minRating, sortBy, initialSearch, initialFilter]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange('all');
    setMinRating(0);
    setSortBy('default');
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-medium">Danh mục sản phẩm</span>
        {initialSearch && (
          <>
            <BiChevronRight className="text-gray-400" />
            <span className="text-orange-600 font-bold truncate max-w-[150px]">
              &quot;{initialSearch}&quot;
            </span>
          </>
        )}
      </nav>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <BiFilterAlt className="text-orange-600 text-lg" /> BỘ LỌC TÌM KIẾM
            </h3>
            {(selectedCategory !== 'all' || selectedBrand !== 'all' || priceRange !== 'all') && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              Danh mục sản phẩm & dịch vụ
            </h4>
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition ${
                  selectedCategory === 'all'
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tất cả danh mục ({STORE_PRODUCTS.length})
              </button>
              {STORE_CATEGORIES.map((cat) => {
                const slug = cleanCategory(cat.slug);
                const isSelected = cleanCategory(selectedCategory) === slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-50 text-orange-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.title}</span>
                    {cat.itemCount && (
                      <span className="text-[10px] text-gray-400">({cat.itemCount})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              Khoảng giá (VND)
            </h4>
            <div className="space-y-1.5 text-xs text-gray-600">
              {[
                { id: 'all', label: 'Tất cả mức giá' },
                { id: 'under-100k', label: 'Dưới 100.000 ₫' },
                { id: '100k-500k', label: '100.000 ₫ - 500.000 ₫' },
                { id: '500k-2m', label: '500.000 ₫ - 2 triệu ₫' },
                { id: 'above-2m', label: 'Trên 2 triệu ₫' },
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === p.id}
                    onChange={() => setPriceRange(p.id)}
                    className="text-orange-600 focus:ring-orange-500 rounded-full"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              Thương hiệu
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(b)}
                  className={`px-2.5 py-1 rounded-full text-xs transition ${
                    selectedBrand === b
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {b === 'all' ? 'Tất cả' : b}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              Đánh giá sao
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'Tất cả đánh giá', val: 0 },
                { label: 'Từ 4.0 sao trở lên', val: 4 },
                { label: '5.0 sao tuyệt đối', val: 5 },
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setMinRating(r.val)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                    minRating === r.val
                      ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <BiStar className="text-amber-400 text-sm" />
                    <span>{r.label}</span>
                  </span>
                  {minRating === r.val && <span className="text-[10px] font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Listing Area */}
        <section className="lg:col-span-3 space-y-4">
          
          {/* Top Control Bar: Total found, Mobile Filter Trigger, Sort */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-gray-900">
                {selectedCategory === 'all'
                  ? 'Tất Cả Sản Phẩm Gia Dụng'
                  : STORE_CATEGORIES.find((c) => cleanCategory(c.slug) === cleanCategory(selectedCategory))?.title || 'Sản Phẩm'}
              </h1>
              <p className="text-xs text-gray-500">
                Tìm thấy <strong className="text-orange-600 font-bold">{filteredProducts.length}</strong> sản phẩm phù hợp
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg text-xs font-bold active:scale-95 transition"
              >
                <BiFilterAlt className="text-base" />
                <span>Bộ lọc ({selectedCategory !== 'all' || priceRange !== 'all' || selectedBrand !== 'all' ? '1+' : '0'})</span>
              </button>

              {/* View Mode Toggle (Grid vs Flow/List) */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-orange-600 shadow-xs font-bold'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Dạng lưới (Grid View)"
                >
                  <BiGridAlt className="text-base" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('flow')}
                  className={`p-1.5 rounded-md transition ${
                    viewMode === 'flow'
                      ? 'bg-white text-orange-600 shadow-xs font-bold'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Dạng danh sách chi tiết (Flow View)"
                >
                  <BiListUl className="text-base" />
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1 text-xs">
                <BiSort className="text-base text-gray-400" />
                <span className="hidden sm:inline text-gray-500">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-2.5 rounded-lg text-xs font-medium focus:ring-1 focus:ring-orange-500"
                >
                  <option value="default">Nổi bật nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="bestseller">Bán chạy nhất</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cloud VPS Partner Highlight Banner */}
          {cleanCategory(selectedCategory) === 'cloud-vps' && (
            <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">Hạ tầng ảo hóa XVPS</span>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                  Đại lý ủy quyền cấp cao: Nam Vũ (VIP 1 - Chiết khấu 15%)
                </h3>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Các gói Cloud Hosting, VPS VMware và KVM 100% NVMe. Bấm nút bên cạnh để xem bảng cấu hình chi tiết, chọn hệ điều hành tự động và đặt theo chu kỳ giảm giá 15%.
                </p>
              </div>
              <Link
                href="/cloud-vps"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f53d2d] hover:bg-[#e03122] text-white text-xs font-bold rounded-xl transition shadow active:scale-95 shrink-0"
              >
                <span>Bảng Cấu Hình Trực Tiếp &rarr;</span>
              </Link>
            </div>
          )}

          {/* Products Presentation (Grid View vs Flow/List View) */}
          {filteredProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-100 hover:border-orange-200 transition shadow-xs hover:shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <Link href={`/san-pham/${p.slug || p.id}`} className="shrink-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={p.image || '/product1.webp'}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                        />
                        {p.discount && (
                          <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                            -{p.discount}%
                          </span>
                        )}
                      </Link>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                            {p.brand || 'Chính Hãng'}
                          </span>
                          {p.isFlashSale && (
                            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              ⚡ Flash Sale
                            </span>
                          )}
                          <span className="text-[11px] text-gray-400">
                            Kho: <strong className="text-gray-700 font-bold">{p.stock}</strong>
                          </span>
                        </div>

                        <Link
                          href={`/san-pham/${p.slug || p.id}`}
                          className="block font-bold text-gray-900 text-sm sm:text-base hover:text-orange-600 transition truncate"
                          title={p.title}
                        >
                          {p.title}
                        </Link>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <BiStar className="text-sm fill-amber-400" />
                            <span>{p.rating || '5.0'}</span>
                          </span>
                          <span>•</span>
                          <span>Đã bán: <strong className="text-gray-800 font-semibold">{p.sold}</strong></span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">Bảo hành 12 tháng</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-2 shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-base sm:text-lg font-black text-[#f53d2d]">
                          {formatVND(p.price)}
                        </div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="text-xs text-gray-400 line-through">
                            {formatVND(p.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(p, 1)}
                          className="p-2 sm:px-3 sm:py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95"
                          title="Thêm vào giỏ hàng"
                        >
                          <BiCart className="text-base" />
                          <span className="hidden sm:inline">Thêm giỏ</span>
                        </button>
                        <Link
                          href={`/san-pham/${p.slug || p.id}`}
                          className="px-3.5 py-2 bg-[#f53d2d] hover:bg-[#e03122] text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95 shrink-0"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-3">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                <BiFilterAlt />
              </div>
              <h3 className="text-base font-bold text-gray-800">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Rất tiếc chúng tôi không tìm thấy thiết bị gia dụng nào theo tiêu chí lọc này. Hãy thử xóa bớt bộ lọc hoặc chọn mức giá khác.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-block bg-[#f53d2d] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#e03122] transition"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

        </section>

      </div>

      {/* Mobile Filter Modal / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#f53d2d] to-[#ff6633] text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <BiFilterAlt /> Bộ Lọc Sản Phẩm
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full hover:bg-white/20"
              >
                <BiX className="text-2xl" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              {/* Category */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2">Danh mục</h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left p-2 rounded-lg ${
                      selectedCategory === 'all'
                        ? 'bg-orange-50 text-orange-600 font-bold'
                        : 'text-gray-700'
                    }`}
                  >
                    Tất cả danh mục
                  </button>
                  {STORE_CATEGORIES.map((c) => {
                    const slug = c.slug.replace('/danh-muc/', '');
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCategory(slug)}
                        className={`w-full text-left p-2 rounded-lg ${
                          selectedCategory === slug
                            ? 'bg-orange-50 text-orange-600 font-bold'
                            : 'text-gray-700'
                        }`}
                      >
                        {c.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2">Khoảng giá</h4>
                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'under-100k', label: 'Dưới 100.000 ₫' },
                    { id: '100k-500k', label: '100k - 500k ₫' },
                    { id: '500k-2m', label: '500k - 2 triệu ₫' },
                    { id: 'above-2m', label: 'Trên 2 triệu ₫' },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center gap-2 p-1">
                      <input
                        type="radio"
                        name="mobilePrice"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2">Thương hiệu</h4>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3 py-1.5 rounded-full ${
                        selectedBrand === b
                          ? 'bg-orange-600 text-white font-bold'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {b === 'all' ? 'Tất cả' : b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with Apply Button */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-1/3 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl"
              >
                Đặt lại
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-2 text-xs font-bold text-white bg-[#f53d2d] rounded-xl shadow"
              >
                Áp dụng ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">Đang tải danh sách sản phẩm...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
