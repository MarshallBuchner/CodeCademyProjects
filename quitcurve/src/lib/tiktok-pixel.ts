/**
 * TikTok Pixel helpers (ttq).
 * Base snippet is loaded by `TikTokPixel` in the root layout when
 * NEXT_PUBLIC_TIKTOK_PIXEL_ID is set.
 */

type Ttq = {
  page: (...args: unknown[]) => void;
  track: (event: string, params?: Record<string, unknown>) => void;
  identify: (params: Record<string, unknown>) => void;
  load: (pixelId: string, options?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    ttq?: Ttq;
  }
}

export function getTikTokPixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim();
  return id || undefined;
}

export function isTikTokPixelConfigured(): boolean {
  return Boolean(getTikTokPixelId());
}

function ttq(): Ttq | undefined {
  if (typeof window === "undefined") return undefined;
  return window.ttq;
}

export function trackTikTokEvent(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (!getTikTokPixelId()) return;
  ttq()?.track(event, params);
}

/** Primary conversion for ads — guest or signed-in plan created. */
export function trackTikTokPlanCreated(properties?: {
  pace?: string;
  guest?: boolean;
}): void {
  trackTikTokEvent("CompleteRegistration", {
    content_name: "quitcurve_plan_created",
    content_category: "quit_vaping",
    status: properties?.guest ? "guest" : "account",
    ...(properties?.pace ? { description: properties.pace } : {}),
  });
}

export function trackTikTokCtaClicked(properties?: { location?: string }): void {
  trackTikTokEvent("ClickButton", {
    content_name: "build_quit_plan",
    content_category: properties?.location ?? "unknown",
  });
}

export function trackTikTokOnboardingStarted(): void {
  trackTikTokEvent("ViewContent", {
    content_name: "onboarding",
    content_category: "quit_vaping",
    content_type: "product",
  });
}

export function trackTikTokSignupCompleted(): void {
  trackTikTokEvent("Subscribe", {
    content_name: "quitcurve_signup",
    content_category: "quit_vaping",
  });
}
