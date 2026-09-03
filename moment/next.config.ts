import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare quick-tunnel hosts when using `next dev`
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
