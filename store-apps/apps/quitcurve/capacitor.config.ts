import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Native store shell for QuitCurve.
 * Loads the live web app inside a Capacitor WebView with native plugins
 * (splash, status bar, network, share, camera/geo where relevant) so the
 * binary is more than a thin website wrapper for App Review.
 */
const config: CapacitorConfig = {
  appId: 'app.quitcurve.mobile',
  appName: 'QuitCurve',
  webDir: 'www',
  server: {
    url: process.env.STORE_APP_URL || 'https://www.quitcurve.app',
    cleartext: false,
    allowNavigation: [
          "quitcurve.app",
          "www.quitcurve.app",
          "*.quitcurve.app",
          "*.vercel.app"
    ],
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 800,
      backgroundColor: '#0B1220',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0B1220',
    },
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0B1220',
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#0B1220',
  },
};

export default config;
