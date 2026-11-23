'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

export interface Translations {
  // Header & Nav
  home: string;
  products: string;
  allProducts: string;
  categories: string;
  flashSale: string;
  bestsellers: string;
  newArrivals: string;
  news: string;
  about: string;
  contact: string;
  showrooms: string;
  orderTracking: string;
  adminPortal: string;
  searchPlaceholder: string;
  search: string;
  hotline: string;
  support247: string;
  cart: string;
  favorites: string;
  account: string;
  login: string;
  register: string;
  logout: string;
  
  // Product Card & Detail
  addToCart: string;
  addedToCart: string;
  buyNow: string;
  outOfStock: string;
  inStock: string;
  sold: string;
  installment: string;
  save: string;
  genuine: string;
  reviews: string;
  specs: string;
  description: string;
  features: string;
  quantity: string;
  relatedProducts: string;
  
  // Cart & Checkout
  cartTitle: string;
  emptyCart: string;
  exploreProducts: string;
  orderSummary: string;
  subtotal: string;
  shippingFee: string;
  freeShipping: string;
  discount: string;
  total: string;
  proceedToCheckout: string;
  voucherCode: string;
  apply: string;
  customerInfo: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  note: string;
  paymentMethod: string;
  codPayment: string;
  vietqrPayment: string;
  momoPayment: string;
  placeOrder: string;
  orderSuccess: string;
  
  // Filter & Sort
  filterTitle: string;
  priceRange: string;
  brand: string;
  sortBy: string;
  featured: string;
  priceLowHigh: string;
  priceHighLow: string;
  ratingHigh: string;
  clearFilters: string;
  applyFilter: string;
}

const translations: Record<Language, Translations> = {
  vi: {
    home: 'Trang chủ',
    products: 'Sản phẩm',
    allProducts: 'Tất cả sản phẩm',
    categories: 'Danh mục sản phẩm',
    flashSale: 'Flash Sale Giờ Vàng',
    bestsellers: 'Bán chạy nhất',
    newArrivals: 'Hàng mới về',
    news: 'Tin tức & Khuyến mãi',
    about: 'Giới thiệu',
    contact: 'Liên hệ',
    showrooms: 'Hệ thống Showroom',
    orderTracking: 'Tra cứu đơn hàng',
    adminPortal: 'Khu vực Quản trị (Admin)',
    searchPlaceholder: 'Tìm nồi chiên, bếp từ, robot hút bụi...',
    search: 'Tìm kiếm',
    hotline: 'Hotline CSKH',
    support247: 'Tư vấn miễn phí 24/7',
    cart: 'Giỏ hàng',
    favorites: 'Yêu thích',
    account: 'Tài khoản',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    
    addToCart: 'Thêm vào giỏ',
    addedToCart: 'Đã thêm vào giỏ!',
    buyNow: 'Mua ngay (Giao 24h)',
    outOfStock: 'Hết hàng',
    inStock: 'Còn hàng tại tổng kho',
    sold: 'Đã bán',
    installment: 'Trả góp 0%',
    save: 'Tiết kiệm',
    genuine: '100% Chính hãng',
    reviews: 'đánh giá',
    specs: 'Thông Số Kỹ Thuật',
    description: 'Mô Tả Sản Phẩm Chi Tiết',
    features: 'Tính năng nổi bật',
    quantity: 'Số lượng',
    relatedProducts: 'Sản Phẩm Tương Tự Cùng Danh Mục',
    
    cartTitle: 'Giỏ Hàng Của Bạn',
    emptyCart: 'Giỏ hàng của bạn đang trống',
    exploreProducts: 'Khám phá sản phẩm ngay',
    orderSummary: 'Chi Tiết Đơn Hàng',
    subtotal: 'Tạm tính tiền hàng',
    shippingFee: 'Phí vận chuyển',
    freeShipping: 'Miễn phí giao hàng',
    discount: 'Giảm giá voucher',
    total: 'Tổng thanh toán',
    proceedToCheckout: 'Tiến hành đặt hàng ngay',
    voucherCode: 'Mã giảm giá / Voucher',
    apply: 'Áp dụng',
    customerInfo: 'Thông Tin Nhận Hàng',
    fullName: 'Họ và tên người nhận',
    phone: 'Số điện thoại di động',
    address: 'Địa chỉ cụ thể (Số nhà, tên đường)',
    city: 'Tỉnh / Thành phố',
    district: 'Quận / Huyện',
    note: 'Ghi chú giao hàng',
    paymentMethod: 'Phương Thức Thanh Toán',
    codPayment: 'Thanh toán khi nhận hàng (COD)',
    vietqrPayment: 'Chuyển khoản VietQR / Napas 247',
    momoPayment: 'Ví điện tử MoMo',
    placeOrder: 'Đặt Mua Ngay',
    orderSuccess: 'Đặt Hàng Thành Công!',
    
    filterTitle: 'BỘ LỌC TÌM KIẾM',
    priceRange: 'Khoảng giá (VND)',
    brand: 'Thương hiệu',
    sortBy: 'Sắp xếp',
    featured: 'Nổi bật nhất',
    priceLowHigh: 'Giá: Thấp đến Cao',
    priceHighLow: 'Giá: Cao đến Thấp',
    ratingHigh: 'Đánh giá cao',
    clearFilters: 'Xóa tất cả',
    applyFilter: 'Áp dụng bộ lọc',
  },
  en: {
    home: 'Home',
    products: 'Products',
    allProducts: 'All Products',
    categories: 'Categories',
    flashSale: 'Flash Sale Deals',
    bestsellers: 'Bestsellers',
    newArrivals: 'New Arrivals',
    news: 'News & Promotions',
    about: 'About Us',
    contact: 'Contact',
    showrooms: 'Showrooms',
    orderTracking: 'Track Order',
    adminPortal: 'Admin Dashboard',
    searchPlaceholder: 'Search air fryers, induction cookers, robot vacuums...',
    search: 'Search',
    hotline: 'Hotline',
    support247: 'Free Support 24/7',
    cart: 'Cart',
    favorites: 'Favorites',
    account: 'Account',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart!',
    buyNow: 'Buy Now (24h Delivery)',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock in Warehouse',
    sold: 'Sold',
    installment: '0% Installment',
    save: 'Save',
    genuine: '100% Genuine',
    reviews: 'reviews',
    specs: 'Specifications',
    description: 'Product Description',
    features: 'Key Features',
    quantity: 'Quantity',
    relatedProducts: 'Related Products in Category',
    
    cartTitle: 'Your Shopping Cart',
    emptyCart: 'Your cart is currently empty',
    exploreProducts: 'Explore Products Now',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shippingFee: 'Shipping Fee',
    freeShipping: 'Free Shipping',
    discount: 'Voucher Discount',
    total: 'Total Payment',
    proceedToCheckout: 'Proceed to Checkout',
    voucherCode: 'Promo / Voucher Code',
    apply: 'Apply',
    customerInfo: 'Shipping Information',
    fullName: 'Full Name',
    phone: 'Phone Number',
    address: 'Street Address',
    city: 'Province / City',
    district: 'District',
    note: 'Delivery Note',
    paymentMethod: 'Payment Method',
    codPayment: 'Cash on Delivery (COD)',
    vietqrPayment: 'VietQR / Napas 247 Bank Transfer',
    momoPayment: 'MoMo E-Wallet',
    placeOrder: 'Place Order Now',
    orderSuccess: 'Order Placed Successfully!',
    
    filterTitle: 'FILTER PRODUCTS',
    priceRange: 'Price Range',
    brand: 'Brand',
    sortBy: 'Sort by',
    featured: 'Featured',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',
    ratingHigh: 'Top Rated',
    clearFilters: 'Clear All',
    applyFilter: 'Apply Filters',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: translations.vi,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('betashop_lang') as Language;
    if (saved === 'vi' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('betashop_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
