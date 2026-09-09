import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authCookieOptions } from "@/lib/supabase/cookies";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Completes magic-link / OTP sign-in.
 *
 * Supports:
 * 1) token_hash + type  (no PKCE cookie needed — preferred)
 * 2) code               (PKCE — needs code-verifier cookie from same browser)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const base =
    process.env.NODE_ENV === "development"
      ? origin
      : forwardedHost
        ? `https://${forwardedHost}`
        : origin.replace("://quitcurve.app", "://www.quitcurve.app");

  const redirectResponse = NextResponse.redirect(`${base}${next}`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: authCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectResponse.cookies.set(name, value, {
              ...authCookieOptions,
              ...options,
            });
          });
        },
      },
    },
  );

  // Preferred path: token_hash from customized Supabase email template
  if (tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({
      type: otpType as EmailOtpType,
      token_hash: tokenHash,
    });
    if (!error) return redirectResponse;
    console.error("[auth/callback] verifyOtp failed:", error.message);
    return NextResponse.redirect(
      `${base}/login?error=auth&reason=${encodeURIComponent(error.message)}`,
    );
  }

  // PKCE path: default Supabase magic-link (?code=...)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirectResponse;
    console.error("[auth/callback] exchange failed:", error.message);
    return NextResponse.redirect(
      `${base}/login?error=auth&reason=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${base}/login?error=auth`);
}
