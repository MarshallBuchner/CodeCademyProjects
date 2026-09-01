import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { QuitCurveProvider } from "@/context/QuitCurveProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuitCurve — Quit vaping. Keep your momentum.",
  description:
    "A personalized step-down plan that adapts when life happens—so one slip never means starting over.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QuitCurveProvider>{children}</QuitCurveProvider>
      </body>
    </html>
  );
}
