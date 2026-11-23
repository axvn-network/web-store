'use client';

import React, { useState } from 'react';
import { FaPhoneAlt, FaFacebookF, FaTelegramPlane } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

export default function FloatingContactWidget() {
  const [phoneError, setPhoneError] = useState(false);
  const [fbError, setFbError] = useState(false);
  const [zaloError, setZaloError] = useState(false);

  return (
    <div id="button-contact-vr" className="select-none">
      <div id="gom-all-in-one">
        {/* Hotline VR */}
        <div id="phone-vr" className="button-contact">
          <div className="phone-vr">
            <div
              className="phone-vr-circle-fill"
              style={{ backgroundColor: 'rgba(230, 8, 8, 0.28)' }}
            />
            <div
              className="phone-vr-img-circle"
              style={{ backgroundColor: '#e60808' }}
            >
              <a
                href="tel:19008237"
                aria-label="Gọi hotline 1900 8237"
                className="w-full h-full flex items-center justify-center p-2.5"
              >
                {!phoneError ? (
                  <img
                    src="/images/contact/phone.png"
                    alt="Hotline"
                    onError={() => setPhoneError(true)}
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                ) : (
                  <FaPhoneAlt className="text-lg text-white" />
                )}
              </a>
            </div>
          </div>
          <span className="phone-vr-label">Hotline: 1900 8237</span>
        </div>

        {/* Fanpage Facebook VR */}
        <div id="fanpage-vr" className="button-contact">
          <div className="phone-vr">
            <div
              className="phone-vr-circle-fill"
              style={{ backgroundColor: 'rgba(24, 119, 242, 0.28)' }}
            />
            <div
              className="phone-vr-img-circle"
              style={{ backgroundColor: '#1877f2' }}
            >
              <a
                target="_blank"
                rel="noreferrer"
                href="https://m.me/taikhoanre1"
                aria-label="Nhắn tin Facebook Messenger"
                className="w-full h-full flex items-center justify-center p-2.5"
              >
                {!fbError ? (
                  <img
                    src="/images/contact/Facebook.png"
                    alt="Facebook"
                    onError={() => setFbError(true)}
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                ) : (
                  <FaFacebookF className="text-xl text-white" />
                )}
              </a>
            </div>
          </div>
          <span className="phone-vr-label">Facebook: taikhoanre1</span>
        </div>

        {/* Zalo VR */}
        <div id="zalo-vr" className="button-contact">
          <div className="phone-vr">
            <div
              className="phone-vr-circle-fill"
              style={{ backgroundColor: 'rgba(0, 104, 255, 0.28)' }}
            />
            <div
              className="phone-vr-img-circle"
              style={{ backgroundColor: '#0068ff' }}
            >
              <a
                target="_blank"
                rel="noreferrer"
                href="https://zalo.me/0379196620"
                aria-label="Chat Zalo 0379196620"
                className="w-full h-full flex items-center justify-center p-2"
              >
                {!zaloError ? (
                  <img
                    src="/images/contact/zalo.png"
                    alt="Zalo"
                    onError={() => setZaloError(true)}
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                ) : (
                  <SiZalo className="text-2xl text-white" />
                )}
              </a>
            </div>
          </div>
          <span className="phone-vr-label">Zalo: 0379 196 620</span>
        </div>

        {/* Telegram VR */}
        <div id="telegram-vr" className="button-contact">
          <div className="phone-vr">
            <div
              className="phone-vr-circle-fill"
              style={{ backgroundColor: 'rgba(36, 161, 222, 0.28)' }}
            />
            <div
              className="phone-vr-img-circle"
              style={{ backgroundColor: '#24A1DE' }}
            >
              <a
                target="_blank"
                rel="noreferrer"
                href="https://t.me/betashop_cskh"
                aria-label="Kênh Telegram CSKH"
                className="w-full h-full flex items-center justify-center text-white"
              >
                <FaTelegramPlane className="text-xl" />
              </a>
            </div>
          </div>
          <span className="phone-vr-label">Telegram CSKH 24/7</span>
        </div>
      </div>
    </div>
  );
}
