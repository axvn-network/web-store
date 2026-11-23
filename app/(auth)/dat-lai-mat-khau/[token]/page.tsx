'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight } from 'react-icons/fi';

export default function DatLaiMatKhauPage() {
  const router = useRouter();
  const params = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    // Simulate API update
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/dang-nhap');
      }, 1500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center text-2xl shadow-inner mb-4">
            <FiLock />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đặt lại mật khẩu</h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Tạo mật khẩu mới mạnh mẽ để bảo vệ tài khoản mua sắm của bạn.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <FiCheck />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đổi mật khẩu thành công!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Bạn có thể đăng nhập ngay với mật khẩu mới. Hệ thống đang chuyển hướng...
            </p>
            <Link
              href="/dang-nhap"
              className="inline-flex items-center gap-2 py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg transition"
            >
              <span>Đăng nhập ngay</span>
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Mật khẩu mới
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Nhập lại mật khẩu mới
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Lưu mật khẩu mới'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
