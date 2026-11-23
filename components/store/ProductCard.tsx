'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AiOutlineShoppingCart, AiFillStar, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BiCheck } from 'react-icons/bi';
import { Product } from '@/data/storeData';
import { formatVND } from '@/lib/utils';
import { useCart } from '@/lib/cartStore';
import { useWishlist } from '@/lib/wishlistStore';

interface Props {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { isFavorite, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const favorited = isFavorite(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent =
    product.discount ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null);

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <Link href={`/san-pham/${product.slug}`} className="flex flex-col flex-1 p-2.5 sm:p-3">
        {/* Image Container with Badges */}
        <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2.5 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Discount Badge */}
          {discountPercent && discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-[#f53d2d] text-white text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded shadow">
              -{discountPercent}%
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 shadow-md flex items-center justify-center transition active:scale-90 z-10"
            title={favorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            aria-label="Yêu thích"
          >
            {favorited ? (
              <AiFillHeart className="text-red-500 text-base" />
            ) : (
              <AiOutlineHeart className="text-base" />
            )}
          </button>

          {/* Installment Badge */}
          <span className="absolute bottom-2 left-2 bg-yellow-400 text-gray-900 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded">
            Trả góp 0%
          </span>

          {/* Brand Tag */}
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm">
            {product.brand}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-[#f53d2d] transition leading-snug">
          {product.title}
        </h3>

        {/* Price Area */}
        <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm sm:text-base font-extrabold text-[#f53d2d]">
            {formatVND(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through">
              {formatVND(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating & Sold count */}
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
          <div className="flex items-center gap-0.5 text-amber-400">
            <AiFillStar className="text-sm" />
            <span className="font-bold text-gray-700">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400">({product.reviewCount})</span>
          </div>
          <span>Đã bán {product.sold}</span>
        </div>
      </Link>

      {/* Quick Add To Cart Button */}
      <div className="p-2 sm:p-2.5 pt-0">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-1.5 sm:py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-orange-50 hover:bg-[#f53d2d] text-[#f53d2d] hover:text-white border border-orange-200 hover:border-[#f53d2d]'
          }`}
        >
          {added ? (
            <>
              <BiCheck className="text-base" /> Đã thêm vào giỏ!
            </>
          ) : (
            <>
              <AiOutlineShoppingCart className="text-sm sm:text-base" /> Thêm vào giỏ
            </>
          )}
        </button>
      </div>
    </div>
  );
}
