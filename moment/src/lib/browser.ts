/** Detect common in-app browsers (Messenger, Instagram, etc.) where geolocation often fails. */
export function isInAppBrowser(userAgent?: string): boolean {
  if (typeof navigator === "undefined" && !userAgent) return false;
  const ua = userAgent ?? navigator.userAgent ?? "";
  return /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|Twitter|TikTok|Snapchat|Pinterest|LinkedInApp|WhatsApp|Discord|Electron/i.test(
    ua,
  );
}

export function preferredBrowserLabel(userAgent?: string): string {
  const ua = userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (/android/i.test(ua)) return "Chrome";
  if (/iPhone|iPad|iPod/i.test(ua)) return "Safari";
  return "your browser";
}
