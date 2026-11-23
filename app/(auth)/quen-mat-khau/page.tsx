'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiPhone, FiArrowLeft, FiCheck, FiKey, FiHelpCircle } from 'react-icons/fi';

export default function QuenMatKhauPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại');
      return;
    }

    setLoading(true);

    try {
      // Call OTP send endpoint
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          type: 'reset',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Không thể gửi mã xác nhận. Vui lòng kiểm tra lại thông tin.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-8 sm:p-10">
        <Link
          href="/dang-nhap"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#f53d2d] transition mb-6"
        >
          <FiArrowLeft />
          <span>Quay lại đăng nhập</span>
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#f53d2d] mx-auto flex items-center justify-center text-2xl shadow-inner mb-4">
            <FiKey />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quên mật khẩu?</h1>
          <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
            Đừng lo lắng! Hãy nhập email hoặc số điện thoại của bạn, chúng tôi sẽ gửi mã đặt lại mật khẩu an toàn.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl mx-auto mb-4">
              <FiCheck />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Đã gửi mã xác nhận!</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Chúng tôi đã gửi mã xác thực khôi phục mật khẩu đến <strong className="text-gray-900">{identifier}</strong>. Vui lòng kiểm tra tin nhắn/hộp thư (cả mục thư rác).
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => router.push(`/xac-thuc-otp?identifier=${encodeURIComponent(identifier)}&type=reset`)}
                className="w-full py-3 px-4 bg-[#f53d2d] hover:bg-[#e03122] text-white font-semibold rounded-xl shadow-lg shadow-[#f53d2d]/20 transition"
              >
                Nhập mã xác nhận ngay
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full py-2.5 px-4 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Thử lại với số / email khác
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Method Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => {
                  setMethod('email');
                  setIdentifier('');
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                  method === 'email' ? 'bg-white text-[#f53d2d] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod('phone');
                  setIdentifier('');
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                  method === 'phone' ? 'bg-white text-[#f53d2d] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Số điện thoại
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                {method === 'email' ? 'Địa chỉ Email đã đăng ký' : 'Số điện thoại đã đăng ký'}
              </label>
              <div className="relative">
                {method === 'email' ? (
                  <FiMail className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                ) : (
                  <FiPhone className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                )}
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={method === 'email' ? 'nhap-email@example.com' : '0988 123 456'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#f53d2d] hover:bg-[#e03122] text-white font-semibold rounded-xl shadow-lg shadow-[#f53d2d]/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Gửi mã xác nhận'
              )}
            </button>

            <div className="pt-4 text-center">
              <span className="text-xs text-gray-400 inline-flex items-center gap-1">
                <FiHelpCircle />
                <span>Cần hỗ trợ? Gọi hotline 1900 6868 (8:00 - 21:00)</span>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
