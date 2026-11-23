'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { 
  AiFillStar, 
  AiOutlineShoppingCart, 
  AiOutlineHeart,
  AiOutlineShareAlt
} from 'react-icons/ai';
import { 
  BiCheckCircle, 
  BiShieldQuarter, 
  BiRefresh, 
  BiCar, 
  BiHomeAlt, 
  BiChevronRight,
  BiPlus,
  BiMinus
} from 'react-icons/bi';
import { STORE_PRODUCTS } from '@/data/storeData';
import { formatVND } from '@/lib/utils';
import { useCart } from '@/lib/cartStore';
import ProductCard from '@/components/store/ProductCard';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const product = STORE_PRODUCTS.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState<string>(product?.image || '');
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center my-8 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Không tìm thấy sản phẩm</h2>
        <p className="text-sm text-gray-500">Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</p>
        <Link
          href="/san-pham"
          className="inline-block px-6 py-2.5 bg-[#f53d2d] text-white rounded-xl font-bold text-sm"
        >
          Quay lại danh mục sản phẩm
        </Link>
      </div>
    );
  }

  const relatedProducts = STORE_PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  const discountPercent =
    product.discount ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/gio-hang');
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <Link href="/san-pham" className="hover:text-orange-600">
          Sản phẩm
        </Link>
        <BiChevronRight className="text-gray-400" />
        <Link
          href={`/san-pham?danh-muc=${product.categorySlug}`}
          className="hover:text-orange-600 truncate max-w-[120px]"
        >
          {product.category}
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Main Product Card Box */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          {/* Left: Product Images Gallery */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
              <img
                src={selectedImg || product.image}
                alt={product.title}
                className="w-full h-full object-cover transition duration-300"
              />
              {discountPercent && (
                <span className="absolute top-3 left-3 bg-[#f53d2d] text-white text-xs font-black px-2 py-1 rounded-md shadow">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail Gallery (sample thumbnails) */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {[product.image, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80'].map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImg(imgUrl)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    (selectedImg || product.image) === imgUrl
                      ? 'border-[#f53d2d] shadow-sm'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info & Purchase Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Brand and Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  Thương hiệu: {product.brand}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <BiCheckCircle /> Còn hàng tại tổng kho
                </span>
              </div>

              {/* Title */}
              <h1 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 leading-snug">
                {product.title}
              </h1>

              {/* Rating and Sold */}
              <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-gray-500 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <AiFillStar className="text-base" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span>|</span>
                <span className="text-gray-600 underline cursor-pointer">
                  {product.reviewCount} đánh giá
                </span>
                <span>|</span>
                <span className="text-gray-600">Đã bán {product.sold} chiếc</span>
              </div>

              {/* Price Area */}
              <div className="mt-4 p-3.5 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-[#f53d2d]">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="bg-[#f53d2d] text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                    Tiết kiệm {discountPercent}%
                  </span>
                )}
              </div>

              {/* Promotional Highlights */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5 text-xs text-gray-700">
                <p className="font-bold text-gray-900 uppercase text-[11px] tracking-wide text-orange-600">
                  🎁 Ưu đãi đặc quyền khi mua hôm nay:
                </p>
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <BiCheckCircle className="text-emerald-500 text-sm flex-shrink-0" />
                    <span>Miễn phí giao hàng toàn quốc cho đơn hàng từ 1.000.000₫</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <BiCheckCircle className="text-emerald-500 text-sm flex-shrink-0" />
                    <span>Bảo hành chính hãng 12-24 tháng tại nhà</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <BiCheckCircle className="text-emerald-500 text-sm flex-shrink-0" />
                    <span>Hỗ trợ 1 đổi 1 trong vòng 30 ngày nếu có lỗi từ nhà sản xuất</span>
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs sm:text-sm font-bold text-gray-700">Số lượng:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 sm:p-2.5 hover:bg-gray-200 text-gray-600 transition active:scale-95"
                    aria-label="Giảm"
                  >
                    <BiMinus className="text-sm" />
                  </button>
                  <span className="px-4 text-xs sm:text-sm font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 sm:p-2.5 hover:bg-gray-200 text-gray-600 transition active:scale-95"
                    aria-label="Tăng"
                  >
                    <BiPlus className="text-sm" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">Có sẵn {product.quantity || 50} sản phẩm</span>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3 px-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
              >
                <AiOutlineShoppingCart className="text-xl" />
                <span>Thêm vào giỏ hàng</span>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3 px-4 bg-gradient-to-r from-[#f53d2d] to-[#ff6633] hover:from-[#e03122] hover:to-[#f53d2d] text-white font-extrabold text-sm rounded-xl transition active:scale-95 shadow-md flex items-center justify-center"
              >
                Mua ngay (Giao 24h)
              </button>
            </div>

            {product.categorySlug === 'cloud-vps' && (
              <div className="mt-3">
                <Link
                  href="/cloud-vps"
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <span>⚡ Cấu hình Hệ điều hành (Windows/Linux) & Đặt theo chu kỳ giảm 15% tại Cổng Cloud VPS &rarr;</span>
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Description & Technical Specifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Description & Features */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base sm:text-lg font-black text-gray-900 border-l-4 border-[#f53d2d] pl-3 uppercase">
            Mô Tả Sản Phẩm Chi Tiết
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {product.features && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                Tính năng nổi bật:
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-700 list-disc list-inside">
                {product.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Genuine Guarantee Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
            <BiShieldQuarter className="text-2xl text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold">Cam kết nguồn gốc xuất xứ</strong>
              <span>
                Tất cả sản phẩm tại Betashop đều có hóa đơn VAT, chứng từ nhập khẩu và tem bảo hành điện tử chính hãng. Quý khách được kiểm tra hàng trước khi thanh toán.
              </span>
            </div>
          </div>
        </div>

        {/* Specs Table */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <h2 className="text-base font-black text-gray-900 border-l-4 border-[#f53d2d] pl-3 uppercase">
            Thông Số Kỹ Thuật
          </h2>
          {product.specs ? (
            <div className="divide-y divide-gray-100 text-xs">
              {Object.entries(product.specs).map(([key, val], idx) => (
                <div key={idx} className="py-2.5 flex justify-between gap-4">
                  <span className="text-gray-500 font-medium">{key}</span>
                  <span className="text-gray-900 font-bold text-right">{val}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Đang cập nhật thông số chi tiết...</p>
          )}
        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight mb-4 border-l-4 border-[#f53d2d] pl-3">
            Sản Phẩm Tương Tự Cùng Danh Mục
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Toast feedback */}
      {addedToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <BiCheckCircle className="text-lg" />
          <span>Đã thêm sản phẩm vào giỏ hàng thành công!</span>
        </div>
      )}

      {/* Sticky Mobile Purchase Bar (App-like UX) */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-gray-200 p-2.5 flex items-center gap-2 shadow-2xl">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-1/2 py-2.5 bg-orange-50 border border-orange-200 text-orange-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-95"
        >
          <AiOutlineShoppingCart className="text-base" />
          <span>Thêm vào giỏ</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-1/2 py-2.5 bg-[#f53d2d] text-white font-bold text-xs rounded-xl shadow active:scale-95 text-center"
        >
          Mua ngay ({formatVND(product.price)})
        </button>
      </div>
    </div>
  );
}
