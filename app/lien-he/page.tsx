'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BiHomeAlt,
  BiChevronRight,
  BiPhoneCall,
  BiEnvelope,
  BiMap,
  BiTimeFive,
  BiSend,
  BiCheckCircle,
} from 'react-icons/bi';
import { FaFacebookF, FaTelegramPlane, FaTiktok } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Tư vấn mua hàng',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', subject: 'Tư vấn mua hàng', message: '' });
    }, 600);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Liên hệ & Hỗ trợ</span>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 sm:p-10 rounded-2xl shadow-sm space-y-2 text-center">
        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
          Hỗ Trợ 24/7 – Kết Nối Nhanh Chóng
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          Liên Hệ Tổng Kho Đồ Gia Dụng Betashop
        </h1>
        <p className="text-xs sm:text-sm text-orange-100 max-w-xl mx-auto">
          Chúng tôi luôn sẵn sàng lắng nghe và tư vấn giải pháp gia dụng tối ưu nhất cho gia đình và đại lý của bạn.
        </p>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Contact Info & Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 uppercase">
              Thông Tin Tổng Kho
            </h2>

            <div className="space-y-3.5 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 text-lg">
                  <BiPhoneCall />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Hotline Bán Hàng & CSKH:</span>
                  <a href="tel:19008237" className="text-orange-600 font-bold hover:underline">
                    1900 8237
                  </a>{' '}
                  (8h00 - 21h30 hàng ngày)
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-lg">
                  <BiEnvelope />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Hộp Thư Điện Tử (Email):</span>
                  <a href="mailto:cskh@betashop.vn" className="text-gray-700 hover:text-orange-600">
                    cskh@betashop.vn
                  </a>{' '}
                  / kinhdoanh@betashop.vn
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-lg">
                  <BiMap />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Kho Tổng Miền Bắc (Hà Nội):</span>
                  <span>Số 18 đường Phạm Hùng, P. Mỹ Đình 2, Q. Nam Từ Liêm, Hà Nội</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 text-lg">
                  <BiMap />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Kho Tổng Miền Nam (TP.HCM):</span>
                  <span>Số 102 đường Cộng Hòa, P. 4, Q. Tân Bình, TP. Hồ Chí Minh</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-lg">
                  <BiTimeFive />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Thời Gian Làm Việc:</span>
                  <span>Thứ 2 – Chủ Nhật: 08:00 – 21:30 (Mở cửa cả ngày lễ)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Cloud Channels Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 uppercase">
              Kênh Kết Nối & Mạng Xã Hội
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Zalo */}
              <a
                href="https://zalo.me/0988888999"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                  Zalo
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block">Zalo CSKH</span>
                  <span className="text-[10px] text-gray-500">Phản hồi 1 phút</span>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm">
                  <FaFacebookF />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block">Fanpage FB</span>
                  <span className="text-[10px] text-gray-500">50K Followers</span>
                </div>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-pink-50 hover:bg-pink-100/80 text-pink-700 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm">
                  <FaTiktok />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block">TikTok Shop</span>
                  <span className="text-[10px] text-gray-500">Video review sp</span>
                </div>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/betashop_cskh"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl bg-sky-50 hover:bg-sky-100/80 text-sky-700 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center text-sm">
                  <FaTelegramPlane />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block">Telegram Bot</span>
                  <span className="text-[10px] text-gray-500">CSKH & Báo giá 24/7</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form & Map (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase">
                Gửi Tin Nhắn / Yêu Cầu Báo Giá
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Điền thông tin của bạn vào mẫu dưới đây, chuyên viên Betashop sẽ liên hệ lại trong vòng 15 phút.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <BiCheckCircle className="text-4xl text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">
                  Gửi Yêu Cầu Thành Công!
                </h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Cảm ơn bạn đã liên hệ với Betashop. Chúng tôi đã tiếp nhận thông tin và sẽ gọi điện hỗ trợ bạn trong thời gian sớm nhất.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Địa chỉ Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Nhu cầu liên hệ</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-white transition"
                    >
                      <option>Tư vấn mua hàng gia đình</option>
                      <option>Đăng ký đại lý / Báo giá sỉ</option>
                      <option>Bảo hành & Đổi trả thiết bị</option>
                      <option>Hợp tác kinh doanh / Nhà cung cấp</option>
                      <option>Khác</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Nội dung chi tiết *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Mô tả sản phẩm bạn cần tư vấn hoặc câu hỏi cần giải đáp..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition"
                >
                  <BiSend className="text-base" />
                  {loading ? 'Đang gửi...' : 'Gửi yêu cầu ngay'}
                </button>
              </form>
            )}
          </div>

          {/* Embedded Showroom Map */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <BiMap className="text-orange-600 text-base" /> Bản đồ Kho Tổng Hà Nội (Mỹ Đình)
            </span>
            <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <iframe
                title="Bản đồ Betashop"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0968141836176!2d105.77604307584102!3d21.028811887777176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b3260b1a8b%3A0x6b093ad3a8a9e0f3!2zMTggUGjhuqFtIEjDuW5nLCBN4bu5IMSQw6xuaCwgVOG7qyBMacOqbSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
