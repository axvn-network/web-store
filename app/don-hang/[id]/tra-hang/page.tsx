'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiRotateCcw,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiHelpCircle,
} from 'react-icons/fi';

const RETURN_REASONS = [
  'Sản phẩm bị nứt, vỡ hoặc biến dạng do vận chuyển',
  'Sản phẩm không hoạt động hoặc lỗi kỹ thuật ngay khi mở hộp',
  'Shop giao sai mẫu mã hoặc sai màu sắc so với đơn đặt',
  'Thiếu phụ kiện kèm theo trong hộp sản phẩm',
  'Sản phẩm không đúng với thông số kỹ thuật mô tả trên website',
  'Lý do cá nhân (đổi ý trong 7 ngày theo chính sách VIP)',
];

const VIETNAM_BANKS = [
  'Vietcombank (VCB)',
  'Techcombank (TCB)',
  'MB Bank (Ngân hàng Quân Đội)',
  'VietinBank (CTG)',
  'BIDV',
  'ACB (Á Châu)',
  'TPBank (Tiên Phong)',
  'VPBank',
  'Ví MoMo',
];

export default function YeuCauTraHangPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) || 'ORD-2026-9812';

  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [description, setDescription] = useState('');
  const [bankName, setBankName] = useState(VIETNAM_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('NGUYEN VAN AN');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls = Array.from(files).map((f) => URL.createObjectURL(f));
      setImages([...images, ...newUrls].slice(0, 5));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !accountNumber.trim()) {
      alert('Vui lòng điền đầy đủ mô tả lý do và số tài khoản nhận tiền hoàn');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href={`/don-hang/${orderId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#f53d2d] transition"
        >
          <FiArrowLeft />
          <span>Quay lại chi tiết đơn hàng</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3.5 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-2xl shrink-0">
              <FiRotateCcw />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Yêu cầu Trả hàng & Hoàn tiền
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Áp dụng cho đơn hàng <strong className="text-gray-800">#{orderId}</strong>
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                <FiCheckCircle />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Gửi yêu cầu trả hàng thành công!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Mã yêu cầu hoàn trả: <strong className="text-gray-900">RMA-{Date.now().toString().slice(-6)}</strong>.
                Chuyên viên chăm sóc khách hàng của BetaShop sẽ liên hệ với bạn qua số điện thoại đăng ký trong vòng 4 giờ làm việc để xếp lịch thu hồi hàng tận nơi.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/don-hang"
                  className="px-6 py-2.5 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow transition"
                >
                  Xem danh sách đơn hàng
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Product preview */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=120&q=80"
                  alt="Sản phẩm"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Nồi chiên không dầu Philips Rapid Air HD9252/90 4.1L
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">Số tiền hoàn dự kiến: <strong className="text-[#f53d2d] font-bold">2.490.000 ₫</strong></p>
                </div>
              </div>

              {/* Return reason */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Lý do yêu cầu trả hàng <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] text-sm font-medium text-gray-800"
                >
                  {RETURN_REASONS.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Mô tả chi tiết tình trạng sản phẩm <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vui lòng cung cấp thêm thông tin chi tiết về lỗi sản phẩm, bao gồm tình trạng tem niêm phong và vỏ hộp..."
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f53d2d] text-sm"
                />
              </div>

              {/* Proof images */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Hình ảnh / Video minh chứng (Tối đa 5 tệp)
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <img src={img} alt="Bằng chứng" className="w-full h-full object-cover" />
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#f53d2d] flex flex-col items-center justify-center text-gray-400 hover:text-[#f53d2d] cursor-pointer transition">
                      <FiUpload className="text-xl mb-1" />
                      <span className="text-[10px] font-bold">Thêm ảnh</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Đính kèm video mở hộp (unbox) hoặc ảnh chụp rõ chi tiết lỗi để được duyệt hoàn tiền ngay trong 24h
                </p>
              </div>

              {/* Bank refund info */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Thông tin tài khoản nhận tiền hoàn trả
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Ngân hàng thụ hưởng</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    >
                      {VIETNAM_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Số tài khoản / Số điện thoại</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="0123456789"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tên chủ tài khoản (Viết hoa)</label>
                    <input
                      type="text"
                      required
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                      placeholder="NGUYEN VAN AN"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Policy note */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                <FiAlertCircle className="text-base text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Chính sách đổi trả BetaShop: Miễn phí thu hồi tận nhà trên toàn quốc. Tiền hoàn sẽ được chuyển khoản trực tiếp sau khi kho kiểm tra xác nhận kiện hàng (thường trong vòng 24 - 48 giờ làm việc).
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Link
                  href={`/don-hang/${orderId}`}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition"
                >
                  Hủy bỏ
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-2.5 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow-md shadow-[#f53d2d]/20 transition disabled:opacity-50"
                >
                  {submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu trả hàng'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
