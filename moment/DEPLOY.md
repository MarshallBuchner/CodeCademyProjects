# Launch MOMENT on Vercel

Guest mode (on-device Moments, maps, share links) works **without** Supabase.
You can go live now; add cloud sync later.

## 1. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **MarshallBuchner/CodeCademyProjects**
3. Configure:
   - **Framework Preset:** Next.js (auto)
   - **Root Directory:** `moment` ← required
   - **Build Command:** `npm run build` (default)
   - **Output:** Next.js default
4. Environment variables:
   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SITE_URL` | `https://moment-opal.vercel.app` (or your URL) |
   | `NEXT_PUBLIC_SUPABASE_URL` | cloud sync |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | cloud sync |
   | `SUPABASE_SERVICE_ROLE_KEY` | account deletion (server-only) |
5. **Deploy**

Live URL: `https://moment-opal.vercel.app`

## 2. Phone install (PWA)

On iPhone Safari: Share → **Add to Home Screen**.

## 3. Accounts, privacy, email

Legal pages: `/privacy`, `/terms`, `/support`, `/account`

See [SETUP.md](./SETUP.md) and [AUTH.md](./AUTH.md) for:

- Supabase schema + Auth redirect URLs  
- Resend SMTP for reliable magic links  
- Magic Link email template (`token_hash`)  
- Service role key for delete-account  

## Why Root Directory matters

This repo also hosts GitHub Pages at the root. MOMENT lives in `moment/`, so Vercel must build that folder only.
