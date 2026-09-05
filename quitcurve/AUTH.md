# QuitCurve auth (magic link) — ops notes

## If magic links land logged-out / “unusable for a minute”

Default Supabase links use PKCE (`?code=`). That needs a **code-verifier cookie**
from the same browser that requested the link. Opening the email in another
browser/device, or losing cookies between apex/`www`, breaks it.

### Fix A — already in code
- Session cookies use domain `.quitcurve.app` (shared by apex + www)
- Callback sets cookies on the redirect response
- Callback also accepts `token_hash` (no PKCE cookie needed)

### Fix B — Supabase email template (do this once)
Supabase → **Authentication** → **Email Templates** → **Magic Link**

Replace the button/link URL with:

```html
<a href="https://www.quitcurve.app/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/dashboard">
  Sign in to QuitCurve
</a>
```

Save. New emails will use `token_hash` and skip the PKCE cookie issue.

### Redirect allow-list
Supabase → Authentication → URL Configuration:

- Site URL: `https://www.quitcurve.app`
- Redirect URLs include:
  - `https://www.quitcurve.app/auth/callback`
  - `https://quitcurve.app/auth/callback`

## Contact email
User-facing support: **quitcurve@gmail.com**  
(Outbound Resend can still use `noreply@quitcurve.app`.)
