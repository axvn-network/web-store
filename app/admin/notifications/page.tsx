'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, AlertTriangle, Clock, Building2, Check } from 'lucide-react';
import { AdminNotification } from '@/lib/adminDb';

export default function NotificationsAdminPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const fetchNotifs = () => {
    fetch('/api/admin/data?slice=notifications')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setNotifications(res.data);
        }
      });
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_notification_read', payload: { id: 'ALL' } }),
    });
    setToast('Đã đánh dấu đọc tất cả thông báo!');
    fetchNotifs();
    setTimeout(() => setToast(null), 2500);
  };

  const handleMarkRead = async (id: string) => {
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_notification_read', payload: { id } }),
    });
    fetchNotifs();
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <span>Trung Tâm Thông Báo & Cảnh Báo Hệ Thống</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {notifications.filter((n) => !n.isRead).length} chưa đọc
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cảnh báo đơn hàng mới từ web, thông báo sắp hết hàng và nhắc nợ nhà cung cấp đến hạn.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition"
        >
          <Check className="w-4 h-4" />
          <span>Đánh Dấu Đã Đọc Tất Cả</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-slate-900 border rounded-xl p-4 flex items-start justify-between gap-4 transition hover:border-slate-700 ${
              !n.isRead
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                  n.type === 'LOW_STOCK'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : n.type === 'DEBT_DUE'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {n.type === 'LOW_STOCK' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : n.type === 'DEBT_DUE' ? (
                  <Building2 className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>

              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">{n.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-500 mt-1.5 block">{n.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {n.link && (
                <Link
                  href={n.link}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  Xem ngay
                </Link>
              )}
              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n.id)}
                  className="p-1 text-slate-400 hover:text-emerald-400"
                  title="Đánh dấu đã đọc"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
