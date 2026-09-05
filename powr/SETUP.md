# POWR Accounts Setup

POWR now supports **magic-link accounts** and **saved assessments** so players can
come back, review history, and track progress.

Guest mode still works with no backend.

## 1. Supabase

1. Create a project named `powr`
2. SQL Editor → paste `supabase/schema.sql` → Run
3. Settings → API → copy Project URL + `anon` key
4. Authentication → Email provider enabled
5. Authentication → URL configuration:
   - Site URL: `https://powr-mvp.vercel.app` (or your custom domain)
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://powr-mvp.vercel.app/auth/callback`
     - `https://*.vercel.app/auth/callback`

## 2. Environment variables

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

Add the same vars in Vercel → Project Settings → Environment Variables → Redeploy.

## 3. What users get

| Mode | Behavior |
|------|----------|
| Guest | Assess now; history saved on-device |
| Signed in | Assessments sync to Supabase; History + Progress pages show trends |

After a report, use **Save assessment** then **Sign in with email**.

## 4. Local

```bash
npm install
npm run dev
```

## 5. Store shell

Point `store-apps/apps/powr` Capacitor `server.url` at the deployed host after
this ships to Vercel.
