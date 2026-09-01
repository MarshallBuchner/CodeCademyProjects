# QuitCurve

Personalized vape quit coach — adaptive step-down plans that bend, not break.

## What's included

- **Landing page** — hero, how-it-works, progress section, nicotine curve preview, CTA
- **5-step onboarding** — device, frequency, nicotine level, weekly spend, plan pace
- **User accounts** — local email + name accounts (guest mode supported)
- **Personalized curve** — calculated reduction schedule based on your inputs
- **Dashboard** — live stats: nicotine reduction %, money saved, cravings managed
- **Craving logging** — intensity, trigger, managed/unmanaged (adapts curve on slips)
- **Daily check-ins** — mood + plan adherence tracking

Built with Next.js 16, React 19, Tailwind CSS 4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Build my quit plan** → complete intake → dashboard.

## Deploy to Vercel (POWRHockey team)

1. Create GitHub repo `MarshallBuchner/quitcurve` and push this project
2. Vercel → **Add New Project** → import repo → **POWRHockey** team
3. Add custom domains: `quitcurve.app`, `quitcurve.ca`

## Data storage

Progress is saved in the browser (localStorage) for now — works immediately without setup. Supabase integration can be added later for cross-device sync.

## Next priorities

- [ ] Supabase backend for cross-device sync
- [ ] Push notifications for daily check-ins
- [ ] Deeper nicotine intake tracking (puffs/pods per day)
- [ ] Shareable progress milestones
