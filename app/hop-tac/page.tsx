'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiBriefcase,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiCheckCircle,
  FiUpload,
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowRight,
} from 'react-icons/fi';

const PARTNER_TYPES = [
  { value: 'DISTRIBUTOR', label: 'Nhà phân phối / Thương hiệu đồ gia dụng chính hãng' },
  { value: 'DEALER', label: 'Đại lý / Cửa hàng bán lẻ liên kết phân phối' },
  { value: 'SUPPLIER', label: 'Nhà máy sản xuất / Nhà cung ứng linh phụ kiện gia dụng' },
  { value: 'LOGISTICS', label: 'Đối tác vận chuyển, giao nhận & kho bãi' },
  { value: 'OTHER', label: 'Hợp tác truyền thông / Khác' },
];

export default function HopTacPage() {
  const [partnerType, setPartnerType] = useState('DISTRIBUTOR');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !phone.trim() || !email.trim()) {
      alert('Vui lòng điền đầy đủ thông tin liên hệ');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/partner/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: partnerType,
          companyName,
          contactName,
          phone,
          email,
          address,
          website,
          description,
          attachmentUrl: fileName ? `/uploads/partners/${fileName}` : undefined,
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 bg-orange-950/60 px-3.5 py-1 rounded-full border border-orange-500/30 inline-block">
              Hợp tác phát triển cùng BetaShop
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Mở rộng kinh doanh cùng Hệ thống bán lẻ Gia Dụng hàng đầu
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Chúng tôi luôn chào đón các nhà sản xuất, thương hiệu uy tín và đối tác đại lý cùng xây dựng hệ sinh thái thiết bị gia dụng chính hãng, mang lại giá trị thiết thực nhất cho hàng triệu gia đình Việt.
            </p>
          </div>
        </div>

        {/* 4 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">
              <FiUsers />
            </div>
            <h3 className="font-bold text-base text-gray-900">50.000+ Khách hàng</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cộng đồng khách hàng gia đình có thu nhập ổn định và nhu cầu mua sắm thiết bị gia dụng thông minh thường xuyên.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
              <FiTrendingUp />
            </div>
            <h3 className="font-bold text-base text-gray-900">Tăng trưởng 180%/năm</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Kênh bán hàng đa nền tảng tối ưu hóa chuyển đổi, kết hợp mạng lưới tiếp thị liên kết (Affiliate) rộng khắp toàn quốc.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
              <FiShield />
            </div>
            <h3 className="font-bold text-base text-gray-900">Hạ tầng bảo hành chuẩn 5 sao</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Đội ngũ kỹ thuật viên tay nghề cao, hỗ trợ lắp đặt và bảo hành tận nơi tại 63 tỉnh thành, giảm tải cho nhà sản xuất.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
              <FiBriefcase />
            </div>
            <h3 className="font-bold text-base text-gray-900">Thanh toán minh bạch</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Chính sách công nợ linh hoạt, đối soát định kỳ chuẩn xác và dòng tiền thanh toán đúng hạn cho đối tác.
            </p>
          </div>
        </div>

        {/* Collaboration Form & Direct Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="pb-6 border-b border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Gửi hồ sơ đăng ký hợp tác
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Vui lòng điền thông tin bên dưới. Bộ phận Phát triển Đối tác sẽ phản hồi trong vòng 24 giờ.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                  <FiCheckCircle />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Cảm ơn quý đối tác đã gửi thông tin!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Chúng tôi đã tiếp nhận hồ sơ đề xuất hợp tác của doanh nghiệp <strong>{companyName}</strong>. Giám đốc phát triển kinh doanh BetaShop sẽ liên hệ trực tiếp với bạn qua số điện thoại <strong>{phone}</strong>.
                </p>
                <div className="pt-4">
                  <Link
                    href="/"
                    className="px-6 py-2.5 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow transition"
                  >
                    Về trang chủ BetaShop
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Hình thức hợp tác mong muốn <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                  >
                    {PARTNER_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Tên công ty / Doanh nghiệp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Công ty TNHH Thiết Bị Gia Dụng..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Họ và tên người đại diện liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Nguyễn Văn A (Trưởng phòng KD)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Số điện thoại liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Địa chỉ Email công việc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="partner@company.vn"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Trụ sở chính / Văn phòng
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Hà Nội / TP. Hồ Chí Minh"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Website hoặc Fanpage chính
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.vn"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nội dung đề xuất hợp tác / Năng lực sản phẩm
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả tóm tắt về dải sản phẩm gia dụng, chính sách chiết khấu phân phối hoặc dịch vụ quý đối tác cung cấp..."
                    className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                  />
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Đính kèm Hồ sơ năng lực (Company Profile / Catalog PDF)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-2">
                      <FiUpload />
                      <span>Chọn tệp đính kèm</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-gray-500 truncate">
                      {fileName || 'Chưa chọn tệp (Tối đa 20MB)'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#f53d2d]/20 transition disabled:opacity-50"
                  >
                    {submitting ? 'Đang gửi thông tin...' : 'Gửi hồ sơ hợp tác'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct Contact Side */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
                Bộ phận Phát triển Kinh doanh
              </h3>

              <div className="space-y-3.5 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <FiPhone className="text-[#f53d2d] text-base shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">Hotline Đối tác (B2B):</span>
                    <a href="tel:0988123456" className="text-[#f53d2d] font-bold hover:underline">
                      0988 123 456 / 1900 6868
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMail className="text-[#f53d2d] text-base shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">Email phòng Hợp tác:</span>
                    <a href="mailto:partner@betashop.vn" className="text-gray-700 hover:underline">
                      partner@betashop.vn
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-[#f53d2d] text-base shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">Trụ sở điều hành:</span>
                    <p className="leading-relaxed">Tầng 12, Tòa nhà Handico, Đường Phạm Hùng, Quận Nam Từ Liêm, TP. Hà Nội</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-orange-50 border border-orange-200 text-xs text-orange-900 space-y-2">
              <h4 className="font-bold text-sm text-orange-800">Cam kết bảo mật thông tin</h4>
              <p className="leading-relaxed">
                BetaShop cam kết bảo mật 100% hồ sơ năng lực và chính sách giá đại lý của quý đối tác theo thỏa thuận NDA tiêu chuẩn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
