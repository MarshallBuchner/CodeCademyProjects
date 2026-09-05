# QuitCurve

Personalized vape quit coach — adaptive step-down plans that bend, not break.

## What's included

- **Landing page** — hero, how-it-works, progress section, nicotine curve preview, CTA
- **5-step onboarding** — device, frequency, nicotine level, weekly spend, plan pace
- **User accounts** — magic-link email auth via Supabase (guest mode + local fallback)
- **Cross-device sync** — plans, cravings, and check-ins saved to Supabase
- **Personalized curve** — calculated reduction schedule based on your inputs
- **Dashboard** — live stats: nicotine reduction %, money saved, cravings managed
- **Craving logging** — intensity, trigger, managed/unmanaged (adapts curve on slips)
- **Daily check-ins** — mood + plan adherence tracking
- **Check-in reminders** — optional daily email (Resend) + SMS (Twilio)
- **Puff pacing** — daily budget, used/remaining, on-pace status, next wait window, one-tap log

Built with Next.js 16, React 19, Tailwind CSS 4, Supabase.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — for cloud sync
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Without Supabase:** works immediately in guest/local mode.

**With Supabase:** see [SETUP.md](./SETUP.md) for full deploy + domain guide.  
**Reminders:** see [REMINDERS.md](./REMINDERS.md) after cloud sync is live.  
**Puff pacing:** see [PACING.md](./PACING.md) — daily budget, used/remaining, one-tap log.  
**App Store race:** see [APP_STORE.md](./APP_STORE.md) — web is live; native shell + Apple account still required.

## Deploy

**→ Start here: [DEPLOY.md](./DEPLOY.md)** — one-shot checklist to go live on Vercel.

1. Create `MarshallBuchner/quitcurve` on GitHub
2. Run `./scripts/push-to-github.sh` (or push manually)
3. Deploy to Vercel under **POWRHockey** team
4. Add domains: `quitcurve.app`, `quitcurve.ca`
5. Add Supabase env vars (optional, for cloud sync)

Full details: **[SETUP.md](./SETUP.md)** (Supabase + DNS)
