'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CloudProductPlan, 
  OperatingSystem, 
  XVPS_PRODUCT_PLANS, 
  XVPS_OPERATING_SYSTEMS 
} from '@/lib/xvpsApi';
import { formatVND } from '@/lib/utils';
import { 
  FiServer, 
  FiCpu, 
  FiHardDrive, 
  FiShield, 
  FiCheckCircle, 
  FiZap, 
  FiRefreshCw, 
  FiAward, 
  FiArrowRight,
  FiLayers,
  FiTerminal,
  FiGlobe,
  FiX
} from 'react-icons/fi';
import { BiHomeAlt, BiChevronRight, BiTimeFive } from 'react-icons/bi';

export default function CloudVpsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'cloud-hosting' | 'vps-vmware' | 'vps-kvm'>('all');
  const [billingCycle, setBillingCycle] = useState<'1_month' | '3_months' | '12_months'>('1_month');
  const [plans, setPlans] = useState<CloudProductPlan[]>(XVPS_PRODUCT_PLANS);
  const [osList, setOsList] = useState<OperatingSystem[]>(XVPS_OPERATING_SYSTEMS);
  const [agencyInfo, setAgencyInfo] = useState<any>(null);

  // Modal Đặt Mua
  const [selectedPlan, setSelectedPlan] = useState<CloudProductPlan | null>(null);
  const [selectedOs, setSelectedOs] = useState<string>('win-2022');
  const [hostname, setHostname] = useState<string>('');
  const [rootPassword, setRootPassword] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/cloud/agency')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setAgencyInfo(res.data);
      })
      .catch(() => {});
  }, []);

  const filteredPlans = plans.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  const getPrice = (plan: CloudProductPlan) => {
    if (billingCycle === '3_months') return plan.priceQuarterly;
    if (billingCycle === '12_months') return plan.priceYearly;
    return plan.priceMonthly;
  };

  const getPriceText = (plan: CloudProductPlan) => {
    const price = getPrice(plan);
    const unit = billingCycle === '1_month' ? '/tháng' : billingCycle === '3_months' ? '/3 tháng' : '/năm';
    return { price, unit };
  };

  const handleOpenOrder = (plan: CloudProductPlan) => {
    setSelectedPlan(plan);
    setHostname(`cloud-${Math.floor(1000 + Math.random() * 9000)}.betashop.vn`);
    setRootPassword(`BetaShop@${Math.floor(10000 + Math.random() * 90000)}!`);
    setOrderResult(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/cloud/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          osId: selectedOs,
          hostname,
          cycle: billingCycle,
          rootPassword,
          customerName,
          customerPhone,
          customerEmail,
        }),
      });
      const data = await res.json();
      setSubmitting(false);
      if (data.success) {
        setOrderResult(data);
      } else {
        alert(data.error || 'Có lỗi xảy ra khi tạo đơn hàng.');
      }
    } catch (err: any) {
      setSubmitting(false);
      alert('Lỗi kết nối tạo đơn hàng.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-16">
      {/* Breadcrumb - Standard Store Format */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-gray-800 font-medium">Dịch vụ Công nghệ & Máy chủ</span>
        <BiChevronRight className="text-gray-400" />
        <span className="text-[#f53d2d] font-bold">Cloud VPS & Hosting NVMe</span>
      </nav>

      {/* Hero Banner - Standard Store Gradient & Shape */}
      <div className="bg-gradient-to-r from-[#f53d2d] via-[#ff5522] to-[#ff7744] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          {/* Agency Partner Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/25">
              <FiAward className="text-yellow-300" />
              Đại lý Ủy quyền: Nam Vũ (VIP 1 - Chiết khấu 15%)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              XVPS Gateway 100% NVMe
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
            Cloud VPS, Hosting & Máy Chủ Doanh Nghiệp
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-orange-100 leading-relaxed max-w-2xl">
            Nền tảng ảo hóa VMware ESXi & KVM AMD EPYC chuyên dụng, 100% ổ cứng NVMe Gen4 tốc độ 7.000 MB/s, hạ tầng Tier 3 tại Việt Nam với cổng mạng 1Gbps không giới hạn băng thông và phòng thủ Anti-DDoS 50Gbps.
          </p>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-5 border-t border-white/20">
            <div className="bg-white/10 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl border border-white/15">
              <div className="text-yellow-300 text-lg mb-0.5"><FiCpu /></div>
              <div className="text-[10px] text-orange-100 font-medium">Vi Xử Lý</div>
              <div className="text-xs sm:text-sm font-bold text-white">AMD EPYC / Xeon Gold</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl border border-white/15">
              <div className="text-emerald-300 text-lg mb-0.5"><FiHardDrive /></div>
              <div className="text-[10px] text-orange-100 font-medium">Ổ Cứng NVMe</div>
              <div className="text-xs sm:text-sm font-bold text-white">RAID 10 7.000 MB/s</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl border border-white/15">
              <div className="text-sky-300 text-lg mb-0.5"><FiZap /></div>
              <div className="text-[10px] text-orange-100 font-medium">Băng Thông</div>
              <div className="text-xs sm:text-sm font-bold text-white">Port 1 Gbps Không Giới Hạn</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl border border-white/15">
              <div className="text-amber-300 text-lg mb-0.5"><FiShield /></div>
              <div className="text-[10px] text-orange-100 font-medium">Tường Lửa</div>
              <div className="text-xs sm:text-sm font-bold text-white">Anti-DDoS 50Gbps SLA 99.9%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Categories & Packages */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-gray-100 shadow-sm space-y-5">
        
        {/* Navigation & Billing Cycle Toolbar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          {/* Classification Tabs (Standard TabProducts Pill Style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-[#f53d2d] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiLayers />
              Tất Cả Gói ({plans.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cloud-hosting')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                activeTab === 'cloud-hosting'
                  ? 'bg-[#f53d2d] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiGlobe />
              Cloud Hosting NVMe
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vps-vmware')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                activeTab === 'vps-vmware'
                  ? 'bg-[#f53d2d] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiServer />
              VPS VMware Doanh Nghiệp
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vps-kvm')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                activeTab === 'vps-kvm'
                  ? 'bg-[#f53d2d] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiTerminal />
              Cloud VPS KVM Tốc Độ Cao
            </button>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold shrink-0 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => setBillingCycle('1_month')}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingCycle === '1_month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1 Tháng
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('3_months')}
              className={`px-3 py-1.5 rounded-lg transition ${
                billingCycle === '3_months'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3 Tháng (-5%)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('12_months')}
              className={`px-3 py-1.5 rounded-lg transition relative ${
                billingCycle === '12_months'
                  ? 'bg-[#f53d2d] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              12 Tháng (-15%)
              <span className="ml-1 bg-yellow-400 text-gray-900 text-[9px] px-1 py-0.2 rounded font-black">
                HOT
              </span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid - Consistent Store Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPlans.map((plan) => {
            const { price, unit } = getPriceText(plan);
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                  plan.popular
                    ? 'border-[#f53d2d] shadow-lg ring-1 ring-[#f53d2d]/30'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                {/* Popular / Best Value Ribbon */}
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-[#f53d2d] text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-bl-xl shadow-sm z-10">
                    {plan.badge}
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {/* Category Pill */}
                  <span className="text-[11px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-orange-50 text-[#f53d2d] inline-block mb-2">
                    {plan.categoryName}
                  </span>

                  <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                    {plan.name}
                  </h3>

                  {/* Price Area */}
                  <div className="mt-3 mb-5 pb-4 border-b border-gray-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#f53d2d]">
                        {formatVND(price)}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">{unit}</span>
                    </div>
                    <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                      <FiCheckCircle className="text-xs" />
                      Đã bao gồm VAT & hỗ trợ kỹ thuật 24/7
                    </div>
                  </div>

                  {/* Hardware Specs List */}
                  <div className="space-y-2.5 mb-5 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <FiCpu className="text-orange-500 text-sm" /> CPU vCore:
                      </span>
                      <span className="font-bold text-gray-900">{plan.cpu}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <FiServer className="text-blue-500 text-sm" /> Bộ Nhớ RAM:
                      </span>
                      <span className="font-bold text-gray-900">{plan.ram}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <FiHardDrive className="text-emerald-500 text-sm" /> Ổ Cứng:
                      </span>
                      <span className="font-bold text-gray-900">{plan.storage} ({plan.storageType})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <FiZap className="text-amber-500 text-sm" /> Băng Thông:
                      </span>
                      <span className="font-bold text-gray-900">{plan.bandwidth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <FiShield className="text-purple-500 text-sm" /> Địa Chỉ IP:
                      </span>
                      <span className="font-bold text-gray-900">{plan.ip}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Tính năng đi kèm:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleOpenOrder(plan)}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-95 shadow-sm ${
                      plan.popular
                        ? 'bg-[#f53d2d] hover:bg-[#e03122] text-white shadow-[#f53d2d]/25'
                        : 'bg-orange-50 hover:bg-[#f53d2d] text-[#f53d2d] hover:text-white border border-orange-200 hover:border-[#f53d2d]'
                    }`}
                  >
                    <span>Cấu Hình & Khởi Tạo Ngay</span>
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OS Catalog & Enterprise Commitments */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#f53d2d] rounded-full inline-block" />
              Đa Dạng Hệ Điều Hành Tự Động Khởi Tạo
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
              Cài đặt tự động chỉ sau 60 giây, cấp phát IP WAN riêng biệt & toàn quyền quản trị Root / Administrator.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {osList.map((os) => (
            <div
              key={os.id}
              className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100 flex items-center gap-2.5 hover:bg-orange-50/50 hover:border-orange-200 transition"
            >
              <span className="text-2xl">{os.icon}</span>
              <div>
                <div className="text-xs font-bold text-gray-900 leading-tight">{os.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{os.version}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Commitment Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/60 border border-orange-100">
            <div className="w-10 h-10 rounded-xl bg-[#f53d2d] text-white flex items-center justify-center text-xl shrink-0">
              <FiZap />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Khởi Tạo Siêu Tốc 60 Giây</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Hệ thống API kết nối tự động với XVPS Gateway, cấp phát địa chỉ IP và mật khẩu root gửi về giao diện ngay lập tức.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0">
              <FiRefreshCw />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Toàn Quyền Điều Khiển Trực Tuyến</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Khởi động, tắt nguồn, reboot máy chủ, cài lại hệ điều hành và đổi mật khẩu an toàn trực tiếp trên cổng quản trị khách hàng.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/60 border border-sky-100">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xl shrink-0">
              <FiShield />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">Bảo Mật & Hỗ Trợ 24/7</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Tường lửa chống tấn công DDoS phần cứng, sao lưu dữ liệu tự động và kỹ sư trực tổng đài 1900 8237 phục vụ 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Cấu Hình & Khởi Tạo Đơn Hàng (Clean White Store Modal) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative my-6 text-gray-900 border border-gray-100">
            <button
              type="button"
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl p-1.5 rounded-full hover:bg-gray-100 transition"
              aria-label="Đóng"
            >
              <FiX />
            </button>

            {orderResult ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                  <FiCheckCircle />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  Khởi Tạo Máy Chủ Thành Công!
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                  {orderResult.message}
                </p>

                {orderResult.vps && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left text-xs space-y-2 mt-3 font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mã máy chủ:</span>
                      <span className="text-orange-600 font-bold">{orderResult.vps.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Địa chỉ IPv4:</span>
                      <span className="text-emerald-700 font-bold">{orderResult.vps.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tài khoản quản trị:</span>
                      <span className="text-gray-900 font-bold">{orderResult.vps.adminUser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mật khẩu ban đầu:</span>
                      <span className="text-amber-700 font-bold">{orderResult.vps.adminPassword}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hệ điều hành:</span>
                      <span className="text-gray-800">{orderResult.vps.os}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 pt-4">
                  <Link
                    href="/tai-khoan/cloud-vps"
                    className="px-5 py-2.5 bg-[#f53d2d] hover:bg-[#e03122] text-white text-xs font-bold rounded-xl transition shadow active:scale-95"
                  >
                    Đến Trang Quản Lý VPS
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition active:scale-95"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block mb-1">
                    Cấu hình đơn hàng máy chủ
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedPlan.cpu} • {selectedPlan.ram} • {selectedPlan.storage}
                  </p>
                </div>

                {/* Chọn Hệ điều hành */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Chọn Hệ Điều Hành (OS):
                  </label>
                  <select
                    value={selectedOs}
                    onChange={(e) => setSelectedOs(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    {osList.map((os) => (
                      <option key={os.id} value={os.id}>
                        {os.icon} {os.name} ({os.version})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hostname & Root password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tên máy chủ (Hostname):</label>
                    <input
                      type="text"
                      required
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      placeholder="server01.betashop.vn"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu quản trị:</label>
                    <input
                      type="text"
                      required
                      value={rootPassword}
                      onChange={(e) => setRootPassword(e.target.value)}
                      placeholder="Mật khẩu bảo mật"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
                    />
                  </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-800 block mb-2">
                    Thông tin liên hệ nhận thông số & hóa đơn:
                  </span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Họ và tên người nhận"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Số điện thoại Zalo"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email nhận thông số"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Total & Submit */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-gray-400">Tổng thanh toán:</div>
                    <div className="text-xl font-black text-[#f53d2d]">
                      {formatVND(getPrice(selectedPlan))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#f53d2d] hover:bg-[#e03122] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition disabled:opacity-60 flex items-center gap-2 active:scale-95"
                  >
                    {submitting ? 'Đang kích hoạt...' : 'Xác Nhận & Kích Hoạt'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
