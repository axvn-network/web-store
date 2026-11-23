'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Copy,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  CloudUpload,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { Product } from '@/data/storeData';
import { exportToExcel } from '@/lib/excelExport';

function getProviderInfo(source?: string) {
  const s = (source || 'local').toLowerCase();
  if (s.includes('hupsms')) {
    return { name: 'HupSMS Gateway', badge: 'bg-purple-950/80 text-purple-300 border-purple-700/80', desc: 'Proxy 4G/Dân cư' };
  }
  if (s.includes('vuavia')) {
    return { name: 'VuaVia Platform', badge: 'bg-blue-950/80 text-blue-300 border-blue-700/80', desc: 'Via, BM & Ads' };
  }
  if (s.includes('thapcammmo')) {
    return { name: 'Thập Cẩm MMO', badge: 'bg-amber-950/80 text-amber-300 border-amber-700/80', desc: 'Buff & Seeding' };
  }
  if (s.includes('taikhoan')) {
    return { name: 'TaiKhoan.site', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80', desc: 'Cloud VPS & Server' };
  }
  if (s.includes('thanhplus')) {
    return { name: 'ThanhPlus.vn', badge: 'bg-rose-950/80 text-rose-300 border-rose-700/80', desc: 'Bản quyền & Dịch vụ' };
  }
  return { name: 'Kho Nội Bộ', badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80', desc: 'Sản phẩm nội bộ' };
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/admin/data?slice=products')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDuplicate = async (p: Product) => {
    const dupPayload = {
      ...p,
      title: `${p.title} (Bản sao)`,
      slug: `${p.slug}-copy-${Date.now().toString(36)}`,
    };
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_product', payload: dupPayload }),
    });
    const result = await res.json();
    if (result.success) {
      showToast('Đã nhân bản sản phẩm thành công!');
      fetchProducts();
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) return;
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_product', payload: { id } }),
    });
    const result = await res.json();
    if (result.success) {
      showToast('Đã xóa sản phẩm thành công!');
      fetchProducts();
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) return;
    for (const id of selectedIds) {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_product', payload: { id } }),
      });
    }
    setSelectedIds([]);
    showToast(`Đã xóa ${selectedIds.length} sản phẩm!`);
    fetchProducts();
  };

  const handleExportExcel = () => {
    const exportData = filteredProducts.map((p) => ({
      'Mã SP': p.id,
      'Tên Sản Phẩm': p.title,
      'Danh Mục': p.category,
      'Thương Hiệu': p.brand,
      'Giá Bán Lẻ': p.price,
      'Giá Gốc': p.originalPrice || p.price,
      'Tồn Kho': p.stock || 20,
      'Đã Bán': p.sold || 0,
      'Đánh Giá': p.rating,
      'Bảo Hành': p.warranty || '12 tháng',
    }));
    exportToExcel(exportData, `Danh_Sach_San_Pham_Betashop_${Date.now()}`);
  };

  const handleExportGoogleDrive = () => {
    handleExportExcel();
    window.open('https://drive.google.com/drive/u/0/my-drive', '_blank');
  };

  // Filter logic
  const filteredProducts = products.filter((p) => {
    const pSource = ((p as any).partnerSource || 'local').toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      pSource.includes(search.toLowerCase());

    const matchProvider =
      selectedProvider === 'all' ||
      pSource.includes(selectedProvider.toLowerCase());

    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
    const matchStock =
      selectedStock === 'all' ||
      (selectedStock === 'low' && (p.stock || 20) <= 5) ||
      (selectedStock === 'in' && (p.stock || 20) > 5) ||
      (selectedStock === 'out' && (p.stock || 20) === 0);

    return matchSearch && matchProvider && matchCat && matchBrand && matchStock;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div className="space-y-5">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl font-semibold text-xs flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>Quản Lý Sản Phẩm & Nhà Cung Cấp</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filteredProducts.length} sản phẩm
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý tập trung sản phẩm số, Cloud VPS, Proxy, Via/BM, MMO và thiết bị từ 6 nhà cung cấp.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportGoogleDrive}
            title="Xuất dữ liệu và đồng bộ lên Google Drive của Admin"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-semibold transition"
          >
            <CloudUpload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xuất Google Drive</span>
          </button>

          <Link
            href="/admin/products/variants"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Ma Trận Biến Thể</span>
          </Link>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, danh mục, NCC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Provider Filter */}
          <div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="all">Tất cả nhà cung cấp</option>
              <option value="hupsms">HupSMS (Proxy 4G/Dân cư)</option>
              <option value="vuavia">VuaVia (Via, Clone & Ads)</option>
              <option value="thapcammmo">Thập Cẩm MMO (Buff MXH)</option>
              <option value="taikhoan">TaiKhoan.site (Cloud VPS)</option>
              <option value="thanhplus">ThanhPlus (Key bản quyền)</option>
              <option value="local">Kho Nội Bộ BetaShop</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tất cả thương hiệu</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Trạng thái tồn kho (Tất cả)</option>
              <option value="in">Còn hàng (&gt; 5 chiếc)</option>
              <option value="low">Sắp hết hàng (≤ 5 chiếc)</option>
              <option value="out">Hết hàng (0 chiếc)</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Header if selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-300 font-semibold">
              Đã chọn <strong className="text-emerald-400">{selectedIds.length}</strong> sản phẩm
            </span>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa đã chọn</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700 select-none">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredProducts.length && filteredProducts.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredProducts.map((p) => String(p.id)));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950 cursor-pointer"
                  />
                </th>
                <th className="p-3">Sản Phẩm</th>
                <th className="p-3">Nhà Cung Cấp</th>
                <th className="p-3">Danh Mục</th>
                <th className="p-3">Thương Hiệu</th>
                <th className="p-3 text-right">Giá Bán Lẻ</th>
                <th className="p-3 text-center">Tồn Kho</th>
                <th className="p-3 text-center">Đã Bán</th>
                <th className="p-3">Bảo Hành</th>
                <th className="p-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    Không tìm thấy sản phẩm nào phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isChecked = selectedIds.includes(String(p.id));
                  const stock = p.stock || 20;
                  const providerInfo = getProviderInfo((p as any).partnerSource);

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-800/40 transition ${
                        isChecked ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, String(p.id)]);
                            } else {
                              setSelectedIds(selectedIds.filter((id) => id !== String(p.id)));
                            }
                          }}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950 cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 object-cover rounded-md border border-slate-800 flex-shrink-0 bg-slate-950"
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <Link
                              href={`/admin/products/${p.id}`}
                              className="font-bold text-slate-200 hover:text-emerald-400 transition truncate block"
                            >
                              {p.title}
                            </Link>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: BS-{String(p.id).toUpperCase()}-STD
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex flex-col px-2 py-0.5 rounded text-[10px] font-bold border ${providerInfo.badge}`}>
                          <span>{providerInfo.name}</span>
                          <span className="text-[9px] opacity-75 font-normal">{providerInfo.desc}</span>
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 font-medium">{p.category}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[11px]">
                          {p.brand}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-extrabold text-emerald-400">
                          {formatVND(p.price)}
                        </div>
                        {p.originalPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatVND(p.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            stock <= 5
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {stock} chiếc {stock <= 5 ? '⚠️' : ''}
                        </span>
                      </td>
                      <td className="p-3 text-center text-slate-300 font-bold">{p.sold || 0}</td>
                      <td className="p-3 text-slate-400">{p.warranty || '12 tháng'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Sửa sản phẩm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Nhân bản sản phẩm"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
