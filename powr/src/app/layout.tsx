import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PowrProvider } from "@/context/PowrProvider";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "POWR — AI Hockey Development",
    template: "%s | POWR",
  },
  description:
    "Upload a skating clip. Get scores, coaching cues, and drills. Save assessments and track progress over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh bg-[#041016] font-[family-name:var(--font-body)] text-white antialiased">
        <PowrProvider>{children}</PowrProvider>
        <Analytics />
      </body>
    </html>
  );
}
