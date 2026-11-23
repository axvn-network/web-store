'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiChevronRight,
  FiStar,
  FiCheck,
} from 'react-icons/fi';

interface WishlistItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  category: string;
}

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'w-1',
    title: 'Nồi chiên không dầu Philips Rapid Air HD9252/90 4.1L',
    slug: 'noi-chien-khong-dau-philips-hd9252',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=400&q=80',
    price: 2490000,
    originalPrice: 3290000,
    rating: 4.9,
    reviewsCount: 142,
    category: 'Nhà bếp',
  },
  {
    id: 'w-2',
    title: 'Máy lọc không khí Xiaomi Smart Air Purifier 4 Pro',
    slug: 'may-loc-khong-khi-xiaomi-4-pro',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=400&q=80',
    price: 4690000,
    originalPrice: 5990000,
    rating: 5.0,
    reviewsCount: 98,
    category: 'Tiện ích gia đình',
  },
  {
    id: 'w-3',
    title: 'Bàn là hơi nước đứng Tefal IT3440E0 công suất 1800W',
    slug: 'ban-la-hoi-nuoc-tefal-it3440e0',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    price: 1850000,
    originalPrice: 2490000,
    rating: 4.8,
    reviewsCount: 65,
    category: 'Chăm sóc nhà cửa',
  },
];

export default function YeuThichPage() {
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-orange-600 transition">
            Trang chủ
          </Link>
          <FiChevronRight />
          <Link href="/tai-khoan" className="hover:text-orange-600 transition">
            Tài khoản
          </Link>
          <FiChevronRight />
          <span className="text-gray-800 font-medium">Sản phẩm yêu thích</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl shrink-0">
              <FiHeart />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Danh sách yêu thích
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                Lưu lại các thiết bị gia dụng yêu thích để theo dõi biến động giá và ưu đãi
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-auto">
            {items.length} Sản phẩm
          </span>
        </div>

        {/* Product Grid */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <FiHeart className="text-5xl mx-auto text-gray-200 mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Danh sách yêu thích đang trống</h3>
            <p className="text-xs text-gray-400 mt-1 mb-6">
              Bạn chưa lưu sản phẩm nào. Hãy bấm biểu tượng trái tim khi xem sản phẩm để lưu lại nhé!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow transition"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const discount = Math.round(
                ((item.originalPrice - item.price) / item.originalPrice) * 100
              );
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition flex flex-col justify-between group"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 rounded-2xl object-cover"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-lg shadow">
                        -{discount}%
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center shadow transition"
                      title="Xóa khỏi yêu thích"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>

                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm mt-1 leading-snug line-clamp-2">
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                        <span className="flex items-center text-amber-500 font-bold">
                          <FiStar className="fill-amber-400 mr-0.5" />
                          {item.rating}
                        </span>
                        <span>•</span>
                        <span>{item.reviewsCount} đánh giá</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-base font-extrabold text-orange-600 block">
                          {item.price.toLocaleString('vi-VN')} ₫
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {item.originalPrice.toLocaleString('vi-VN')} ₫
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                          addedId === item.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        {addedId === item.id ? (
                          <>
                            <FiCheck className="text-sm" />
                            <span>Đã thêm</span>
                          </>
                        ) : (
                          <>
                            <FiShoppingCart className="text-sm" />
                            <span>Thêm giỏ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
