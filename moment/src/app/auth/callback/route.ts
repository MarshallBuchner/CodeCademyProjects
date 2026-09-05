import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Completes magic-link / OTP sign-in.
 *
 * Supports:
 * 1) token_hash + type  (no PKCE cookie — preferred after email template update)
 * 2) code               (PKCE — needs code-verifier cookie from same browser)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type");
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") ? rawNext : "/";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/`);
  }

  const redirectResponse = NextResponse.redirect(`${origin}${next}`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  if (tokenHash && otpType) {
    const { error } = await supabase.auth.verifyOtp({
      type: otpType as EmailOtpType,
      token_hash: tokenHash,
    });
    if (!error) return redirectResponse;
    return NextResponse.redirect(
      `${origin}/?authError=${encodeURIComponent(error.message)}`,
    );
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirectResponse;
    return NextResponse.redirect(
      `${origin}/?authError=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}/?authError=missing_code`);
}
