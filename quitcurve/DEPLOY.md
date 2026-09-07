# One-Shot Deploy Checklist

Get QuitCurve live on Vercel in one sitting (~45 min).

## Before you start

- [ ] GitHub account
- [ ] Vercel account (POWRHockey team)
- [ ] (Optional) Supabase account for cloud sync
- [ ] (Optional) `quitcurve.app` domain purchased

---

## Step 1: Create GitHub repo (5 min)

### Option A — GitHub website (easiest on iPhone)

1. Go to [github.com/new](https://github.com/new)
2. Repository name: **`quitcurve`**
3. Visibility: **Private** (or Public)
4. **Create repository** (don't add README)

### Option B — From your Mac

```bash
cd quitcurve
git init
git add .
git commit -m "Initial QuitCurve MVP"
git branch -M main
git remote add origin https://github.com/MarshallBuchner/quitcurve.git
git push -u origin main
```

> **Note:** If the code is still in `CodeCademyProjects/quitcurve/`, copy that folder to a new directory first, or push only the `quitcurve/` subfolder contents as the repo root.

---

## Step 2: Deploy to Vercel (10 min)

1. [vercel.com/new](https://vercel.com/new)
2. Import **`MarshallBuchner/quitcurve`**
3. Team: **POWRHockey**
4. Framework: **Next.js** (auto-detected)
5. Root directory: **`./`** (repo root)
6. Click **Deploy**

You'll get a URL like `quitcurve-xxx.vercel.app`.

### Test on iPhone

Open the Vercel URL in Safari → **Build my quit plan** → complete flow → dashboard.

---

## Step 3: Supabase — optional but recommended (15 min)

1. [supabase.com](https://supabase.com) → **New project** → name `quitcurve`
2. **SQL Editor** → paste `supabase/schema.sql` → **Run**
3. **Settings → API** → copy URL + anon key
4. **Authentication → URL Configuration**:
   - Site URL: your Vercel URL
   - Redirect URLs: `https://YOUR-VERCEL-URL.vercel.app/auth/callback`
5. Vercel → Project → **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (or `https://quitcurve.app`)
6. **Redeploy** (Deployments → ⋯ → Redeploy)

---

## Step 4: Custom domain (10 min)

1. Vercel → Project → **Settings → Domains**
2. Add `quitcurve.app`
3. GoDaddy → DNS → add records Vercel shows (usually A `@` → `76.76.21.21`)
4. Wait 5–60 min for DNS
5. Update Supabase redirect URLs to include `https://quitcurve.app/auth/callback`
6. Update `NEXT_PUBLIC_SITE_URL` to `https://quitcurve.app` in Vercel → Redeploy

---

## Step 5: MVP smoke test

- [ ] Landing page loads on iPhone Safari
- [ ] Onboarding completes (5 steps)
- [ ] Dashboard shows stats
- [ ] Log a craving works
- [ ] Daily check-in works
- [ ] Privacy page at `/privacy`
- [ ] (If Supabase) Magic link email arrives and sign-in works
- [ ] Add to Home Screen works (Safari → Share → Add to Home Screen)

---

## You're live when...

✅ `quitcurve.app` (or `.vercel.app`) loads on your phone  
✅ Full onboarding → dashboard flow works  
✅ Privacy policy is accessible  

Share the link with friends for feedback!
