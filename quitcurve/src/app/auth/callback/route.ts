import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Exchange the magic-link / OAuth code for a session and attach auth cookies
 * to the *redirect* response. Writing cookies only via cookies().set() often
 * drops them on redirect, so the user lands logged-out on home/dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  // Prefer www host so session cookies match the canonical site.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const base =
    process.env.NODE_ENV === "development"
      ? origin
      : forwardedHost
        ? `https://${forwardedHost}`
        : origin.replace("://quitcurve.app", "://www.quitcurve.app");

  if (code) {
    const redirectResponse = NextResponse.redirect(`${base}${next}`);

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

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirectResponse;
    }

    console.error("[auth/callback] exchange failed:", error.message);
    return NextResponse.redirect(
      `${base}/login?error=auth&reason=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${base}/login?error=auth`);
}
