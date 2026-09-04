import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Native store shell for POWR.
 * Loads the live web app inside a Capacitor WebView with native plugins
 * (splash, status bar, network, share, camera/geo where relevant) so the
 * binary is more than a thin website wrapper for App Review.
 */
const config: CapacitorConfig = {
  appId: 'app.powr.hockey',
  appName: 'POWR',
  webDir: 'www',
  server: {
    url: process.env.STORE_APP_URL || 'https://powr-mvp.vercel.app',
    cleartext: false,
    allowNavigation: [
          "powr-mvp.vercel.app",
          "*.vercel.app",
          "powrhockey.app",
          "www.powrhockey.app"
    ],
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: '#0A0F1C',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A0F1C',
    },
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0A0F1C',
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#0A0F1C',
  },
};

export default config;
