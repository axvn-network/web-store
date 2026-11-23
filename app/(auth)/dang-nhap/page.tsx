'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { FaTelegramPlane } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useCustomer } from '@/lib/customerContext';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCustomer();

  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email form
  const [email, setEmail] = useState('an.nguyen@gmail.com');
  const [password, setPassword] = useState('12345678');

  // Phone form
  const [phone, setPhone] = useState('0988123456');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Handle Send OTP
  const handleSendOtp = async () => {
    if (!phone || phone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ (10 chữ số).');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone, type: 'login' }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setOtpSent(true);
        setCooldown(60);
        // Cooldown timer
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || 'Gửi OTP thất bại.');
      }
    } catch (e: any) {
      setLoading(false);
      setError('Lỗi kết nối máy chủ.');
    }
  };

  // Handle Submit (Email or Phone OTP)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'email') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'email', email, password }),
        });
        const data = await res.json();
        setLoading(false);

        if (data.success && data.user) {
          login(data.user);
          router.push('/tai-khoan/thong-tin');
        } else {
          setError(data.error || 'Email hoặc mật khẩu không chính xác.');
        }
      } else {
        // Phone + OTP
        const res = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: phone, code: otp || '123456', type: 'login' }),
        });
        const data = await res.json();
        setLoading(false);

        if (data.success && data.user) {
          login(data.user);
          router.push('/tai-khoan/thong-tin');
        } else {
          setError(data.error || 'Mã OTP không đúng hoặc đã hết hạn.');
        }
      }
    } catch (e: any) {
      setLoading(false);
      setError('Lỗi đăng nhập hệ thống.');
    }
  };

  // Google OAuth qua Supabase hoặc fallback API
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        console.warn('Supabase Google OAuth fallback test mode:', oauthError);
        // Fallback demo login nếu chưa cấu hình Google Client ID trên Supabase console
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
          setError(resData.error || 'Đăng nhập Google thất bại');
        }
      }
    } catch (e: any) {
      console.error('Google login error:', e);
      setError(e.message || 'Lỗi kết nối Google Login');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Telegram Login Callback
  const handleTelegramLogin = async () => {
    setTelegramLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/telegram/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 99887766,
          first_name: 'Minh',
          last_name: 'Trần',
          username: 'minhtran_betashop',
          auth_date: Math.floor(Date.now() / 1000),
          hash: 'DEMO_HASH',
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        login(data.user);
        router.push('/tai-khoan/thong-tin');
      } else {
        setError(data.error || 'Đăng nhập Telegram thất bại');
      }
    } catch (e: any) {
      setError(e.message || 'Lỗi kết nối Telegram');
    } finally {
      setTelegramLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-12 px-3 sm:px-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="inline-block">
                <span className="bg-[#f53d2d] text-white font-black text-lg px-2.5 py-1 rounded shadow-sm">
                  BETASHOP
                </span>
              </Link>
              <Link href="/dang-ky" className="text-xs font-bold text-orange-600 hover:underline">
                Chưa có tài khoản? Đăng ký ngay
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Đăng Nhập Tài Khoản
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Quản lý đơn hàng, theo dõi bảo hành điện tử và tích điểm đổi quà
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Channel Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setTab('email');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  tab === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Đăng nhập Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('phone');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  tab === 'phone' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Số Điện Thoại + OTP
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'email' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vidu@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700">Mật khẩu</label>
                      <Link href="/quen-mat-khau" className="text-[11px] text-orange-600 hover:underline">
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-orange-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại di động</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="09xx xxx xxx"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-orange-500 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || cooldown > 0}
                        className="px-3 sm:px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl border border-orange-200 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {cooldown > 0 ? `${cooldown}s` : otpSent ? 'Gửi lại' : 'Gửi mã OTP'}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-gray-700">Mã xác thực OTP (6 chữ số)</label>
                        <span className="text-[10px] text-emerald-600 font-bold">Mã mẫu test: 123456</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#f53d2d]/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{loading ? 'Đang xử lý...' : 'Đăng Nhập Ngay'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Social logins */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <span className="text-center block text-[11px] text-gray-400 font-semibold mb-3">
                Hoặc tiếp tục với tài khoản mạng xã hội
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2.5 py-2.5 px-3 border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 rounded-xl transition text-xs sm:text-sm font-semibold text-gray-700 shadow-sm active:scale-[0.98] disabled:opacity-60"
                  title="Đăng nhập bảo mật qua tài khoản Google"
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
                  title="Đăng nhập nhanh qua Telegram"
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
            </div>
          </div>

          <div className="pt-4 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mã hóa bảo mật 256-bit chuẩn thương mại điện tử</span>
          </div>
        </div>

        {/* Right Visual (5 cols) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#f53d2d] via-[#ff5522] to-[#ff7744] p-10 text-white flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-200" />
              Đặc quyền thành viên Betashop
            </span>
            <h2 className="text-2xl font-black leading-snug">
              Trải Nghiệm Mua Sắm Gia Dụng Đỉnh Cao
            </h2>
            <ul className="space-y-3 text-xs text-orange-100 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span>Bảo hành điện tử 12 - 36 tháng kích hoạt tự động theo số điện thoại.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span>Tích lũy 1% giá trị đơn hàng quy đổi voucher mua sắm giảm giá trực tiếp.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span>Theo dõi hành trình bưu kiện giao nhanh 24-48h trên toàn quốc.</span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs">
            <p className="font-semibold text-white">Chương trình Đối tác & CTV Affiliate:</p>
            <p className="text-orange-100 text-[11px] mt-0.5">
              Nhận hoa hồng lên tới 10% khi chia sẻ sản phẩm đồ gia dụng chính hãng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
