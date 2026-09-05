import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

/** Call once at app boot when using a local bundle; remote URL shells still benefit on native. */
export async function bootNativeShell() {
  try {
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    /* web */
  }
  try {
    await SplashScreen.hide();
  } catch {
    /* web */
  }

  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) window.history.back();
    else App.exitApp();
  });

  Network.addListener('networkStatusChange', (status) => {
    if (!status.connected) {
      console.warn('[moment] offline');
    }
  });
}
