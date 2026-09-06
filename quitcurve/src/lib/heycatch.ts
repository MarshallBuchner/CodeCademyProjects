import { analytics } from "@heycatch/sdk";
import type { UserProfile } from "@/lib/types";

const PENDING_SIGNUP_KEY = "heycatch_pending_signup";
const FIRST_CHECK_IN_KEY = "heycatch_first_check_in_sent";

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

export function trackCtaClicked(properties?: { location?: string }): void {
  analytics.trackEvent("cta_clicked", properties);
}

export function trackOnboardingStarted(): void {
  analytics.trackEvent("onboarding_started");
}

export function trackPlanCreated(properties?: {
  pace?: string;
  guest?: boolean;
}): void {
  analytics.trackEvent("plan_created", properties);
}

export function trackOnboardingCompleted(properties?: {
  pace?: string;
  guest?: boolean;
}): void {
  analytics.trackEvent("onboarding_completed", properties);
}

/** Fire once per browser when the user completes their first check-in. */
export function trackFirstCheckIn(properties?: {
  mood?: string;
  stayedOnPlan?: boolean;
}): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(FIRST_CHECK_IN_KEY) === "1") {
    analytics.trackEvent("check_in_completed", properties);
    return;
  }
  localStorage.setItem(FIRST_CHECK_IN_KEY, "1");
  analytics.trackEvent("first_check_in", properties);
  analytics.trackEvent("check_in_completed", properties);
}

export function resetHeyCatchIdentity(): void {
  analytics.resetIdentity();
}
