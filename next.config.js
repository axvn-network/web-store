/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/phone.png', destination: '/images/contact/phone.png' },
      { source: '/zalo.png', destination: '/images/contact/zalo.png' },
      { source: '/Facebook.png', destination: '/images/contact/Facebook.png' },
      { source: '/facebook.png', destination: '/images/contact/Facebook.png' },
      { source: '/images/phone.png', destination: '/images/contact/phone.png' },
      { source: '/images/zalo.png', destination: '/images/contact/zalo.png' },
      { source: '/images/Facebook.png', destination: '/images/contact/Facebook.png' },
      { source: '/images/facebook.png', destination: '/images/contact/Facebook.png' },
      { source: '/images/contact/facebook.png', destination: '/images/contact/Facebook.png' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;


