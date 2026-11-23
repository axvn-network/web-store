'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomer } from '@/lib/customerContext';
import { FiCheck, FiArrowLeft, FiShield, FiRefreshCw } from 'react-icons/fi';

function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useCustomer();

  const identifier = searchParams.get('identifier') || '0988123456';
  const type = searchParams.get('type') || 'login';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle digit input & auto focus next
  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1); // only single digit
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Auto-advance
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    const code = newDigits.join('');
    if (code.length === 6) {
      submitCode(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    if (pasted.length === 6) {
      submitCode(pasted);
    } else {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const submitCode = async (code: string) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          code,
          type,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Mã xác nhận không đúng hoặc đã hết hạn.');
        setLoading(false);
        return;
      }

      setSuccess('Xác thực thành công!');

      if (type === 'reset') {
        setTimeout(() => {
          router.push(`/dat-lai-mat-khau/token-${Date.now()}?identifier=${encodeURIComponent(identifier)}`);
        }, 800);
      } else {
        if (data.user) {
          login(data.user);
        }
        setTimeout(() => {
          router.push('/tai-khoan/thong-tin');
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type }),
      });
      const data = await res.json();
      if (data.success) {
        setCountdown(60);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.error || 'Chưa thể gửi lại mã, vui lòng đợi');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi gửi lại mã');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-8 sm:p-10 text-center">
        <div className="flex justify-start mb-6">
          <Link
            href="/dang-nhap"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#f53d2d] transition"
          >
            <FiArrowLeft />
            <span>Quay lại</span>
          </Link>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#f53d2d] mx-auto flex items-center justify-center text-3xl shadow-inner mb-4">
          <FiShield />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Xác thực mã OTP</h1>
        <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
          Mã xác thực gồm 6 chữ số đã được gửi tới:
          <br />
          <strong className="text-gray-900">{identifier}</strong>
        </p>

        {error && (
          <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center justify-center gap-1.5">
            <FiCheck />
            <span>{success}</span>
          </div>
        )}

        {/* 6 Digit Inputs */}
        <div className="flex justify-center gap-2.5 my-8" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-extrabold rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#f53d2d] focus:outline-none transition shadow-sm"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => submitCode(digits.join(''))}
          disabled={loading || digits.join('').length < 6}
          className="w-full py-3.5 px-4 bg-[#f53d2d] hover:bg-[#e03122] text-white font-semibold rounded-xl shadow-lg shadow-[#f53d2d]/20 hover:shadow-[#f53d2d]/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Xác nhận'
          )}
        </button>

        {/* Resend Action */}
        <div className="mt-6 text-sm text-gray-500">
          {countdown > 0 ? (
            <p>
              Gửi lại mã sau <span className="font-semibold text-[#f53d2d]">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 font-semibold text-[#f53d2d] hover:underline transition"
            >
              <FiRefreshCw className={resending ? 'animate-spin' : ''} />
              <span>Gửi lại mã OTP</span>
            </button>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400">
          Mẹo demo: Bạn có thể nhập mã OTP thử nghiệm <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-bold">123456</code>
        </div>
      </div>
    </div>
  );
}

export default function XacThucOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <OtpVerificationForm />
    </Suspense>
  );
}
