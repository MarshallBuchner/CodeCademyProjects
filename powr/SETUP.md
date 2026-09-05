# POWR Setup — accounts + saved assessments

POWR now supports **magic-link accounts** and **saved assessment history**
(same pattern as QuitCurve). Guest mode still works without Supabase.

## 1. Create Supabase project

1. [supabase.com](https://supabase.com) → New project → name `powr`
2. SQL Editor → paste `supabase/schema.sql` → Run
3. Project Settings → API → copy **Project URL** + **anon public** key
4. Authentication → Providers → Email → enable
5. Authentication → URL Configuration:
   - Site URL: your Vercel URL (e.g. `https://powr-mvp.vercel.app`)
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://powr-mvp.vercel.app/auth/callback`
     - `https://*.vercel.app/auth/callback`

## 2. Env vars

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://powr-mvp.vercel.app
```

Add the same vars in Vercel → Project → Settings → Environment Variables → Redeploy.

## 3. What users get

| Mode | Behavior |
|------|----------|
| Guest | Assess now, history on-device |
| Signed in | Assessments sync to Supabase; Progress page shows trends |

After an assessment, guests see a CTA to **Save with email magic link**.

## 4. Store shell

`store-apps/apps/powr` already points at `https://powr-mvp.vercel.app`.
After you deploy this app (or replace that project), keep the Capacitor
`server.url` on the live host.

## 5. Local run

```bash
cd powr
npm install
npm run dev
```
