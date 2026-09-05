import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { MomentProvider } from "@/context/MomentProvider";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MOMENT — Leave something behind. Unlock it when you return.",
    template: "%s | MOMENT",
  },
  description:
    "A tradition generator. Leave something behind — unlock it when you return. Make the moment last forever.",
  keywords: [
    "location locked messages",
    "digital time capsule",
    "geofence memories",
    "moment app",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MOMENT",
  },
  icons: {
    icon: [{ url: "/icons/moment-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/moment-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "MOMENT",
    title: "MOMENT — Leave something behind. Unlock it when you return.",
    description:
      "Location-locked digital time capsules for the places that matter.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MomentProvider>{children}</MomentProvider>
        <Analytics />
      </body>
    </html>
  );
}
