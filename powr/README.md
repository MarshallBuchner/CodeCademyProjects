# POWR

AI hockey development — upload a skating clip, get a coaching report, **save assessments to an account**, and track progress over time.

## Features

- Guest assessments (no account required for first run)
- Magic-link accounts via Supabase (QuitCurve pattern)
- Saved assessment history + progress trends
- `/privacy` for App Store / Play
- Capacitor shell ready under `store-apps/apps/powr`

## Quick start

```bash
cd powr
npm install
cp .env.example .env.local   # optional — enables cloud accounts
npm run dev
```

Without Supabase keys, everything works in **guest/local** mode.

With Supabase: follow **[SETUP.md](./SETUP.md)**.

## Deploy

1. Push this `powr/` app (or deploy from monorepo with Root Directory = `powr`)
2. Add Supabase env vars on Vercel
3. Point `store-apps/apps/powr/capacitor.config.ts` `server.url` at the live host
4. Open Xcode / Android Studio from `store-apps` and submit

Live MVP reference (previous prototype): `https://powr-mvp.vercel.app`
