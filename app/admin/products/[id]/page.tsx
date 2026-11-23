'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Package,
  Layers,
  DollarSign,
  Boxes,
  ShieldCheck,
  Globe,
  Upload,
  CheckCircle2,
  Trash2,
  Plus,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { STORE_PRODUCTS, STORE_CATEGORIES, Product } from '@/data/storeData';

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = (params?.id as string) || 'new';
  const isNew = !params?.id || productId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    sku: '',
    barcode: '',
    category: 'Nồi Chiên Không Dầu',
    brand: 'Philips',
    unit: 'Chiếc',
    price: 2890000,
    costPrice: 2080000,
    originalPrice: 3500000,
    wholesalePrice: 2600000,
    vat: 10,
    stock: 25,
    minStock: 5,
    maxStock: 100,
    allowNegative: false,
    capacity: '6.2 Lít',
    power: '2000W',
    voltage: '220V / 50Hz',
    controlType: 'Điện tử cảm ứng',
    warranty: '24 tháng chính hãng tại nhà',
    warrantyMonths: 24,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
    description: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (!isNew) {
      fetch('/api/admin/data?slice=products')
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            const found = res.data.find((p: Product) => String(p.id) === String(productId));
            if (found) {
              setForm({
                title: found.title,
                slug: found.slug,
                sku: `BS-${String(found.id).toUpperCase()}-STD`,
                barcode: `893850${Math.floor(100000 + Math.random() * 900000)}`,
                category: found.category,
                brand: found.brand,
                unit: 'Chiếc',
                price: found.price,
                costPrice: Math.round(found.price * 0.72),
                originalPrice: found.originalPrice || found.price,
                wholesalePrice: Math.round(found.price * 0.9),
                vat: 10,
                stock: found.stock || 25,
                minStock: 5,
                maxStock: 100,
                allowNegative: false,
                capacity: '1.8L - 6.2L',
                power: '1500W - 2200W',
                voltage: '220V',
                controlType: 'Điện tử',
                warranty: found.warranty || '12 tháng chính hãng',
                warrantyMonths: 12,
                image: found.image,
                description: found.description || '',
                status: 'ACTIVE',
              });
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [productId, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const action = isNew ? 'create_product' : 'update_product';
    const payload = isNew ? { ...form } : { id: productId, ...form };

    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const result = await res.json();
      if (result.success) {
        setFeedback('Lưu thông tin sản phẩm thành công!');
        setTimeout(() => {
          router.push('/admin/products');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Đang tải thông tin sản phẩm...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {isNew ? 'Thêm Sản Phẩm Đồ Gia Dụng Mới' : `Chỉnh Sửa: ${form.title || 'Sản phẩm'}`}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cập nhật thông số kỹ thuật, giá vốn, giá bán lẻ, kho hàng và bảo hành.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu...' : 'Lưu Sản Phẩm'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 2/3 wide */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Thông tin cơ bản */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>1. Thông Tin Cơ Bản</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên sản phẩm gia dụng <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ví dụ: Nồi cơm điện cao tần Cuckoo CRP-LHTR1010FW 1.8L"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mã SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="BS-SP01-STD"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mã Vạch Barcode (EAN-13)
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={form.barcode}
                    onChange={handleChange}
                    placeholder="893850123456"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Đơn Vị Tính
                  </label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Chiếc">Chiếc</option>
                    <option value="Bộ">Bộ</option>
                    <option value="Cái">Cái</option>
                    <option value="Thùng">Thùng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mô Tả Sản Phẩm & Tính Năng Nổi Bật
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả công nghệ nấu cao tần, vật liệu lòng nồi chống dính, các chế độ nấu tự động..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Card 2: Giá & Thuế */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>2. Thiết Lập Mức Giá & Thuế VAT</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giá Nhập Kho (Giá vốn)
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={form.costPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giá Bán Lẻ <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giá Niêm Yết (Gốc)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={form.originalPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thuế VAT (%)
                </label>
                <input
                  type="number"
                  name="vat"
                  value={form.vat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Thông số kỹ thuật chuyên đồ gia dụng */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3. Thông Số Kỹ Thuật Đồ Gia Dụng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dung Tích / Kích Thước
                </label>
                <input
                  type="text"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="6.2 Lít / 1.8 Lít"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Công Suất (W)
                </label>
                <input
                  type="text"
                  name="power"
                  value={form.power}
                  onChange={handleChange}
                  placeholder="2000W / 2200W"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Điện Áp Hoạt Động
                </label>
                <input
                  type="text"
                  name="voltage"
                  value={form.voltage}
                  onChange={handleChange}
                  placeholder="220V - 50Hz"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bảng Điều Khiển
                </label>
                <input
                  type="text"
                  name="controlType"
                  value={form.controlType}
                  onChange={handleChange}
                  placeholder="Cảm ứng điện tử"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 1/3 wide */}
        <div className="space-y-6">
          {/* Phân loại & Thương hiệu */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Phân Loại & Tổ Chức
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Danh Mục Sản Phẩm
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Nồi Chiên Không Dầu">Nồi Chiên Không Dầu</option>
                  <option value="Nồi Cơm Điện">Nồi Cơm Điện</option>
                  <option value="Bếp Điện & Bếp Từ">Bếp Điện & Bếp Từ</option>
                  <option value="Robot Hút Bụi">Robot Hút Bụi</option>
                  <option value="Máy Lọc Không Khí">Máy Lọc Không Khí</option>
                  <option value="Bình Đun Siêu Tốc">Bình Đun Siêu Tốc</option>
                  <option value="Máy Ép Chậm & Xay">Máy Ép Chậm & Xay</option>
                  <option value="Quạt & Làm Mát">Quạt & Làm Mát</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thương Hiệu
                </label>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Philips">Philips (Hà Lan)</option>
                  <option value="Panasonic">Panasonic (Nhật Bản)</option>
                  <option value="Cuckoo">Cuckoo (Hàn Quốc)</option>
                  <option value="Sunhouse">Sunhouse (Việt Nam)</option>
                  <option value="Dreame">Dreame (Quốc Tế)</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Elmich">Elmich (Châu Âu)</option>
                  <option value="Tefal">Tefal (Pháp)</option>
                  <option value="Sharp">Sharp (Nhật Bản)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chế Độ Bảo Hành
                </label>
                <input
                  type="text"
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  placeholder="24 tháng chính hãng tại nhà"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Ảnh Đại Diện */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Ảnh Sản Phẩm (URL)
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Đường dẫn ảnh Thumbnail
                </label>
                <input
                  type="url"
                  name="image"
                  required
                  value={form.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {form.image && (
                <div className="w-full aspect-square bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Định mức tồn kho */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Định Mức Tồn Kho Cảnh Báo
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tồn Ban Đầu
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cảnh Báo Tối Thiểu
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={form.minStock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="allowNegative"
                  name="allowNegative"
                  checked={form.allowNegative}
                  onChange={handleChange}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950"
                />
                <label htmlFor="allowNegative" className="text-xs text-slate-300 select-none cursor-pointer">
                  Cho phép bán khi hết tồn kho (bán âm)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
