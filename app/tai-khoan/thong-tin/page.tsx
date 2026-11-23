'use client';

import React, { useState } from 'react';
import { useCustomer } from '@/lib/customerContext';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCamera,
  FiCheck,
  FiShield,
  FiLink,
  FiCheckCircle,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaTelegramPlane } from 'react-icons/fa';

export default function ThongTinCaNhanPage() {
  const { user, updateUser } = useCustomer();

  const [name, setName] = useState(user?.name || 'Nguyễn Văn An');
  const [email, setEmail] = useState(user?.email || 'an.nguyen@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '0988123456');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [birthday, setBirthday] = useState('1995-08-15');
  const [avatar, setAvatar] = useState(
    user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/customer/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          userId: user?.id || 'usr-01',
          payload: {
            name,
            email,
            phone,
            image: avatar,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        updateUser({ name, email, phone, image: avatar });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-gray-500 text-sm mt-1">
          Quản lý thông tin hồ sơ của bạn để bảo mật tài khoản và nhận ưu đãi riêng
        </p>

        {success && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-800 flex items-center gap-2">
            <FiCheckCircle className="text-lg shrink-0 text-emerald-600" />
            <span className="font-semibold">Cập nhật thông tin hồ sơ thành công!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
            <div className="relative group">
              <img
                src={avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-100 shadow-md"
              />
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center cursor-pointer shadow transition">
                <FiCamera className="text-sm" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-gray-800 text-base">{name || 'Khách hàng'}</h3>
              <p className="text-xs text-gray-400 mt-1">
                Dung lượng file tối đa 2 MB. Định dạng: .JPEG, .PNG, .WEBP
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Giới tính
              </label>
              <div className="flex items-center gap-6 py-2.5">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>Nam</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>Nữ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'other'}
                    onChange={() => setGender('other')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>Khác</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Địa chỉ Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition"
                />
                <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <FiCheck /> Đã xác thực
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition"
                />
                <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <FiCheck /> Đã xác thực
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Ngày sinh
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3.5 top-3.5 text-gray-400 text-base" />
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Nhận quà sinh nhật voucher 20% mỗi năm</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-8 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Linked Accounts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg">
            <FiLink />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Tài khoản liên kết</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Đăng nhập nhanh chóng và nhận thông báo đơn hàng tức thì
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Google */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl border border-gray-100">
                <FcGoogle />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Tài khoản Google</h4>
                <p className="text-xs text-emerald-600 font-medium">Đã liên kết (an.nguyen@gmail.com)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert('Đã hủy liên kết Google (Demo)')}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-white"
            >
              Hủy liên kết
            </button>
          </div>

          {/* Telegram */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 shadow-sm flex items-center justify-center text-2xl border border-sky-100 text-sky-500">
                <FaTelegramPlane />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Telegram Bot</h4>
                <p className="text-xs text-gray-400">Nhận thông báo đơn hàng trực tiếp qua Telegram</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert('Đang mở Telegram Login Widget...')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-100 hover:bg-sky-200 px-3.5 py-1.5 rounded-xl transition"
            >
              Kết nối ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
