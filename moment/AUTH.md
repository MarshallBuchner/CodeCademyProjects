# MOMENT auth (magic link) — ops notes

## Support inbox
User-facing: **marshallbuchner96@gmail.com** (change in `src/lib/brand.ts` if you create a dedicated inbox).

Outbound magic links should send from Resend (e.g. `MOMENT <noreply@yourdomain.com>`).

## If magic links crash / land logged-out (iPhone)

Default Supabase links use PKCE (`?code=`). That needs a **code-verifier cookie**
from the **same browser** that requested the link.

Opening the email in **Mail / Gmail’s in-app browser** (or a different browser than
the one that tapped “Email me a magic link”) breaks it — Safari often shows
**“This page couldn’t load”**.

### User workaround (works today)
1. Open **https://moment-opal.vercel.app** in **Safari**
2. Profile → Email me a magic link
3. In Mail, **long-press** the link → **Open in Safari** (don’t tap once inside Mail)

### Fix A — already in code
Callback at `/auth/callback` accepts:
1. `token_hash` + `type` (no PKCE cookie)
2. `code` (PKCE)

Failed sign-ins now show a lightweight HTML explanation instead of a blank/crashy SPA load.

### Fix B — Supabase email template (do once — recommended)
Supabase → **Authentication** → **Email Templates** → **Magic Link**

Replace the default `{{ .ConfirmationURL }}` button/link with:

```html
<h2>Your sign-in link</h2>
<p>Follow the link below to sign in. This link expires shortly and can only be used once.</p>
<p>
  <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/">
    Sign in to MOMENT
  </a>
</p>
```

Save. New emails use `token_hash` and skip the PKCE / in-app-browser crash.

(Avoid stacking the default subject line + an extra “Your sign-in link” heading twice.)

### Redirect allow-list
Supabase → Authentication → URL Configuration:

- Site URL: `https://moment-opal.vercel.app`
- Redirect URLs:
  - `https://moment-opal.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

## Resend SMTP (recommended before real users)

Supabase free email is heavily rate-limited (~2/hour).

1. Create a [Resend](https://resend.com) account + verify your domain
2. Supabase → Project Settings → Authentication → **SMTP Settings**
3. Use Resend SMTP (host `smtp.resend.com`, user `resend`, password = API key)
4. Sender: `MOMENT <noreply@yourdomain.com>`

## Account deletion
Requires Vercel env **`SUPABASE_SERVICE_ROLE_KEY`** (Supabase → Project Settings → API → `service_role`).
Never expose this key in `NEXT_PUBLIC_*`.
