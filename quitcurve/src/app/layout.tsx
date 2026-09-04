import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QuitCurveProvider } from "@/context/QuitCurveProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quitcurve.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QuitCurve — Quit vaping. Keep your momentum.",
    template: "%s | QuitCurve",
  },
  description:
    "A personalized step-down plan that adapts when life happens—so one slip never means starting over.",
  keywords: [
    "quit vaping",
    "nicotine reduction",
    "vape quit",
    "quit curve",
    "craving tracker",
  ],
  authors: [{ name: "QuitCurve" }],
  creator: "QuitCurve",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "QuitCurve",
    title: "QuitCurve — Quit vaping. Keep your momentum.",
    description:
      "A personalized step-down plan that adapts when life happens—so one slip never means starting over.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuitCurve — Quit vaping. Keep your momentum.",
    description:
      "A personalized step-down plan that adapts when life happens.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QuitCurve",
  },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#070b09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QuitCurveProvider>{children}</QuitCurveProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
