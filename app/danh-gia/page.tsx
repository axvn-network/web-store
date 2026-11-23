'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiStar,
  FiChevronRight,
  FiCamera,
  FiCheckCircle,
  FiMessageSquare,
  FiAward,
} from 'react-icons/fi';

interface ReviewProduct {
  id: string;
  orderId: string;
  orderDate: string;
  title: string;
  image: string;
  variant: string;
}

interface SubmittedReview {
  id: string;
  title: string;
  image: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export default function DanhGiaPage() {
  const [tab, setTab] = useState<'PENDING' | 'SUBMITTED'>('PENDING');

  // Pending products for review
  const [pendingList, setPendingList] = useState<ReviewProduct[]>([
    {
      id: 'p-1',
      orderId: 'ORD-2026-9812',
      orderDate: '14/11/2026',
      title: 'Nồi chiên không dầu Philips Rapid Air HD9252/90 4.1L',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=150&q=80',
      variant: 'Màu Đen bóng',
    },
  ]);

  // Submitted reviews
  const [submittedList, setSubmittedList] = useState<SubmittedReview[]>([
    {
      id: 'rev-01',
      title: 'Robot hút bụi lau nhà Dreame L10s Ultra Gen 2',
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Máy chạy êm ái, lực hút mạnh quét sạch lông mèo và bụi mịn. Dock tự giặt sấy giẻ rất tiện lợi, nhà luôn thơm tho sạch bóng!',
      date: '03/11/2026',
      reply: 'BetaShop cảm ơn anh An đã tin tưởng mua sắm! Chúc gia đình anh có trải nghiệm tuyệt vời cùng Dreame ạ ❤️',
    },
    {
      id: 'rev-02',
      title: 'Máy sấy tóc ion âm Panasonic EH-NA45',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Sấy tóc rất nhanh khô mà không bị khô xơ gãy rụng. Thiết kế đầm tay và màu đỏ ruby rất sang trọng.',
      date: '20/10/2026',
    },
  ]);

  // Review Form Modal
  const [reviewingItem, setReviewingItem] = useState<ReviewProduct | null>(null);
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !reviewingItem) return;

    setSubmitting(true);

    try {
      await fetch('/api/customer/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_review',
          payload: {
            productId: reviewingItem.id,
            productTitle: reviewingItem.title,
            productImage: reviewingItem.image,
            rating: star,
            comment,
          },
        }),
      });

      // Move from pending to submitted
      setSubmittedList([
        {
          id: `rev-${Date.now()}`,
          title: reviewingItem.title,
          image: reviewingItem.image,
          rating: star,
          comment,
          date: 'Vừa xong',
        },
        ...submittedList,
      ]);
      setPendingList(pendingList.filter((p) => p.id !== reviewingItem.id));
      setReviewingItem(null);
      setComment('');
      setStar(5);
      alert('Đã gửi đánh giá thành công! Bạn nhận được +50 điểm thưởng thành viên.');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-orange-600 transition">
            Trang chủ
          </Link>
          <FiChevronRight />
          <Link href="/tai-khoan" className="hover:text-orange-600 transition">
            Tài khoản
          </Link>
          <FiChevronRight />
          <span className="text-gray-800 font-medium">Đánh giá sản phẩm</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shrink-0">
                <FiStar />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Đánh giá sản phẩm
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  Chia sẻ nhận xét chân thực để giúp cộng đồng mua sắm và nhận ngay 50 điểm thưởng mỗi đánh giá
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold self-start sm:self-auto">
              <FiAward className="text-base text-orange-600" />
              <span>Tặng +50đ / đánh giá kèm ảnh</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setTab('PENDING')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                tab === 'PENDING'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Chưa đánh giá</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
                {pendingList.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTab('SUBMITTED')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                tab === 'SUBMITTED'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Đã đánh giá</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
                {submittedList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1: PENDING */}
        {tab === 'PENDING' && (
          <div className="space-y-4">
            {pendingList.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                <FiCheckCircle className="text-5xl mx-auto text-emerald-400 mb-3" />
                <h3 className="text-base font-bold text-gray-800">Bạn đã đánh giá tất cả sản phẩm!</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Cảm ơn sự đóng góp quý báu của bạn cho cộng đồng BetaShop
                </p>
              </div>
            ) : (
              pendingList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shrink-0"
                    />
                    <div>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Đơn #{item.orderId} • Mua ngày {item.orderDate}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mt-0.5">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReviewingItem(item)}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition self-start sm:self-auto shrink-0"
                  >
                    Viết đánh giá
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: SUBMITTED */}
        {tab === 'SUBMITTED' && (
          <div className="space-y-4">
            {submittedList.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.image}
                      alt={rev.title}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{rev.title}</h4>
                      <div className="flex items-center gap-1 mt-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            className={`text-sm ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{rev.date}</span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  {rev.comment}
                </p>

                {rev.reply && (
                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-orange-700">
                      <FiMessageSquare />
                      <span>Phản hồi từ BetaShop</span>
                    </div>
                    <p className="text-orange-950/80 leading-relaxed">{rev.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {reviewingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Đánh giá sản phẩm</h3>
              <p className="text-xs text-gray-400 mb-4">{reviewingItem.title}</p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star rating */}
                <div className="flex items-center justify-center gap-2 py-3 bg-amber-50 rounded-2xl border border-amber-100">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStar(s)}
                      className="p-1 focus:outline-none transition transform hover:scale-110"
                    >
                      <FiStar
                        className={`text-2xl ${
                          s <= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-800 ml-2">
                    {star === 5 ? 'Tuyệt vời' : star === 4 ? 'Hài lòng' : star === 3 ? 'Bình thường' : 'Chưa tốt'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nhận xét chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chất lượng sản phẩm thế nào? Đóng gói, giao hàng có cẩn thận không?..."
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewingItem(null)}
                    className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                  >
                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
