'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  FolderTree,
} from 'lucide-react';
import { STORE_CATEGORIES } from '@/data/storeData';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newParent, setNewParent] = useState('none');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadCategories = () => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setCategories(
            res.data.map((c: any) => ({
              id: c.id,
              title: c.name || c.title,
              slug: c.slug,
              itemCount: c.itemCount || 0,
              parent: c.parent || 'Đồ Gia Dụng',
              partnerSource: c.partnerSource,
            }))
          );
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTitle.trim(),
          title: newTitle.trim(),
          slug: newSlug.trim() || newTitle.toLowerCase().replace(/\s+/g, '-'),
          parent: newParent === 'none' ? 'Danh mục gốc' : newParent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToast('Đã thêm danh mục mới vào Supabase thành công!');
        loadCategories();
      } else {
        setToast(`Lỗi: ${data.error}`);
      }
    } catch (err: any) {
      setToast('Lỗi kết nối khi thêm danh mục');
    }

    setNewTitle('');
    setNewSlug('');
    setShowAddModal(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setToast('Đã xóa danh mục thành công!');
        loadCategories();
      } else {
        setToast(`Lỗi xóa: ${data.error}`);
      }
    } catch (err) {
      setToast('Lỗi khi xóa danh mục');
    }
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = categories.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Danh Mục Hàng Hóa Gia Dụng</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {categories.length} nhóm
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấu trúc phân cấp đa tầng (Parent-Child) cho ngành hàng gia dụng nhà bếp, điện lạnh, máy lọc nước.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên danh mục hàng hóa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-3">Tên Danh Mục</th>
              <th className="p-3">Đường Dẫn Slug</th>
              <th className="p-3">Danh Mục Cha (Parent)</th>
              <th className="p-3 text-center">Số Sản Phẩm</th>
              <th className="p-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-bold text-white flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-emerald-400" />
                  <span>{c.title}</span>
                </td>
                <td className="p-3 font-mono text-slate-400">{c.slug}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {c.parent || 'Đồ Gia Dụng'}
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-emerald-400">
                  {c.itemCount || 10} SP
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                    title="Xóa danh mục"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Category */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Thêm Danh Mục Gia Dụng Mới</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên danh mục <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Máy Rửa Bát & Sấy Bát"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Danh mục cha
                </label>
                <select
                  value={newParent}
                  onChange={(e) => setNewParent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="none">-- Danh mục gốc cao nhất --</option>
                  <option value="Thiết bị nhà bếp">Thiết bị nhà bếp</option>
                  <option value="Điện gia dụng">Điện gia dụng</option>
                  <option value="Thiết bị lọc & Làm sạch">Thiết bị lọc & Làm sạch</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Lưu Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
