'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BiPhoneCall, 
  BiUserCircle, 
  BiMenu, 
  BiX, 
  BiChevronRight,
  BiMapPin,
  BiShieldQuarter
} from 'react-icons/bi';
import { AiOutlineShoppingCart, AiOutlineSearch, AiOutlineHeart } from 'react-icons/ai';
import { useCart } from '@/lib/cartStore';
import { useWishlist } from '@/lib/wishlistStore';
import { useLanguage } from '@/lib/languageContext';
import { useCustomer } from '@/lib/customerContext';
import { formatVND } from '@/lib/utils';
import { STORE_CATEGORIES, STORE_NAVBARS, STORE_PRODUCTS, Product } from '@/data/storeData';

export default function Header() {
  const router = useRouter();
  const { totalCount, totalPrice, isLoaded } = useCart();
  const { totalCount: wishlistCount, isLoaded: wishlistLoaded } = useWishlist();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useCustomer();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Live search filtering
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matched = STORE_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchResults(matched);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
      router.push(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white">
      {/* Top micro bar for Desktop */}
      <div className="hidden lg:block bg-[#f8f9fa] border-b border-gray-200 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-orange-600 font-medium">
              <BiShieldQuarter className="text-base" /> Cam kết 100% hàng chính hãng – Đổi trả 30 ngày
            </span>
            <span>Hệ thống 15 showroom toàn quốc</span>
          </div>
          <div className="flex items-center space-x-3.5">
            <a href="tel:19008237" className="hover:text-orange-600 transition">
              Hotline: <strong className="text-orange-600 font-bold">1900 8237</strong>
            </a>
            <span className="text-gray-300">|</span>
            <Link href="/cong-tac-vien" className="hover:text-orange-600 transition font-medium text-purple-700">
              Cộng tác viên (10%)
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/hop-tac" className="hover:text-orange-600 transition">
              Hợp tác B2B
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/don-hang" className="hover:text-orange-600 transition">
              {t.orderTracking}
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/yeu-thich" className="hover:text-orange-600 transition flex items-center gap-1">
              <AiOutlineHeart className="text-sm text-red-500" />
              <span>{t.favorites}</span>
              {wishlistLoaded && wishlistCount > 0 && (
                <span className="bg-red-500 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <span className="text-gray-300">|</span>
            
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-200/80 rounded-md p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={`px-1.5 py-0.5 rounded transition ${
                  language === 'vi'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tiếng Việt"
              >
                🇻🇳 VI
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition ${
                  language === 'en'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-gradient-to-r from-[#f53d2d] to-[#ff6633] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 -ml-1 text-white hover:bg-white/10 rounded-lg active:scale-95 transition"
            aria-label="Mở menu danh mục"
          >
            <BiMenu className="text-2xl sm:text-3xl" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-white text-[#f53d2d] font-black text-lg sm:text-2xl px-2.5 py-1 rounded shadow-sm tracking-tighter">
              BETASHOP
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="font-bold text-xs sm:text-sm tracking-wider uppercase text-white/90">
                Tổng Kho Gia Dụng
              </span>
              <span className="text-[10px] text-white/70">Chính Hãng • Giá Tốt Nhất</span>
            </div>
          </Link>

          {/* Search Bar - Desktop & Tablet */}
          <div ref={searchRef} className="flex-1 max-w-xl mx-2 relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setIsSearchOpen(true)}
                placeholder="Tìm nồi chiên, bếp từ, robot hút bụi..."
                className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-[#f53d2d] hover:bg-[#e03122] text-white rounded-full transition active:scale-90"
                aria-label="Tìm kiếm"
              >
                <AiOutlineSearch className="text-sm sm:text-base" />
              </button>
            </form>

            {/* Live Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 text-gray-800">
                <div className="p-2 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Gợi ý sản phẩm phù hợp ({searchResults.length})
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/san-pham/${p.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 p-2.5 hover:bg-orange-50 transition"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-12 h-12 object-cover rounded-md border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs sm:text-sm font-bold text-red-600">
                            {formatVND(p.price)}
                          </span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatVND(p.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="text-xs text-orange-600 font-semibold hover:underline"
                  >
                    Xem tất cả kết quả cho &quot;{searchQuery}&quot; →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Desktop Hotline Widget */}
            <a
              href="tel:19008237"
              className="hidden xl:flex items-center gap-2 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition"
            >
              <div className="p-2 bg-white/20 rounded-full">
                <BiPhoneCall className="text-xl text-white animate-pulse" />
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="text-white/80 block">Tư vấn miễn phí</span>
                <span className="font-extrabold text-sm text-yellow-300">1900 8237</span>
              </div>
            </a>

            {/* Desktop Showroom Widget */}
            <Link
              href="/he-thong-cua-hang"
              className="hidden xl:flex items-center gap-2 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition"
            >
              <div className="p-2 bg-white/20 rounded-full">
                <BiMapPin className="text-xl text-white" />
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="text-white/80 block">{t.showrooms}</span>
                <span className="font-semibold text-white">15 Điểm</span>
              </div>
            </Link>

            {/* Wishlist Widget */}
            <Link
              href="/yeu-thich"
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 bg-white/15 hover:bg-white/25 active:scale-95 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full sm:rounded-xl transition border border-white/20 shadow-sm"
              aria-label={t.favorites}
            >
              <div className="relative">
                <AiOutlineHeart className="text-xl sm:text-2xl text-white" />
                {wishlistLoaded && wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-yellow-400 text-gray-900 font-black text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="text-[10px] text-white/80">{t.favorites}</span>
                <span className="font-bold text-xs text-yellow-300">
                  {wishlistLoaded ? `${wishlistCount} SP` : '0 SP'}
                </span>
              </div>
            </Link>

            {/* Cart Widget */}
            <Link
              href="/gio-hang"
              className="flex items-center gap-1.5 sm:gap-2 bg-white/15 hover:bg-white/25 active:scale-95 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full sm:rounded-xl transition border border-white/20 shadow-sm"
              aria-label="Giỏ hàng"
            >
              <div className="relative">
                <AiOutlineShoppingCart className="text-xl sm:text-2xl" />
                {isLoaded && totalCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-yellow-400 text-gray-900 font-black text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalCount > 99 ? '99+' : totalCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left leading-none">
                <span className="text-[10px] text-white/80">Giỏ hàng</span>
                <span className="font-bold text-xs text-yellow-300">
                  {isLoaded ? formatVND(totalPrice) : '0 ₫'}
                </span>
              </div>
            </Link>

            {/* Account Widget */}
            <div className="relative">
              {user ? (
                <div
                  onMouseEnter={() => setAccountMenuOpen(true)}
                  onMouseLeave={() => setAccountMenuOpen(false)}
                  className="relative"
                >
                  <Link
                    href="/tai-khoan"
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full sm:rounded-xl transition border border-white/20 shadow-sm cursor-pointer"
                  >
                    <img
                      src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-2 ring-yellow-400"
                    />
                    <div className="hidden lg:flex flex-col text-left leading-none">
                      <span className="text-[10px] text-white/80">Xin chào</span>
                      <span className="font-bold text-xs text-yellow-300 truncate max-w-[80px]">
                        {user.name.split(' ').pop()}
                      </span>
                    </div>
                  </Link>

                  {/* Dropdown */}
                  {accountMenuOpen && (
                    <div className="absolute right-0 top-full pt-2 w-56 z-50 text-gray-800 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 text-xs space-y-1">
                        <div className="p-2.5 bg-orange-50/70 rounded-xl mb-1">
                          <span className="font-bold text-gray-900 block truncate">{user.name}</span>
                          <span className="text-[10px] text-orange-600 font-semibold block uppercase">
                            Thành viên {user.tier || 'GOLD'} • {user.points || 0} điểm
                          </span>
                        </div>
                        <Link
                          href="/tai-khoan/thong-tin"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                        >
                          Hồ sơ cá nhân
                        </Link>
                        <Link
                          href="/don-hang"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                        >
                          Đơn hàng của tôi
                        </Link>
                        <Link
                          href="/tai-khoan/cloud-vps"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-orange-50 font-medium text-orange-700 font-semibold"
                        >
                          Máy chủ Cloud VPS
                        </Link>
                        <Link
                          href="/vi-voucher"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                        >
                          Kho voucher ưu đãi
                        </Link>
                        <Link
                          href="/cong-tac-vien"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-purple-50 font-medium text-purple-700 font-bold"
                        >
                          Cộng tác viên (Affiliate)
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            router.push('/dang-nhap');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full sm:rounded-xl transition border border-white/20 text-xs font-bold shadow-sm"
                >
                  <BiUserCircle className="text-xl" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Categories Sub-nav (Desktop) */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
          {/* Mega Category Pill */}
          <div className="relative group">
            <Link
              href="/san-pham"
              className="flex items-center gap-2 bg-[#f53d2d] text-white px-5 py-2.5 font-semibold transition hover:bg-[#e03122]"
            >
              <BiMenu className="text-xl" />
              <span>DANH MỤC SẢN PHẨM</span>
            </Link>
            
            {/* Dropdown Menu on hover */}
            <div className="absolute left-0 top-full w-64 bg-white shadow-xl border border-gray-200 py-1.5 hidden group-hover:block z-40">
              {STORE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/san-pham?danh-muc=${cat.slug.replace('/danh-muc/', '')}`}
                  className="flex items-center justify-between px-4 py-2.5 text-xs text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  <span>{cat.title}</span>
                  <BiChevronRight className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Category Links */}
          <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
            {STORE_NAVBARS.map((nav) => (
              <Link
                key={nav.id}
                href={nav.slug}
                className="px-3.5 py-2 text-xs font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition whitespace-nowrap"
              >
                {nav.title}
              </Link>
            ))}
          </nav>

          {/* Promo Tag */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-red-600 animate-pulse">
            🔥 Giảm giá sốc đến 50%
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Slide-Over) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-[#f53d2d] to-[#ff6633] p-4 text-white flex items-center justify-between">
              <div>
                <span className="font-black text-xl tracking-tight">BETASHOP</span>
                <p className="text-[11px] text-white/80">Tổng Kho Đồ Gia Dụng</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
                aria-label="Đóng menu"
              >
                <BiX className="text-2xl" />
              </button>
            </div>

            {/* Language Switcher on Mobile Drawer */}
            <div className="px-4 py-2 bg-orange-50/70 border-b border-orange-100 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Ngôn ngữ / Language:</span>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 text-xs font-bold shadow-sm">
                <button
                  type="button"
                  onClick={() => setLanguage('vi')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    language === 'vi'
                      ? 'bg-[#f53d2d] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🇻🇳 VI
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    language === 'en'
                      ? 'bg-[#f53d2d] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>

            {/* Customer Account Header on Mobile Drawer */}
            <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              {user ? (
                <Link
                  href="/tai-khoan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-2 bg-white rounded-xl border border-orange-200 shadow-sm"
                >
                  <img
                    src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-400"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-gray-900 block truncate">{user.name}</span>
                    <span className="text-[10px] text-orange-600 font-semibold block uppercase">
                      Hạng {user.tier || 'GOLD'} • {user.points || 0} điểm
                    </span>
                  </div>
                  <BiChevronRight className="text-gray-400 text-lg" />
                </Link>
              ) : (
                <Link
                  href="/dang-nhap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-sm transition"
                >
                  <div className="flex items-center gap-2">
                    <BiUserCircle className="text-xl" />
                    <span>Đăng nhập / Đăng ký</span>
                  </div>
                  <BiChevronRight className="text-lg" />
                </Link>
              )}
            </div>

            {/* Quick Links */}
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <a
                href="tel:19008237"
                className="flex items-center gap-3 p-2 bg-white rounded-lg border border-orange-200 text-orange-600 shadow-sm"
              >
                <BiPhoneCall className="text-xl" />
                <div className="text-xs">
                  <span className="block text-gray-500">Hotline đặt hàng nhanh:</span>
                  <strong className="text-sm font-bold">1900 8237 (Miễn phí)</strong>
                </div>
              </a>
            </div>

            {/* Drawer Navigation Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                  {t.categories}
                </h4>
                <div className="space-y-0.5">
                  {STORE_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/san-pham?danh-muc=${cat.slug.replace('/danh-muc/', '')}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      <span>{cat.title}</span>
                      <BiChevronRight className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                  Tiện Ích & Khám Phá
                </h4>
                <div className="space-y-0.5">
                  <Link
                    href="/yeu-thich"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    <span className="flex items-center gap-2">
                      <AiOutlineHeart className="text-red-500 text-sm" />
                      {t.favorites} ({wishlistLoaded ? wishlistCount : 0})
                    </span>
                    <BiChevronRight className="text-gray-400" />
                  </Link>
                  <Link
                    href="/don-hang"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    <span>{t.orderTracking}</span>
                    <BiChevronRight className="text-gray-400" />
                  </Link>
                  <Link
                    href="/vi-voucher"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    <span>Kho Voucher ưu đãi</span>
                    <BiChevronRight className="text-gray-400" />
                  </Link>
                  <Link
                    href="/cong-tac-vien"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg text-xs font-bold text-purple-700 hover:bg-purple-50 transition"
                  >
                    <span>Cộng tác viên (Affiliate 10%)</span>
                    <BiChevronRight className="text-purple-400" />
                  </Link>
                  <Link
                    href="/hop-tac"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg text-xs font-bold text-orange-700 hover:bg-orange-50 transition"
                  >
                    <span>Hợp tác kinh doanh B2B</span>
                    <BiChevronRight className="text-orange-400" />
                  </Link>
                  {STORE_NAVBARS.map((nav) => (
                    <Link
                      key={nav.id}
                      href={nav.slug}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      <span>{nav.title}</span>
                      <BiChevronRight className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Betashop – Tổng Kho Gia Dụng</span>
              <span>Phiên bản 1.0</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
