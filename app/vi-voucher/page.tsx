'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiTag,
  FiCopy,
  FiCheck,
  FiChevronRight,
  FiClock,
  FiInfo,
} from 'react-icons/fi';

interface VoucherItem {
  id: string;
  code: string;
  title: string;
  discount: string;
  minOrder: string;
  expiry: string;
  type: 'FREESHIP' | 'DISCOUNT' | 'VIP';
  used: boolean;
}

const SAMPLE_VOUCHERS: VoucherItem[] = [
  {
    id: 'vc-1',
    code: 'FREESHIP30K',
    title: 'Miễn phí vận chuyển toàn quốc',
    discount: 'Giảm tối đa 30.000₫ phí ship',
    minOrder: 'Đơn hàng từ 300.000₫',
    expiry: 'Còn 15 ngày (Hết hạn 30/11/2026)',
    type: 'FREESHIP',
    used: false,
  },
  {
    id: 'vc-2',
    code: 'GIADUNG50K',
    title: 'Voucher Giảm 50.000₫ Gia dụng',
    discount: 'Giảm trực tiếp 50.000₫',
    minOrder: 'Đơn hàng từ 500.000₫',
    expiry: 'Còn 5 ngày (Hết hạn 22/11/2026)',
    type: 'DISCOUNT',
    used: false,
  },
  {
    id: 'vc-3',
    code: 'VIPGOLD100K',
    title: 'Đặc quyền thành viên Hạng Vàng',
    discount: 'Giảm 100.000₫ cho Robot & Nồi chiên',
    minOrder: 'Đơn hàng từ 2.000.000₫',
    expiry: 'Còn 25 ngày (Hết hạn 10/12/2026)',
    type: 'VIP',
    used: false,
  },
  {
    id: 'vc-4',
    code: 'BETACHAO2026',
    title: 'Mã chào mừng tân khách hàng',
    discount: 'Giảm 10% tối đa 150.000₫',
    minOrder: 'Đơn hàng từ 1.000.000₫',
    expiry: 'Còn 45 ngày (Hết hạn 31/12/2026)',
    type: 'DISCOUNT',
    used: false,
  },
  {
    id: 'vc-5',
    code: 'HECUOI2026',
    title: 'Khuyến mãi xả kho gia dụng hè',
    discount: 'Giảm 40.000₫',
    minOrder: 'Đơn từ 400.000₫',
    expiry: 'Đã sử dụng ngày 02/11/2026',
    type: 'DISCOUNT',
    used: true,
  },
];

export default function ViVoucherPage() {
  const [tab, setTab] = useState<'ACTIVE' | 'USED'>('ACTIVE');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filtered = SAMPLE_VOUCHERS.filter((v) => (tab === 'ACTIVE' ? !v.used : v.used));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#f53d2d] transition">
            Trang chủ
          </Link>
          <FiChevronRight />
          <Link href="/tai-khoan" className="hover:text-[#f53d2d] transition">
            Tài khoản
          </Link>
          <FiChevronRight />
          <span className="text-gray-800 font-medium">Kho Voucher của tôi</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shrink-0">
              <FiTag />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Ví Voucher ưu đãi
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                Các mã khuyến mãi, freeship và mã độc quyền được lưu riêng cho tài khoản của bạn
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTab('ACTIVE')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                tab === 'ACTIVE' ? 'bg-white text-[#f53d2d] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Có hiệu lực (4)
            </button>
            <button
              type="button"
              onClick={() => setTab('USED')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                tab === 'USED' ? 'bg-white text-[#f53d2d] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đã sử dụng / Hết hạn (1)
            </button>
          </div>
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((voucher) => (
            <div
              key={voucher.id}
              className={`rounded-3xl p-5 border flex flex-col justify-between transition relative overflow-hidden ${
                voucher.used
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : 'bg-white border-orange-100 shadow-sm hover:shadow-md hover:border-orange-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      voucher.type === 'FREESHIP'
                        ? 'bg-blue-100 text-blue-700'
                        : voucher.type === 'VIP'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-orange-100 text-[#f53d2d]'
                    }`}
                  >
                    {voucher.type === 'FREESHIP' ? 'Miễn phí vận chuyển' : voucher.type === 'VIP' ? 'Đặc quyền VIP' : 'Giảm trực tiếp'}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <FiClock />
                    <span>{voucher.expiry}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mt-2">{voucher.title}</h3>
                <p className="text-xs font-extrabold text-[#f53d2d] mt-1">{voucher.discount}</p>
                <p className="text-xs text-gray-500 mt-1">{voucher.minOrder}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-gray-100 text-gray-800 px-2.5 py-1.5 rounded-lg border border-gray-200">
                    {voucher.code}
                  </span>
                  {!voucher.used && (
                    <button
                      type="button"
                      onClick={() => handleCopy(voucher.code)}
                      className="text-xs text-[#f53d2d] hover:underline font-bold inline-flex items-center gap-1 transition"
                    >
                      {copiedCode === voucher.code ? (
                        <>
                          <FiCheck className="text-emerald-600" />
                          <span className="text-emerald-600">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <FiCopy />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {!voucher.used && (
                  <Link
                    href="/"
                    className="px-4 py-1.5 rounded-xl bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold text-xs shadow-sm transition"
                  >
                    Dùng ngay
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
