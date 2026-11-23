'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BiHomeAlt,
  BiChevronRight,
  BiTimeFive,
  BiUser,
  BiShareAlt,
  BiBookmark,
  BiCheckCircle,
  BiShoppingBag,
} from 'react-icons/bi';
import { FaFacebookF, FaTelegramPlane } from 'react-icons/fa';
import { SiZalo, SiTiktok } from 'react-icons/si';
import { STORE_PROMOTION_NEWS, STORE_PRODUCTS } from '@/data/storeData';
import ProductCard from '@/components/store/ProductCard';

const ARTICLE_CONTENTS: Record<
  string,
  {
    title: string;
    date: string;
    author: string;
    readTime: string;
    image: string;
    category: string;
    summary: string;
    sections: {
      heading: string;
      content: string;
      image?: string;
      tips?: string[];
    }[];
    relatedProductIds: string[];
  }
> = {
  'top-noi-chien-khong-dau': {
    title: 'Top 5 Nồi Chiên Không Dầu Dung Tích Lớn Đáng Mua Nhất Cho Gia Đình',
    date: '16/11/2026',
    author: 'Chuyên Gia Betashop',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1000&q=80',
    category: 'Mẹo Bếp Hay',
    summary:
      'Nồi chiên không dầu đang là trợ thủ đắc lực trong mọi căn bếp Việt. Cùng điểm qua 5 mẫu nồi chiên dung tích từ 6L - 8L bền bỉ, công nghệ nhiệt đối lưu 360 độ giảm tới 90% dầu mỡ.',
    sections: [
      {
        heading: '1. Tiêu chí chọn nồi chiên không dầu cho gia đình 4 - 6 thành viên',
        content:
          'Khi chọn mua nồi chiên cho gia đình đông người, dung tích lòng nồi là yếu tố quan trọng nhất. Dung tích tối thiểu nên từ 5.5L đến 7L để có thể chiên gà nguyên con khoảng 1.5kg - 2kg mà không cần chặt nhỏ. Ngoài ra, công suất máy nên từ 1800W - 2200W giúp thực phẩm chín nhanh, giòn đều bên ngoài và mềm mọng bên trong.',
        tips: [
          'Ưu tiên lòng nồi phủ men chống dính Ceramic hoặc Teflon cao cấp không chứa PFOA an toàn.',
          'Nên chọn dòng có cửa kính quan sát hoặc bảng điều khiển điện tử cảm ứng với các chế độ cài sẵn.',
          'Thương hiệu uy tín như Philips, Lock&Lock, Sunhouse đảm bảo linh kiện thay thế và bảo hành 24 tháng.',
        ],
      },
      {
        heading: '2. Nồi chiên không dầu điện tử Philips HD9280/90 6.2L (Gợi ý số 1)',
        content:
          'Đứng đầu danh sách là mẫu Philips HD9280/90 với công nghệ Rapid Air độc quyền xoáy nhiệt hình sao. Máy tích hợp Wifi kết nối ứng dụng NutriU cho phép theo dõi quá trình nấu ăn từ xa qua điện thoại thông minh.',
        image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80',
      },
      {
        heading: '3. Cách vệ sinh và bảo dưỡng nồi chiên bền trên 5 năm',
        content:
          'Sau khi nấu xong, chờ lòng nồi nguội hẳn khoảng 15-20 phút rồi mới ngâm nước ấm pha chút nước rửa chén dịu nhẹ. Không dùng búi sắt chà cọ làm xước lớp men chống dính. Với thanh mayso nhiệt bên trên, dùng khăn mềm ẩm lau sạch dầu mỡ bám dính mỗi tháng 1 lần.',
        tips: [
          'Đặt nồi cách tường tối thiểu 15cm để luồng khí nóng tản nhiệt thông thoáng.',
          'Không cho giấy bạc hoặc giấy nến chạm vào dây mayso phía trên gây cháy khét.',
        ],
      },
    ],
    relatedProductIds: ['sp-01', 'sp-02'],
  },
  'kinh-nghiem-chon-bep-tu': {
    title: 'Bí Quyết Chọn Mua Bếp Từ Đôi Tiết Kiệm Điện Và Bền Bỉ Chuẩn Chuyên Gia',
    date: '15/11/2026',
    author: 'Kỹ Sư Điện Gia Dụng',
    readTime: '8 phút đọc',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1000&q=80',
    category: 'Tư Vấn Chọn Mua',
    summary:
      'Chuyển đổi từ bếp gas sang bếp từ đôi mang lại an toàn tuyệt đối và không gian bếp mát mẻ. Hướng dẫn chi tiết cách xem mặt kính Schott Ceran / EuroKera, mâm từ E.G.O và công nghệ biến tần Inverter.',
    sections: [
      {
        heading: '1. Tại sao nhất định phải chọn bếp từ có công nghệ Inverter?',
        content:
          'Công nghệ biến tần Inverter thông minh giúp bếp duy trì mức nhiệt đều đặn ở các mức công suất thấp (mức 1 - 3) mà không bị bật/tắt gián đoạn (chống sôi liu riu). Điều này giúp tiết kiệm 25% - 35% điện năng tiêu thụ hàng tháng và nấu các món ninh, hầm, kho ngon hơn rất nhiều.',
        tips: [
          'Kiểm tra tính năng Booster nấu siêu tốc tăng công suất lên 2400W - 3000W khi cần đun sôi nhanh.',
          'Mâm từ đồng nguyên chất 100% giúp tản nhiệt nhanh và tuổi thọ linh kiện cao gấp 3 lần mâm nhôm.',
        ],
      },
      {
        heading: '2. Phân biệt mặt kính bếp từ cao cấp',
        content:
          'Mặt kính chiếm tới 40% giá trị của chiếc bếp từ. Các loại kính chịu lực, chịu nhiệt hàng đầu hiện nay gồm Schott Ceran (Đức), EuroKera K+ (Pháp) và Kanger Ceramic vát cạnh sang trọng với khả năng sốc nhiệt lên đến 800°C.',
        image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=80',
      },
      {
        heading: '3. Lưu ý an toàn điện khi lắp đặt bếp từ đôi tại nhà',
        content:
          'Bếp từ đôi có tổng công suất thường từ 4000W - 4800W. Bắt buộc phải đi dây điện nguồn tối thiểu 2x4.0mm² và sử dụng Aptomat riêng biệt (từ 20A đến 30A), có dây tiếp địa (dây mát) để đảm bảo an toàn chống rò rỉ điện.',
      },
    ],
    relatedProductIds: ['sp-03', 'sp-01'],
  },
  've-sinh-may-hut-bui': {
    title: 'Hướng Dẫn Vệ Sinh Robot Hút Bụi & Máy Lọc Không Khí Đúng Cách',
    date: '14/11/2026',
    author: 'Bộ Phận Kỹ Thuật Betashop',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1000&q=80',
    category: 'Bảo Dưỡng Thiết Bị',
    summary:
      'Vệ sinh định kỳ màng lọc HEPA, chổi cuộn và khay rác giúp máy hút bụi tăng 50% lực hút, đồng thời giữ cho màng lọc không bị mùi hôi và ẩm mốc trong mùa nồm ẩm.',
    sections: [
      {
        heading: '1. Thời gian bảo dưỡng định kỳ các bộ phận',
        content:
          'Đối với robot hút bụi tự động, bạn nên đổ hộp rác sau 1-2 ngày hoạt động (với máy không có trạm sạc tự đổ) hoặc kiểm tra túi rác 1 tháng/lần (với trạm sạc tự động). Chổi cạnh và chổi chính cao su nên được gỡ tóc rối hàng tuần.',
        tips: [
          'Màng lọc HEPA không được giặt bằng nước trừ khi nhà sản xuất cho phép (chỉ dùng chổi quét bụi khô hoặc máy thổi khí).',
          'Vệ sinh cảm biến chống rơi và mắt laser LiDAR bằng khăn mềm để robot không bị đâm va loạn đường.',
        ],
      },
      {
        heading: '2. Thay thế phụ kiện tiêu hao đúng hạn',
        content:
          'Màng lọc HEPA nên thay mới sau 6 - 8 tháng sử dụng để duy trì khả năng lọc sạch 99.97% bụi mịn PM2.5. Chổi quét ven và giẻ lau xoay nên thay mới sau 1 năm để đảm bảo khả năng cọ rửa sàn nhà sạch sẽ.',
        image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=900&q=80',
      },
    ],
    relatedProductIds: ['sp-04', 'sp-06'],
  },
};

export default function NewsDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const article =
    ARTICLE_CONTENTS[slug] ||
    STORE_PROMOTION_NEWS.find((n) => n.slug.includes(slug))
      ? {
          title:
            STORE_PROMOTION_NEWS.find((n) => n.slug.includes(slug))?.title ||
            'Bài Viết Kiến Thức Gia Dụng Tiện Ích',
          date:
            STORE_PROMOTION_NEWS.find((n) => n.slug.includes(slug))?.date ||
            '16/11/2026',
          author: 'Ban Biên Tập Betashop',
          readTime: '5 phút đọc',
          image:
            STORE_PROMOTION_NEWS.find((n) => n.slug.includes(slug))?.image ||
            'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
          category: 'Tin Tức & Mẹo Hay',
          summary:
            'Cẩm nang hữu ích hướng dẫn chọn mua, vận hành và chăm sóc thiết bị gia dụng nhà bếp và nhà ở thông minh từ tổng kho Betashop.',
          sections: [
            {
              heading: '1. Tối ưu hóa trải nghiệm sử dụng đồ gia dụng thông minh',
              content:
                'Các dòng thiết bị gia dụng hiện đại như nồi chiên, nồi cơm cao tần, robot hút bụi và máy lọc không khí đều được trang bị nhiều tính năng tự động hóa vượt trội. Nắm rõ hướng dẫn sử dụng và mẹo bảo quản sẽ giúp bạn kéo dài tuổi thọ thiết bị gấp đôi.',
            },
            {
              heading: '2. Cam kết chính hãng và dịch vụ hậu mãi từ Betashop',
              content:
                'Tại Tổng Kho Betashop, 100% sản phẩm đồ gia dụng đều được nhập khẩu nguyên chiếc hoặc phân phối chính hãng có đầy đủ VAT, bảo hành 12 - 36 tháng tại nhà và hỗ trợ đổi trả 1:1 trong 30 ngày đầu nếu phát sinh lỗi kỹ thuật.',
            },
          ],
          relatedProductIds: ['sp-01', 'sp-02'],
        }
      : ARTICLE_CONTENTS['top-noi-chien-khong-dau'];

  const otherNews = STORE_PROMOTION_NEWS.filter((n) => !n.slug.includes(slug)).slice(0, 3);
  const relatedProducts = STORE_PRODUCTS.filter((p) =>
    article.relatedProductIds?.includes(String(p.id))
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 flex-wrap">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <Link href="/tin-tuc" className="hover:text-orange-600">
          Tin tức & Khuyến mãi
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-semibold line-clamp-1 max-w-[280px] sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Article Content (8 cols) */}
        <article className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-3 border-b border-gray-100 pb-5">
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <BiUser className="text-sm" /> {article.author}
              </span>
              <span className="flex items-center gap-1">
                <BiTimeFive className="text-sm" /> {article.date}
              </span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Lead Summary */}
          <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed bg-orange-50/50 p-4 rounded-xl border-l-4 border-orange-500">
            {article.summary}
          </p>

          {/* Hero Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-sm aspect-video w-full bg-gray-100">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sections */}
          <div className="space-y-8 text-sm sm:text-base text-gray-800 leading-relaxed">
            {article.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {sec.heading}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {sec.content}
                </p>

                {sec.image && (
                  <div className="my-4 rounded-xl overflow-hidden aspect-video bg-gray-50">
                    <img
                      src={sec.image}
                      alt={sec.heading}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {sec.tips && sec.tips.length > 0 && (
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 space-y-2 text-xs sm:text-sm text-emerald-900">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                      <BiCheckCircle className="text-base" /> Lời khuyên từ kỹ thuật viên:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800">
                      {sec.tips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social Share & Footer */}
          <div className="border-t border-gray-100 pt-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <BiShareAlt className="text-base" /> Chia sẻ bài viết:
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs hover:opacity-90 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs hover:opacity-90 transition font-bold"
              >
                Zalo
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs hover:opacity-90 transition"
              >
                <FaTelegramPlane />
              </a>
            </div>
          </div>
        </article>

        {/* Right Column: Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <BiShoppingBag className="text-orange-600 text-lg" />
                <h3 className="font-bold text-sm text-gray-900 uppercase">
                  Sản phẩm nhắc trong bài
                </h3>
              </div>
              <div className="space-y-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Other News */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 uppercase">
              Tin liên quan khác
            </h3>
            <div className="space-y-3">
              {otherNews.map((item) => (
                <Link
                  key={item.id}
                  href={item.slug}
                  className="flex gap-3 items-center group hover:bg-gray-50 p-2 rounded-xl transition"
                >
                  <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <BiTimeFive /> {item.date}
                    </span>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
