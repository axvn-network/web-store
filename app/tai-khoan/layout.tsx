'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCustomer } from '@/lib/customerContext';
import {
  FiUser,
  FiMapPin,
  FiLock,
  FiShield,
  FiBell,
  FiShoppingBag,
  FiHeart,
  FiStar,
  FiAward,
  FiTag,
  FiLogOut,
  FiShare2,
  FiChevronRight,
} from 'react-icons/fi';

export default function TaiKhoanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useCustomer();

  const handleLogout = () => {
    logout();
    router.push('/dang-nhap');
  };

  const menuSections = [
    {
      title: 'Tài khoản của tôi',
      items: [
        { href: '/tai-khoan/thong-tin', label: 'Hồ sơ cá nhân', icon: FiUser },
        { href: '/tai-khoan/dia-chi', label: 'Sổ địa chỉ nhận hàng', icon: FiMapPin },
        { href: '/tai-khoan/doi-mat-khau', label: 'Đổi mật khẩu', icon: FiLock },
        { href: '/tai-khoan/bao-mat', label: 'Bảo mật & Thiết bị', icon: FiShield },
        { href: '/tai-khoan/thong-bao', label: 'Thông báo', icon: FiBell },
      ],
    },
    {
      title: 'Mua sắm & Đãi ngộ',
      items: [
        { href: '/don-hang', label: 'Đơn hàng của tôi', icon: FiShoppingBag },
        { href: '/yeu-thich', label: 'Sản phẩm yêu thích', icon: FiHeart },
        { href: '/danh-gia', label: 'Đánh giá sản phẩm', icon: FiStar },
        { href: '/diem-thuong', label: 'Điểm thưởng thành viên', icon: FiAward },
        { href: '/vi-voucher', label: 'Ví Voucher ưu đãi', icon: FiTag },
      ],
    },
    {
      title: 'Kênh đối tác',
      items: [
        { href: '/cong-tac-vien', label: 'Cộng tác viên (Affiliate)', icon: FiShare2 },
      ],
    },
  ];

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case 'DIAMOND':
        return { label: 'Hạng Kim Cương', bg: 'bg-amber-50 text-amber-700 border-amber-300 font-extrabold' };
      case 'GOLD':
        return { label: 'Hạng Vàng', bg: 'bg-orange-50 text-[#f53d2d] border-orange-200 font-bold' };
      case 'SILVER':
        return { label: 'Hạng Bạc', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: 'Hạng Đồng', bg: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const tierInfo = getTierBadge(user?.tier);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#f53d2d] transition">
            Trang chủ
          </Link>
          <FiChevronRight />
          <span className="text-gray-800 font-medium">Trung tâm tài khoản</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user?.name || 'Khách hàng'}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-orange-50 border-2 border-white shadow"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{user?.name || 'Nguyễn Văn An'}</h3>
                  <p className="text-xs text-gray-400 truncate">{user?.email || user?.phone || 'Chưa cập nhật'}</p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 text-[11px] rounded-full border ${tierInfo.bg}`}
                  >
                    {tierInfo.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                <Link
                  href="/diem-thuong"
                  className="p-3 bg-orange-50/50 hover:bg-orange-50 rounded-2xl border border-orange-100/60 transition text-center group"
                >
                  <span className="text-xs text-[#f53d2d]/80 font-medium block">Điểm tích lũy</span>
                  <span className="text-lg font-black text-[#f53d2d] group-hover:scale-105 inline-block transition">
                    {user?.points?.toLocaleString('vi-VN') || 0}
                  </span>
                </Link>
                <Link
                  href="/vi-voucher"
                  className="p-3 bg-amber-50/50 hover:bg-amber-50 rounded-2xl border border-amber-100/60 transition text-center group"
                >
                  <span className="text-xs text-amber-700/80 font-medium block">Kho Voucher</span>
                  <span className="text-lg font-black text-amber-600 group-hover:scale-105 inline-block transition">
                    4 Mã
                  </span>
                </Link>
              </div>
            </div>

            {/* Menu Links */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {menuSections.map((section, sIdx) => (
                <div key={sIdx} className="p-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-3">
                    {section.title}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item, iIdx) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={iIdx}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                            isActive
                              ? 'bg-orange-50 text-[#f53d2d] font-bold shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`text-lg shrink-0 ${isActive ? 'text-[#f53d2d]' : 'text-gray-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="p-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <FiLogOut className="text-lg shrink-0 text-red-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-8 xl:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
