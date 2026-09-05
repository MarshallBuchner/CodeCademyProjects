import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.moment.ios",
  appName: "MOMENT",
  webDir: "www",
  server: {
    // Load the live Next.js app (API routes, auth, maps stay on Vercel)
    url: process.env.MOMENT_SERVER_URL ?? "https://moment-opal.vercel.app",
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
