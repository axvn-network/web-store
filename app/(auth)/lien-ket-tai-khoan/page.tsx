'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiLink, FiLock, FiCheck, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaTelegramPlane } from 'react-icons/fa';

function LienKetTaiKhoanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'an.nguyen@gmail.com';
  const provider = searchParams.get('provider') || 'google';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'email',
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Mật khẩu không chính xác');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/tai-khoan/thong-tin');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-8 sm:p-10">
        <Link
          href="/dang-nhap"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-600 transition mb-6"
        >
          <FiArrowLeft />
          <span>Hủy bỏ</span>
        </Link>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center text-2xl shadow-inner mb-4">
            <FiLink />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Liên kết tài khoản</h1>
          <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
            Địa chỉ email <strong className="text-gray-800">{email}</strong> đã tồn tại trên hệ thống.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-xs text-amber-800 flex items-start gap-2.5">
          <FiAlertCircle className="text-base shrink-0 mt-0.5 text-amber-600" />
          <span>
            Để hợp nhất đăng nhập bằng{' '}
            <strong className="capitalize">{provider}</strong> với tài khoản hiện có của bạn, vui lòng nhập mật khẩu tài khoản BetaShop để xác nhận quyền sở hữu.
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-4 text-emerald-600">
            <FiCheck className="text-3xl mx-auto mb-2" />
            <p className="font-bold text-base">Liên kết tài khoản thành công!</p>
            <p className="text-xs text-gray-500 mt-1">Đang chuyển tới trang quản lý tài khoản...</p>
          </div>
        ) : (
          <form onSubmit={handleLink} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu tài khoản"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Xác nhận liên kết'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LienKetTaiKhoanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <LienKetTaiKhoanForm />
    </Suspense>
  );
}
