"use client";

import Script from "next/script";
import { getTikTokPixelId } from "@/lib/tiktok-pixel";

/** Only allow safe pixel id characters from env. */
function sanitizePixelId(id: string): string | null {
  const cleaned = id.trim();
  if (!/^[A-Za-z0-9]+$/.test(cleaned)) return null;
  return cleaned;
}

/**
 * TikTok Pixel base code. Renders nothing until NEXT_PUBLIC_TIKTOK_PIXEL_ID is set.
 * Create the pixel in TikTok Ads → Assets → Events, then add the ID in Vercel.
 */
export function TikTokPixel() {
  const rawId = getTikTokPixelId();
  const pixelId = rawId ? sanitizePixelId(rawId) : null;
  if (!pixelId) return null;

  // Official TikTok base snippet (load + PageView)
  const snippet = `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${pixelId}');
  ttq.page();
}(window, document, 'ttq');
`;

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
}
