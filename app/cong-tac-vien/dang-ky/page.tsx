'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiUserPlus,
  FiShare2,
  FiCheckCircle,
  FiAward,
  FiDollarSign,
  FiTrendingUp,
} from 'react-icons/fi';

export default function DangKyCTVPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Nguyễn Văn An');
  const [phone, setPhone] = useState('0988 123 456');
  const [email, setEmail] = useState('an.nguyen@gmail.com');
  const [channel, setChannel] = useState('TikTok');
  const [channelUrl, setChannelUrl] = useState('https://tiktok.com/@reviewgiadungvn');
  const [followers, setFollowers] = useState('50.000+ Followers');
  const [note, setNote] = useState('Chuyên làm video ngắn review trải nghiệm đồ gia dụng thông minh gia đình.');
  const [agree, setAgree] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelUrl.trim()) {
      alert('Vui lòng nhập link kênh mạng xã hội của bạn');
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          payload: {
            channel,
            channelUrl,
            followers,
            note,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-2xl mx-auto mb-4 shadow-inner">
          <FiUserPlus />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Đăng ký trở thành Cộng tác viên (Affiliate)
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
          Kiếm thêm thu nhập thụ động bền vững bằng cách chia sẻ các sản phẩm gia dụng chất lượng cao tới bạn bè, người theo dõi và cộng đồng của bạn.
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
            <FiCheckCircle />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Hồ sơ đăng ký CTV đã được phê duyệt tự động!
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            Mã giới thiệu độc quyền của bạn là: <strong className="text-[#f53d2d] font-mono font-bold text-base">GIADUNGVIP</strong>.
            Bạn đã có thể bắt đầu tạo link giới thiệu và theo dõi hoa hồng ngay bây giờ.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/cong-tac-vien/tong-quan"
              className="px-6 py-3 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow-md transition"
            >
              Vào trang quản trị CTV ngay
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Số điện thoại liên hệ
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Kênh mạng xã hội chính
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
              >
                <option value="TikTok">TikTok Video / Livestream</option>
                <option value="Facebook">Facebook Profile / Fanpage</option>
                <option value="YouTube">YouTube Review / Shorts</option>
                <option value="Zalo">Hội nhóm Zalo / Chợ chung cư</option>
                <option value="Website">Blog / Website đánh giá</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Quy mô người theo dõi / thành viên
              </label>
              <input
                type="text"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="VD: 10.000 người theo dõi hoặc Group 5.000 mem"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Đường dẫn link đến kênh / trang của bạn <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="https://tiktok.com/@kenh-cua-ban hoặc https://facebook.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Kế hoạch hoặc kinh nghiệm quảng bá của bạn
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Chia sẻ cách bạn dự định giới thiệu sản phẩm (làm video đập hộp, gắn link bio, chia sẻ công thức nấu ăn bằng nồi chiên...)"
              className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#f53d2d] focus:ring-[#f53d2d]"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                Tôi cam kết truyền thông thông tin trung thực về sản phẩm, không spam tin nhắn rác và tuân thủ Quy chế hoạt động Cộng tác viên của BetaShop Vietnam.
              </span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !agree}
              className="px-8 py-3 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#f53d2d]/20 transition disabled:opacity-50"
            >
              {submitting ? 'Đang gửi hồ sơ...' : 'Gửi đăng ký CTV ngay'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
