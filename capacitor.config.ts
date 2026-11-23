import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.betashop.webstore',
  appName: 'BetaShop',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    // Có thể cấu hình load từ domain production của bạn khi build APK
    url: process.env.APP_URL || 'https://web-store.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
