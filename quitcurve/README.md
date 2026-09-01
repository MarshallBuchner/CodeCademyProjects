# QuitCurve

Personalized vape quit coach — adaptive step-down plans that bend, not break.

## What's included (MVP prototype)

- **Landing page** — hero, how-it-works, progress section, nicotine curve preview, CTA
- **3-step onboarding** — device type, usage frequency, plan pace (4 / 8 / 12 weeks)
- **Dashboard** — week progress, nicotine curve chart, stats, craving log CTA

Built with Next.js 16, React 19, Tailwind CSS 4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel (POWRHockey team)

1. Create a new GitHub repo: `MarshallBuchner/quitcurve`
2. Push this project:

   ```bash
   git remote add origin https://github.com/MarshallBuchner/quitcurve.git
   git push -u origin cursor/quitcurve-scaffold-cbbd
   ```

3. In [Vercel](https://vercel.com), **Add New Project** → import `quitcurve` → select your **POWRHockey** team
4. Deploy — you'll get something like `quitcurve.vercel.app`

## Next build priorities

- User accounts
- Detailed nicotine intake
- Personalized curve calculation
- Daily check-ins and craving logging
- Saved progress dashboard
- Money and nicotine reduction calculations
