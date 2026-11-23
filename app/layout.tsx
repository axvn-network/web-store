import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import MobileBottomNav from '@/components/store/MobileBottomNav';
import StoreShell from '@/components/store/StoreShell';
import { LanguageProvider } from '@/lib/languageContext';
import { ThemeProvider } from '@/lib/themeContext';
import { CustomerProvider } from '@/lib/customerContext';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Betashop – Tổng Kho Đồ Gia Dụng & Nền Tảng Dịch Vụ Số',
  description: 'Chuyên cung cấp nồi chiên không dầu, bếp từ, robot hút bụi, máy lọc không khí chính hãng và nền tảng dịch vụ số đa nhà cung cấp.',
  keywords: 'đồ gia dụng, nồi chiên không dầu, bếp từ, robot hút bụi, máy lọc không khí, betashop, dịch vụ số, tài khoản',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BetaShop',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f53d2d',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var c = localStorage.getItem('betashop_primary_color');
                if (c) {
                  document.documentElement.style.setProperty('--color-primary', c);
                }
              } catch(e) {}
              
              // Loại bỏ hoàn toàn Netlify badge / card khỏi giao diện
              (function removeNetlifyBadge() {
                function purge() {
                  var els = document.querySelectorAll('.nl-wrap, #nl-card, #nl-badge, .nl-card, [id*="nl-"]');
                  for (var i = 0; i < els.length; i++) {
                    els[i].remove();
                  }
                }
                if (typeof window !== 'undefined') {
                  document.addEventListener('DOMContentLoaded', purge);
                  window.addEventListener('load', purge);
                  if (typeof MutationObserver !== 'undefined') {
                    var obs = new MutationObserver(function() { purge(); });
                    obs.observe(document.documentElement, { childList: true, subtree: true });
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f5f5fa] text-gray-900 font-sans">
        <ThemeProvider>
          <LanguageProvider>
            <CustomerProvider>
              <StoreShell>{children}</StoreShell>
            </CustomerProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
