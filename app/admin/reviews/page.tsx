'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, MessageSquare, Search } from 'lucide-react';
import { ReviewItem } from '@/lib/adminDb';

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const fetchReviews = () => {
    fetch('/api/admin/data?slice=reviews')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setReviews(res.data);
        }
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve_review', payload: { id } }),
    });
    setToast('Đã duyệt hiển thị đánh giá!');
    fetchReviews();
    setTimeout(() => setToast(null), 2500);
  };

  const handleSendReply = async (id: string) => {
    const reply = replyText[id];
    if (!reply?.trim()) return;

    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reply_review', payload: { id, reply } }),
    });
    setToast('Đã gửi phản hồi cho khách hàng!');
    fetchReviews();
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = reviews.filter(
    (r) =>
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.authorName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase())
  );

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
            <Star className="w-5 h-5 text-amber-400" />
            <span>Quản Lý & Duyệt Đánh Giá Khách Hàng</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {reviews.length} đánh giá
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Xem xét nhận xét của khách hàng đã mua, kiểm duyệt nội dung và phản hồi thắc mắc.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, tên khách, nội dung đánh giá..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">{r.productName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-slate-200 text-xs">{r.authorName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-[11px]">{r.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-white">{r.rating}.0</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
              &quot;{r.comment}&quot;
            </p>

            {/* Existing reply if any */}
            {r.reply && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-300">
                <span className="font-bold block mb-0.5">Phản hồi từ Betashop:</span>
                <p>{r.reply}</p>
              </div>
            )}

            {/* Reply Input */}
            {!r.reply && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Nhập câu trả lời cho khách hàng..."
                  value={replyText[r.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [r.id]: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleSendReply(r.id)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Gửi Phản Hồi
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
