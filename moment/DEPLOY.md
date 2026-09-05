# Launch MOMENT on Vercel

Guest mode (on-device Moments, maps, share links) works **without** Supabase.
You can go live now; add cloud sync later.

## 1. Merge the GitHub PR

Open [PR #4](https://github.com/MarshallBuchner/CodeCademyProjects/pull/4) → **Merge pull request**.

This keeps GitHub Pages (`index.html` on `main`) untouched and adds the `moment/` app folder.

## 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **MarshallBuchner/CodeCademyProjects**
3. Configure:
   - **Framework Preset:** Next.js (auto)
   - **Root Directory:** `moment` ← required
   - **Build Command:** `npm run build` (default)
   - **Output:** Next.js default
4. Environment variables (optional for v1):
   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` (set after first deploy, then redeploy) |
   | `NEXT_PUBLIC_SUPABASE_URL` | only if using cloud sync |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | only if using cloud sync |
5. **Deploy**

Your live URL will look like `https://moment-….vercel.app`.

## 3. Phone install (PWA)

On iPhone Safari: Share → **Add to Home Screen**.

## 3b. App Store / Play (native shells)

Capacitor store shells live in [`store-apps/`](../store-apps/). After this Vercel URL is live, paste it into `store-apps/apps/moment/capacitor.config.ts` → `server.url`, then follow [`store-apps/LAUNCH_CHECKLIST.md`](../store-apps/LAUNCH_CHECKLIST.md).

## 4. Optional: Supabase cloud sync

See [SETUP.md](./SETUP.md). After you have a Vercel URL:

- Supabase Auth → Site URL = your Vercel URL  
- Redirect URLs include `https://YOUR-HOST/auth/callback`  
- Paste URL + anon key into Vercel env vars → Redeploy

## Why Root Directory matters

This repo also hosts GitHub Pages at the root. MOMENT lives in `moment/`, so Vercel must build that folder only.
