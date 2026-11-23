'use client';

import React, { useState, useEffect } from 'react';
import { useCustomer } from '@/lib/customerContext';
import { CustomerAddress } from '@/lib/customerDb';
import {
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiHome,
  FiBriefcase,
  FiX,
  FiAlertCircle,
} from 'react-icons/fi';

const PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Quảng Ninh',
  'Bắc Ninh',
  'Thái Nguyên',
];

const DISTRICTS_MAP: Record<string, string[]> = {
  'Hà Nội': ['Ba Đình', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàn Kiếm', 'Thanh Xuân', 'Nam Từ Liêm', 'Hà Đông'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Tân Bình', 'Thủ Đức', 'Gò Vấp'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ'],
};

const WARDS_SAMPLE = ['Phường 1', 'Phường 2', 'Phường Bến Nghé', 'Phường Dịch Vọng Hậu', 'Phường Trung Hòa', 'Phường Láng Hạ'];

export default function DiaChiPage() {
  const { user } = useCustomer();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState(PROVINCES[0]);
  const [district, setDistrict] = useState(DISTRICTS_MAP[PROVINCES[0]]?.[0] || 'Cầu Giấy');
  const [ward, setWard] = useState(WARDS_SAMPLE[0]);
  const [detail, setDetail] = useState('');
  const [type, setType] = useState<'HOME' | 'OFFICE'>('HOME');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial addresses
  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`/api/customer/data?userId=${user?.id || 'usr-01'}`);
      const data = await res.json();
      if (data.success && data.data.addresses) {
        setAddresses(data.data.addresses);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !detail) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/customer/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_address',
          userId: user?.id || 'usr-01',
          payload: {
            name,
            phone,
            province,
            district,
            ward,
            detail,
            type,
            isDefault,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        resetForm();
        fetchAddresses();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      const res = await fetch('/api/customer/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_address',
          userId: user?.id || 'usr-01',
          payload: { id },
        }),
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch('/api/customer/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_default_address',
          userId: user?.id || 'usr-01',
          payload: { id },
        }),
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setDetail('');
    setIsDefault(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Sổ địa chỉ nhận hàng</h1>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý các địa chỉ giao hàng để đặt hàng nhanh chóng và thuận tiện hơn
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-sm shadow-md transition self-start sm:self-auto"
          >
            <FiPlus className="text-base" />
            <span>Thêm địa chỉ mới</span>
          </button>
        </div>

        {/* Address List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-gray-400">Đang tải danh sách địa chỉ...</div>
          ) : addresses.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <FiMapPin className="text-4xl mx-auto text-gray-300 mb-3" />
              <p>Bạn chưa lưu địa chỉ nhận hàng nào.</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border transition relative ${
                  addr.isDefault
                    ? 'border-orange-300 bg-orange-50/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-gray-900 text-base">{addr.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 font-medium text-sm">{addr.phone}</span>

                      {addr.type === 'HOME' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          <FiHome className="text-xs" /> Nhà riêng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          <FiBriefcase className="text-xs" /> Văn phòng
                        </span>
                      )}

                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">
                          <FiCheck className="text-xs" /> Mặc định
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-700">
                      {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-semibold text-gray-600 hover:text-orange-600 transition"
                      >
                        Thiết lập mặc định
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(addr.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 transition p-1.5"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
            >
              <FiX className="text-xl" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Thêm địa chỉ nhận hàng</h3>
            <p className="text-xs text-gray-400 mb-6">Địa chỉ chính xác giúp kiện hàng đến tay bạn nhanh nhất</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0988 123 456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>
              </div>

              {/* 3 Administrative Tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Tỉnh / Thành phố
                  </label>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      const dists = DISTRICTS_MAP[e.target.value] || ['Trung tâm'];
                      setDistrict(dists[0]);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Quận / Huyện
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {(DISTRICTS_MAP[province] || ['Quận/Huyện trung tâm']).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phường / Xã
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {WARDS_SAMPLE.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Ví dụ: Tầng 5, Tòa Keangnam, Mễ Trì"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              {/* Type tag */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Loại địa chỉ
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setType('HOME')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      type === 'HOME'
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiHome /> Nhà riêng (Giao mọi lúc)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('OFFICE')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      type === 'OFFICE'
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FiBriefcase /> Văn phòng (Giờ hành chính)
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs text-gray-700 font-medium">Đặt làm địa chỉ nhận hàng mặc định</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-sm shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
