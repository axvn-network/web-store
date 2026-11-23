'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import MobileBottomNav from '@/components/store/MobileBottomNav';
import FloatingContactWidget from '@/components/store/FloatingContactWidget';

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="w-full min-h-screen bg-slate-900 text-slate-100">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <FloatingContactWidget />
    </>
  );
}
