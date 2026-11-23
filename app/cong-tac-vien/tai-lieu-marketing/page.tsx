'use client';

import React, { useState } from 'react';
import {
  FiDownload,
  FiCopy,
  FiCheck,
  FiImage,
  FiFileText,
  FiVideo,
  FiExternalLink,
} from 'react-icons/fi';

const SAMPLE_CAPTIONS = [
  {
    id: 'cap-1',
    channel: 'TikTok / Reels',
    title: 'Kịch bản Review Nồi chiên không dầu Philips',
    text: `Gia đình nào mê đồ nướng healthy mà ngại dầu mỡ thì em nồi chiên không dầu Philips HD9252 này đúng là chân ái! Dung tích 4.1L vừa vặn nguyên con gà 1.5kg, công nghệ Rapid Air giảm đến 90% dầu thừa mà vỏ vẫn giòn rụm bên trong mọng nước. Đang có voucher giảm 50k + Freeship toàn quốc trên BetaShop, link mua chính hãng em để ở bio nhé mn! 🔥👉 [LINK_CỦA_BẠN]`,
  },
  {
    id: 'cap-2',
    channel: 'Facebook Post',
    title: 'Bài đăng nhóm Chung cư / Gia đình',
    text: `Nhà có nuôi thú cưng hoặc sàn hay bụi mịn thì đầu tư em Robot Dreame L10s Ultra Gen 2 này không bao giờ hối hận! Lực hút siêu khủng, tự động giặt và sấy giẻ bằng khí nóng nên không bao giờ bị hôi ẩm. Đặt hàng qua đại lý chính hãng BetaShop được bảo hành 2 năm tận nhà: 👉 [LINK_CỦA_BẠN]`,
  },
];

const ASSETS = [
  {
    id: 'ast-1',
    title: 'Bộ Banner Nồi Chiên Không Dầu Philips HD9252 (1080x1080)',
    type: 'Hình ảnh HD',
    size: '12 MB (6 ảnh)',
    preview: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ast-2',
    title: 'Bộ Video Quay Thực Tế Robot Dreame L10s Ultra',
    type: 'Video 4K',
    size: '145 MB (3 clip unbox)',
    preview: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ast-3',
    title: 'Catalog Bảng Giá & Thông Số Kỹ Thuật Đồ Gia Dụng 2026',
    type: 'Tệp PDF',
    size: '8.5 MB',
    preview: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=300&q=80',
  },
];

export default function TaiLieuMarketingPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-lg">
            <FiFileText />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Kho tài liệu & Truyền thông quảng bá</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Hình ảnh bản quyền, video review chân thực và mẫu kịch bản đăng bài có sẵn để bạn tải về sử dụng miễn phí
            </p>
          </div>
        </div>

        {/* Media Assets List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {ASSETS.map((ast) => (
            <div
              key={ast.id}
              className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-orange-200 transition flex flex-col justify-between"
            >
              <div>
                <img
                  src={ast.preview}
                  alt={ast.title}
                  className="w-full h-40 rounded-xl object-cover mb-3"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f53d2d] bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                  {ast.type}
                </span>
                <h4 className="font-bold text-gray-900 text-sm mt-1.5 leading-snug">{ast.title}</h4>
                <p className="text-xs text-gray-400 mt-1">Dung lượng: {ast.size}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={() => alert(`Đang tải tệp: ${ast.title}`)}
                  className="w-full py-2.5 bg-white hover:bg-orange-50 text-[#f53d2d] border border-orange-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <FiDownload />
                  <span>Tải tệp đính kèm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Copywriting Templates */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h3 className="font-bold text-base text-gray-900 mb-1">Mẫu bài đăng gợi ý (Copywriting Templates)</h3>
        <p className="text-xs text-gray-400 mb-6">
          Sao chép và thay thế phần <code>[LINK_CỦA_BẠN]</code> bằng link tiếp thị của bạn để đăng lên mạng xã hội
        </p>

        <div className="space-y-4">
          {SAMPLE_CAPTIONS.map((cap) => (
            <div
              key={cap.id}
              className="p-5 rounded-2xl border border-gray-100 bg-gray-50/40 hover:border-gray-200 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-[#f53d2d] bg-orange-100 px-2.5 py-0.5 rounded-full">
                    {cap.channel}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">{cap.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(cap.id, cap.text)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f53d2d] hover:text-[#e03122] bg-white px-3 py-1.5 rounded-xl border border-orange-200 transition"
                >
                  {copiedId === cap.id ? (
                    <>
                      <FiCheck className="text-emerald-600" />
                      <span className="text-emerald-600">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <FiCopy />
                      <span>Sao chép mẫu</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed bg-white p-3.5 rounded-xl border border-gray-100 font-mono">
                {cap.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
