# MOMENT auth (magic link) — ops notes

## Support inbox
User-facing: **marshallbuchner96@gmail.com** (change in `src/lib/brand.ts` if you create a dedicated inbox).

Outbound magic links should send from Resend (e.g. `MOMENT <noreply@yourdomain.com>`).

## If magic links land logged-out

Default Supabase links use PKCE (`?code=`). That needs a **code-verifier cookie**
from the **same browser** that requested the link. Opening the email in another
browser/app (or losing cookies) breaks it.

### Fix A — already in code
Callback at `/auth/callback` accepts:
1. `token_hash` + `type` (no PKCE cookie)
2. `code` (PKCE)

### Fix B — Supabase email template (do once)
Supabase → **Authentication** → **Email Templates** → **Magic Link**

Set the button/link URL to:

```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/">
  Sign in to MOMENT
</a>
```

Save. New emails use `token_hash` and skip the PKCE cookie issue.

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
