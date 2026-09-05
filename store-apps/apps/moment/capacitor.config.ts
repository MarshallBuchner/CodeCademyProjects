import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Native store shell for MOMENT.
 * Loads the live web app inside a Capacitor WebView with native plugins
 * (splash, status bar, network, share, camera/geo where relevant) so the
 * binary is more than a thin website wrapper for App Review.
 */
const config: CapacitorConfig = {
  appId: 'app.moment.leave',
  appName: 'MOMENT',
  webDir: 'www',
  server: {
    // Deploy moment/ on Vercel, then set STORE_APP_URL or replace this default.
    url: process.env.STORE_APP_URL || 'https://YOUR-MOMENT.vercel.app',
    cleartext: false,
    allowNavigation: [
          "*.vercel.app",
          "moment.app",
          "www.moment.app",
          "*.moment.app"
    ],
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: '#050608',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#050608',
    },
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#050608',
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#050608',
  },
};

export default config;
