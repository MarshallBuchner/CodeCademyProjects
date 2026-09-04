# MOMENT Setup

**Going live?** See [DEPLOY.md](./DEPLOY.md) for Vercel + GitHub.

## Maps (already live)

Real dark OpenStreetMap tiles via Leaflet + Nominatim search/reverse geocode.
No API key required. Works in guest mode.

## Cloud sync (Supabase) — optional

Without keys the app keeps working on-device. With keys, magic-link sign-in syncs Moments across phones.

### 1. Create project
1. [supabase.com](https://supabase.com) → New project (e.g. `moment`)
2. SQL Editor → paste `supabase/schema.sql` → Run

### 2. Keys
Project Settings → API → copy **URL** + **anon public** key into `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Auth URLs
Authentication → URL Configuration:
- Site URL: your future Vercel URL (or tunnel URL while testing)
- Redirect URLs: `https://YOUR_HOST/auth/callback` and `http://localhost:3000/auth/callback`

### 4. Sign in
Profile → enter email → magic link → Moments sync.

**Note:** Very large videos may stay device-local until you add a Storage bucket; notes/photos sync fine.
