'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useCustomer } from '@/lib/customerContext';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';

function AuthCallbackContent() {
  const router = useRouter();
  const { login } = useCustomer();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang hoàn tất xác thực tài khoản...');

  useEffect(() => {
    let isSubscribed = true;

    async function handleAuth() {
      try {
        // Nếu có mã code trong URL (PKCE flow), tiến hành exchange code
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          }
        }

        // Lấy session từ Supabase OAuth
        let { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // Nếu chưa có session ngay lập tức, thử chờ 500ms
        if (!session) {
          await new Promise((res) => setTimeout(res, 500));
          const retry = await supabase.auth.getSession();
          session = retry.data.session;
        }

        if (session?.user && isSubscribed) {
          const user = session.user;
          const userMetadata = user.user_metadata || {};

          // Đồng bộ thông tin người dùng vào hệ thống
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              method: 'google',
              googleProfile: {
                id: user.id,
                name: userMetadata.full_name || userMetadata.name || user.email?.split('@')[0],
                email: user.email,
                picture: userMetadata.avatar_url || userMetadata.picture,
              },
            }),
          });

          const data = await res.json();
          if (data.success && data.user) {
            login(data.user);
            setStatus('success');
            setMessage('Đăng nhập Google thành công! Đang chuyển hướng...');
            setTimeout(() => {
              router.push('/tai-khoan/thong-tin');
            }, 600);
            return;
          }
        }

        if (isSubscribed) {
          // Nếu không có session, chuyển về trang đăng nhập
          router.push('/dang-nhap');
        }
      } catch (err: any) {
        console.error('OAuth Callback Error:', err);
        if (isSubscribed) {
          setStatus('error');
          setMessage(err.message || 'Xác thực không thành công. Đang chuyển về trang đăng nhập...');
          setTimeout(() => {
            router.push('/dang-nhap');
          }, 1500);
        }
      }
    }

    handleAuth();

    return () => {
      isSubscribed = false;
    };
  }, [login, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-gray-100 text-center space-y-4">
        {status === 'loading' ? (
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-2xl mx-auto shadow-inner animate-pulse">
            <FiLoader className="animate-spin text-3xl" />
          </div>
        ) : status === 'success' ? (
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
            <FiCheckCircle className="text-3xl" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
            ⚠️
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Xác thực Google OAuth</h2>
        <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang kết nối...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
