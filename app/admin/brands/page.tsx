'use client';

import React, { useState } from 'react';
import { Tags, Plus, Search, Globe, Trash2, CheckCircle2 } from 'lucide-react';

interface BrandItem {
  id: string;
  name: string;
  origin: string;
  productCount: number;
  description: string;
}

const INITIAL_BRANDS: BrandItem[] = [
  { id: 'b-01', name: 'Philips', origin: 'Hà Lan', productCount: 18, description: 'Thiết bị gia dụng nhà bếp, bàn ủi và máy xay cao cấp' },
  { id: 'b-02', name: 'Panasonic', origin: 'Nhật Bản', productCount: 14, description: 'Công nghệ Nhật Bản, độ bền cao, tiết kiệm điện' },
  { id: 'b-03', name: 'Cuckoo', origin: 'Hàn Quốc', productCount: 9, description: 'Nồi cơm điện áp suất cao tần hàng đầu Hàn Quốc' },
  { id: 'b-04', name: 'Sunhouse', origin: 'Việt Nam', productCount: 22, description: 'Gia dụng quốc dân Việt Nam, mẫu mã phong phú, giá hợp lý' },
  { id: 'b-05', name: 'Dreame', origin: 'Quốc tế', productCount: 6, description: 'Robot hút bụi thông minh tự giặt sấy giẻ lau tiên tiến' },
  { id: 'b-06', name: 'Xiaomi', origin: 'Trung Quốc', productCount: 12, description: 'Thiết bị gia dụng thông minh kết nối ứng dụng Mi Home' },
  { id: 'b-07', name: 'Elmich', origin: 'Cộng hòa Séc', productCount: 15, description: 'Đồ gia dụng inox 304 chuẩn Châu Âu an toàn sức khỏe' },
  { id: 'b-08', name: 'Tefal', origin: 'Pháp', productCount: 8, description: 'Chảo chống dính, nồi chiên và máy xay sinh tố Pháp' },
];

export default function BrandsAdminPage() {
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('Việt Nam');
  const [desc, setDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setBrands([
      {
        id: `b-${Date.now()}`,
        name: name.trim(),
        origin,
        productCount: 0,
        description: desc.trim(),
      },
      ...brands,
    ]);

    setName('');
    setDesc('');
    setShowAdd(false);
  };

  const filtered = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.origin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Tags className="w-5 h-5 text-emerald-400" />
            <span>Thương Hiệu & Xuất Xứ Đồ Gia Dụng</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {brands.length} nhãn hiệu
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý các thương hiệu chính hãng đối tác (Philips, Cuckoo, Panasonic, Sunhouse, Elmich...).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Thương Hiệu</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên thương hiệu hoặc quốc gia xuất xứ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Brands Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-base text-white">{b.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-400" /> {b.origin}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{b.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">
                <strong className="text-emerald-400">{b.productCount}</strong> sản phẩm
              </span>
              <button
                type="button"
                onClick={() => setBrands(brands.filter((item) => item.id !== b.id))}
                className="text-slate-500 hover:text-red-400 p-1"
                title="Xóa thương hiệu"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Brand */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Thêm Thương Hiệu Mới</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên thương hiệu <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lock&Lock"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quốc gia xuất xứ
                </label>
                <input
                  type="text"
                  placeholder="Hàn Quốc / Nhật Bản / Việt Nam"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mô tả thương hiệu
                </label>
                <textarea
                  rows={2}
                  placeholder="Thế mạnh sản phẩm, công nghệ nổi bật..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Lưu Thương Hiệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
