import { analytics } from "@heycatch/sdk";
import type { UserProfile } from "@/lib/types";

const PENDING_SIGNUP_KEY = "heycatch_pending_signup";

/** Mark that the next confirmed session is a new signup (magic-link flow). */
export function markPendingSignup(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_SIGNUP_KEY, "1");
}

function consumePendingSignup(): boolean {
  if (typeof window === "undefined") return false;
  const pending = sessionStorage.getItem(PENDING_SIGNUP_KEY) === "1";
  if (pending) sessionStorage.removeItem(PENDING_SIGNUP_KEY);
  return pending;
}

/** Identify the current person. Optionally fire signup_completed once. */
export function identifyUser(
  user: UserProfile,
  options?: { trackSignup?: boolean },
): void {
  analytics.setIdentity(
    user.id,
    {
      email: user.email,
      name: user.name,
    },
    { signup_date: user.createdAt },
  );

  const trackSignup = options?.trackSignup ?? consumePendingSignup();
  if (trackSignup) {
    analytics.trackEvent("signup_completed");
  }
}

export function trackOnboardingCompleted(properties?: {
  pace?: string;
  guest?: boolean;
}): void {
  analytics.trackEvent("onboarding_completed", properties);
}

export function resetHeyCatchIdentity(): void {
  analytics.resetIdentity();
}
