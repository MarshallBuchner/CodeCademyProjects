# QuitCurve Setup Guide

Complete setup for Supabase sync, Vercel deployment, and custom domains.

---

## 1. Supabase (cross-device sync)

### Create project
1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `quitcurve`, choose a region close to you (e.g. Canada Central)
3. Save your database password

### Run database schema
1. In Supabase dashboard → **SQL Editor** → **New query**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

### Get API keys
1. **Project Settings** → **API**
2. Copy **Project URL** and **anon public** key

### Configure the app
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Paste your Supabase URL and anon key

### Enable email auth
1. **Authentication** → **Providers** → **Email** → enable
2. **Authentication** → **URL Configuration**:
   - **Site URL**: `https://quitcurve.app` (or your Vercel URL for now)
   - **Redirect URLs**: add:
     - `http://localhost:3000/auth/callback`
     - `https://quitcurve.vercel.app/auth/callback`
     - `https://quitcurve.app/auth/callback`
     - `https://www.quitcurve.app/auth/callback`
     - `https://quitcurve.ca/auth/callback`

### How auth works
- Users enter email → receive **magic link**
- Tap link → signed in → progress syncs to cloud
- Local data auto-uploads on first sign-in

**Without Supabase:** app still works in guest/local mode via browser storage.

---

## 1b. Check-in reminders (optional)

Daily email (Resend) + optional SMS (Twilio). Full guide: **[REMINDERS.md](./REMINDERS.md)**

1. Run `supabase/reminders.sql` in the SQL Editor
2. Add Vercel env vars: `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `RESEND_API_KEY`, `REMINDER_FROM_EMAIL`
3. Redeploy (enables hourly cron at `/api/cron/reminders`)
4. Users opt in at `/reminders`

---

## 2. Vercel deployment (POWRHockey team)

### Create GitHub repo
1. GitHub → **New repository** → `quitcurve`
2. Push the `quitcurve/` folder to it

### Deploy
1. [vercel.com](https://vercel.com) → **Add New Project**
2. Import `MarshallBuchner/quitcurve`
3. Select **POWRHockey** team
4. Root directory: `/` (if repo is just quitcurve) or `quitcurve` (if monorepo)
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. **Deploy**

You'll get `quitcurve.vercel.app` (or similar).

---

## 3. Custom domains (quitcurve.app + quitcurve.ca)

### In Vercel
1. Project → **Settings** → **Domains**
2. Add `quitcurve.app`
3. Add `quitcurve.ca`
4. (Optional) Add `www.quitcurve.app` → redirect to `quitcurve.app`

Vercel shows DNS records to add.

### In GoDaddy

**For quitcurve.app:**
| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

**For quitcurve.ca:**
| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

DNS can take up to 48 hours (usually much faster).

### Recommended setup
- **quitcurve.app** → primary app URL
- **quitcurve.ca** → redirect to `.app` (configure in Vercel)

---

## 4. Test on iPhone

Once deployed:
1. Open `https://quitcurve.app` in Safari
2. Complete onboarding → create account
3. Check email → tap magic link
4. Progress syncs across devices

No Mac or tunnel needed.

---

## Quick reference

| Task | Where |
|------|-------|
| Database schema | `supabase/schema.sql` |
| Env vars | `.env.local` / Vercel dashboard |
| Auth callback | `/auth/callback` (auto-handled) |
| Local dev | `npm run dev` |
