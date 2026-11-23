'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomer } from '@/lib/customerContext';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight, FiShield, FiGift } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaTelegramPlane } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';

export default function DangKyPage() {
  const router = useRouter();
  const { login } = useCustomer();

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Google OAuth qua Supabase hoặc fallback API
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        console.warn('Supabase Google OAuth fallback test mode:', oauthError);
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'google',
            googleProfile: {
              id: 'google-demo-12345',
              name: 'Nguyễn Văn An (Google)',
              email: 'an.nguyen@gmail.com',
              picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            },
          }),
        });
        const resData = await res.json();
        if (resData.success && resData.user) {
          login(resData.user);
          router.push('/tai-khoan/thong-tin');
        } else {
          setError(resData.error || 'Đăng ký bằng Google thất bại');
        }
      }
    } catch (e: any) {
      console.error('Google register error:', e);
      setError(e.message || 'Lỗi kết nối Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Telegram Login
  const handleTelegramLogin = async () => {
    setTelegramLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/telegram/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 99887766,
          first_name: 'Khách hàng',
          last_name: 'Telegram',
          username: 'telegram_betashop',
          auth_date: Math.floor(Date.now() / 1000),
          hash: 'DEMO_HASH',
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        login(data.user);
        router.push('/tai-khoan/thong-tin');
      } else {
        setError(data.error || 'Đăng ký qua Telegram thất bại');
      }
    } catch (e: any) {
      setError(e.message || 'Lỗi kết nối Telegram');
    } finally {
      setTelegramLoading(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-gray-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, text: 'Yếu', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { score: 2, text: 'Trung bình', color: 'bg-amber-500' };
    return { score: 3, text: 'Mạnh', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn');
      return;
    }

    if (method === 'email' && !email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    if (method === 'phone' && !phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!agreeTerms) {
      setError('Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: method === 'email' ? email.trim() : undefined,
          phone: method === 'phone' ? phone.trim() : undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Đăng ký không thành công. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      setSuccess('Đăng ký tài khoản thành công! Tặng ngay 100 điểm thưởng thành viên.');
      login(data.user);

      setTimeout(() => {
        router.push('/tai-khoan/thong-tin');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
        {/* Left Branding Side */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#f53d2d] via-[#ff5522] to-[#ff7744] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <span className="w-10 h-10 rounded-xl bg-white text-[#f53d2d] font-extrabold flex items-center justify-center text-xl shadow-md">
                β
              </span>
              <span className="text-2xl font-black tracking-tight text-white">BetaShop</span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Gia nhập cộng đồng người tiêu dùng thông thái
            </h1>
            <p className="text-orange-100 text-sm leading-relaxed mb-6">
              Đăng ký ngay hôm nay để nhận đặc quyền thành viên, tích lũy điểm thưởng và ngập tràn voucher giảm giá mỗi tuần!
            </p>

            <div className="space-y-3.5 mb-8">
              <div className="flex items-center gap-3 text-sm text-orange-50 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
                <FiGift className="text-xl text-yellow-300 shrink-0" />
                <span>Tặng ngay <strong>100 điểm thưởng</strong> khi đăng ký mới</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-orange-50 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
                <FiShield className="text-xl text-emerald-300 shrink-0" />
                <span>Bảo hành chính hãng 100% tại nhà toàn quốc</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-orange-50 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
                <FiCheck className="text-xl text-sky-300 shrink-0" />
                <span>Miễn phí đổi trả trong 30 ngày nếu lỗi kỹ thuật</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-orange-400/40 text-xs text-orange-100 flex items-center justify-between">
            <span>© 2026 BetaShop Vietnam</span>
            <span>Hotline: 1900 6868</span>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="text-center sm:text-left mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Tạo tài khoản mới</h2>
            <p className="text-gray-500 text-sm mt-1">
              Đã có tài khoản BetaShop?{' '}
              <Link href="/dang-nhap" className="font-semibold text-[#f53d2d] hover:underline transition">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* Quick Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full min-h-[44px] flex items-center justify-center gap-2.5 py-2.5 px-3 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 rounded-xl transition text-xs sm:text-sm font-semibold text-gray-700 shadow-sm active:scale-[0.98] disabled:opacity-60"
              title="Đăng ký nhanh qua tài khoản Google"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <FcGoogle className="text-xl shrink-0" />
              )}
              <span className="truncate whitespace-nowrap">
                {googleLoading ? 'Đang kết nối...' : 'Google'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleTelegramLogin}
              disabled={telegramLoading || loading}
              className="w-full min-h-[44px] flex items-center justify-center gap-2.5 py-2.5 px-3 bg-[#24A1DE] hover:bg-[#1f8fc5] text-white rounded-xl transition text-xs sm:text-sm font-semibold shadow-sm active:scale-[0.98] disabled:opacity-60"
              title="Đăng ký nhanh qua Telegram"
            >
              {telegramLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <FaTelegramPlane className="text-lg shrink-0" />
              )}
              <span className="truncate whitespace-nowrap">
                {telegramLoading ? 'Đang kết nối...' : 'Telegram'}
              </span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-medium">Hoặc đăng ký bằng</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Method Selector Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                method === 'email' ? 'bg-white text-[#f53d2d] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email cá nhân
            </button>
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                method === 'phone' ? 'bg-white text-[#f53d2d] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Số điện thoại
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-start gap-2">
              <FiCheck className="text-lg shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            {method === 'email' ? (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent text-sm transition"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0988 123 456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent text-sm transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Mật khẩu đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Độ bảo mật:</span>
                    <span className="font-semibold text-gray-700">{strength.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#f53d2d] focus:ring-[#f53d2d]"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Tôi đồng ý với{' '}
                  <Link href="/chinh-sach" className="text-[#f53d2d] hover:underline">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link href="/chinh-sach" className="text-[#f53d2d] hover:underline">
                    Chính sách bảo mật
                  </Link>{' '}
                  của BetaShop Vietnam.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#f53d2d] hover:bg-[#e03122] text-white font-semibold rounded-xl shadow-lg shadow-[#f53d2d]/20 hover:shadow-[#f53d2d]/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Hoàn tất đăng ký</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
