import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Completes magic-link / OTP sign-in.
 *
 * Supports:
 * 1) token_hash + type  (no PKCE cookie — preferred; update Supabase email template)
 * 2) code               (PKCE — needs code-verifier cookie from the same browser)
 *
 * Failures return a tiny HTML page (not the full SPA) so Safari/Mail doesn't
 * die on a heavy redirect when the link was opened in a different browser.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const code = searchParams.get("code");
  const tokenHash =
    searchParams.get("token_hash") ?? searchParams.get("tokenHash");
  const otpType = searchParams.get("type") ?? "email";
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") ? rawNext : "/";

  if (!isSupabaseConfigured()) {
    return htmlError(
      origin,
      "Cloud sign-in isn’t configured on this deploy yet.",
    );
  }

  const redirectResponse = NextResponse.redirect(
    `${origin}${next}${next.includes("?") ? "&" : "?"}signedIn=1`,
  );
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
            redirectResponse.cookies.set(name, value, {
              ...options,
              // Help iOS Safari keep the session across the Mail → Safari hop
              sameSite: "lax",
              secure: origin.startsWith("https"),
              path: "/",
            });
          });
        },
      },
    },
  );

  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      type: otpType as EmailOtpType,
      token_hash: tokenHash,
    });
    if (!error) return redirectResponse;
    return htmlError(
      origin,
      friendlyAuthError(error.message),
      "This sign-in link is invalid or expired. Request a new one from Profile.",
    );
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirectResponse;
    const msg = error.message || "";
    const pkce =
      /code verifier|PKCE|verifier not found|both auth code and code verifier/i.test(
        msg,
      );
    return htmlError(
      origin,
      pkce
        ? "This link opened in a different browser than the one that asked for it."
        : friendlyAuthError(msg),
      pkce
        ? "On iPhone: open MOMENT in Safari → Profile → request a new magic link → open that email with Safari (long-press the link → Open in Safari), not inside Gmail/Mail’s in-app browser."
        : "Request a fresh magic link from Profile and try again.",
    );
  }

  return htmlError(
    origin,
    "This sign-in link is missing its key.",
    "Go back to MOMENT and tap “Email me a magic link” again.",
  );
}

function friendlyAuthError(raw: string) {
  if (/expired|invalid/i.test(raw)) {
    return "This sign-in link expired or was already used.";
  }
  if (/verifier|PKCE/i.test(raw)) {
    return "This link opened in a different browser than the one that asked for it.";
  }
  // Keep short — long error strings can look like a crash on mobile
  return "Couldn’t finish signing you in.";
}

function htmlError(origin: string, title: string, detail?: string) {
  const safeTitle = escapeHtml(title);
  const safeDetail = escapeHtml(
    detail ?? "Request a new magic link from Profile in MOMENT.",
  );
  const home = escapeHtml(origin);
  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <meta name="theme-color" content="#050608"/>
  <title>MOMENT · Sign-in</title>
  <style>
    :root { color-scheme: dark; }
    body {
      margin: 0; min-height: 100dvh; display: grid; place-items: center;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      background: #050608; color: #f4f1ea; padding: 24px;
    }
    .card {
      width: min(100%, 26rem); border: 1px solid rgba(255,255,255,.1);
      background: #0d0f16; border-radius: 28px; padding: 28px 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,.55);
    }
    .eyebrow { color: #ff8a2a; letter-spacing: .22em; font-size: 11px; text-transform: uppercase; }
    h1 { font-size: 1.55rem; line-height: 1.25; margin: 10px 0 0; font-weight: 600; }
    p { color: #9aa0ad; font-size: .95rem; line-height: 1.5; margin: 12px 0 0; }
    a {
      display: block; margin-top: 22px; text-align: center; text-decoration: none;
      background: linear-gradient(135deg,#ff8a2a,#ff5c1a); color: #111;
      font-weight: 650; border-radius: 999px; padding: 14px 18px;
    }
  </style>
</head>
<body>
  <main class="card">
    <p class="eyebrow">MOMENT</p>
    <h1>${safeTitle}</h1>
    <p>${safeDetail}</p>
    <a href="${home}/?view=profile">Back to MOMENT Profile</a>
  </main>
</body>
</html>`;
  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
