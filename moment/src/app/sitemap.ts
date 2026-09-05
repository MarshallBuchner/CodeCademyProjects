import type { MetadataRoute } from "next";

const base =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moment-opal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/privacy", "/terms", "/support", "/account"];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
