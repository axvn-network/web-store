'use client';

import React, { useState } from 'react';
import {
  FiLink,
  FiCopy,
  FiCheck,
  FiDownload,
  FiPlus,
  FiMousePointer,
} from 'react-icons/fi';

export default function LinkGioiThieuPage() {
  const ctvCode = 'GIADUNGVIP';
  const [targetUrl, setTargetUrl] = useState('https://betashop-store.netlify.app/san-pham/noi-chien-khong-dau-philips');
  const [campaignLabel, setCampaignLabel] = useState('Video TikTok Nồi chiên');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState([
    {
      id: 'c-1',
      label: 'Trang chủ BetaShop (Mặc định)',
      url: 'https://betashop-store.netlify.app/?ref=GIADUNGVIP',
      clicks: 840,
      orders: 12,
      created: '01/10/2026',
    },
    {
      id: 'c-2',
      label: 'Chiến dịch Nồi chiên không dầu Philips',
      url: 'https://betashop-store.netlify.app/san-pham/noi-chien-khong-dau-philips?ref=GIADUNGVIP',
      clicks: 295,
      orders: 4,
      created: '15/10/2026',
    },
    {
      id: 'c-3',
      label: 'Chiến dịch Robot hút bụi Dreame L10s',
      url: 'https://betashop-store.netlify.app/san-pham/robot-dreame-l10s?ref=GIADUNGVIP',
      clicks: 105,
      orders: 2,
      created: '01/11/2026',
    },
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    let base = targetUrl.trim();
    if (base.includes('?')) {
      base += `&ref=${ctvCode}`;
    } else {
      base += `?ref=${ctvCode}`;
    }

    setGeneratedLink(base);

    const newCamp = {
      id: `c-${Date.now()}`,
      label: campaignLabel || 'Link tùy chỉnh mới',
      url: base,
      clicks: 0,
      orders: 0,
      created: 'Hôm nay',
    };

    setCampaigns([newCamp, ...campaigns]);
    alert('Đã tạo link giới thiệu chiến dịch thành công!');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    generatedLink || campaigns[0].url
  )}`;

  return (
    <div className="space-y-6">
      {/* Generator Tool */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#f53d2d] flex items-center justify-center text-lg">
            <FiLink />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Công cụ tạo Link tiếp thị liên kết</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Dán bất kỳ link sản phẩm nào từ BetaShop để tạo link gắn mã giới thiệu riêng của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <form onSubmit={handleGenerate} className="lg:col-span-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Tên chiến dịch / Kênh đặt link (để dễ theo dõi hiệu quả)
              </label>
              <input
                type="text"
                value={campaignLabel}
                onChange={(e) => setCampaignLabel(e.target.value)}
                placeholder="VD: Bio TikTok, Bài ghim Fanpage, Video Review YouTube..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Đường dẫn sản phẩm hoặc trang đích trên BetaShop
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://betashop-store.netlify.app/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center gap-2"
            >
              <FiPlus />
              <span>Tạo link tiếp thị ngay</span>
            </button>
          </form>

          {/* QR Code Card */}
          <div className="lg:col-span-4 bg-gray-50 rounded-xl p-5 border border-gray-200 text-center flex flex-col items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-700 block mb-3">
                Mã QR giới thiệu quét nhanh
              </span>
              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 inline-block">
                <img
                  src={currentQrUrl}
                  alt="QR Code"
                  className="w-32 h-32 mx-auto rounded"
                />
              </div>
            </div>
            <a
              href={currentQrUrl}
              download="qr-betashop.png"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#f53d2d] hover:underline"
            >
              <FiDownload />
              <span>Tải ảnh mã QR</span>
            </a>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900">Danh sách Link chiến dịch đã tạo</h3>
            <p className="text-xs text-gray-400 mt-0.5">Theo dõi số lượt click và số đơn hàng phát sinh từ từng liên kết</p>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {campaigns.length} Chiến dịch
          </span>
        </div>

        <div className="divide-y divide-gray-100 mt-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900">{camp.label}</h4>
                  <span className="text-[11px] text-gray-400">• Tạo: {camp.created}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-[#f53d2d] font-mono bg-orange-50 px-2 py-0.5 rounded border border-orange-100 max-w-[280px] sm:max-w-md truncate block">
                    {camp.url}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-6 self-start md:self-auto">
                <div className="text-right text-xs">
                  <span className="text-gray-400 block font-medium">Lượt click</span>
                  <span className="font-bold text-gray-900 text-sm flex items-center gap-1">
                    <FiMousePointer className="text-[#f53d2d]" />
                    {camp.clicks}
                  </span>
                </div>

                <div className="text-right text-xs">
                  <span className="text-gray-400 block font-medium">Đơn hàng</span>
                  <span className="font-bold text-emerald-600 text-sm">{camp.orders} đơn</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(camp.id, camp.url)}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-orange-50 hover:text-[#f53d2d] text-gray-700 font-bold rounded-lg text-xs transition inline-flex items-center gap-1.5"
                >
                  {copiedId === camp.id ? (
                    <>
                      <FiCheck className="text-emerald-600" />
                      <span className="text-emerald-600">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <FiCopy />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
