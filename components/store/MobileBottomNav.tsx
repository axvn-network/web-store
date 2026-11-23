'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BiHomeAlt, 
  BiGridAlt, 
  BiSearch, 
  BiUser
} from 'react-icons/bi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useCart } from '@/lib/cartStore';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalCount, isLoaded } = useCart();

  const navItems = [
    { label: 'Trang chủ', href: '/', icon: BiHomeAlt },
    { label: 'Danh mục', href: '/san-pham', icon: BiGridAlt },
    { label: 'Tìm kiếm', href: '/san-pham?focus=search', icon: BiSearch },
    { 
      label: 'Giỏ hàng', 
      href: '/gio-hang', 
      icon: AiOutlineShoppingCart, 
      badge: isLoaded && totalCount > 0 ? totalCount : null 
    },
    { label: 'Tài khoản', href: '/tai-khoan', icon: BiUser },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1 shadow-lg pb-safe">
      <div className="grid grid-cols-5 items-center justify-around">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/tai-khoan' && pathname.startsWith('/tai-khoan'));

          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 relative transition active:scale-90 ${
                isActive ? 'text-[#f53d2d] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className="text-xl sm:text-2xl" />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-[#f53d2d] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
