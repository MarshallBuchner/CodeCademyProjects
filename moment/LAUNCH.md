# Dual-app store sprint — MOMENT + QuitCurve

**Goal:** get **MOMENT** and **QuitCurve** onto App Store + Play. **POWR after.**

## Parallel tracks

| Track | Owner | Notes |
|-------|--------|------|
| A. Apple Developer + Play Console | Marshall | Blocks TestFlight / internal testing |
| B. Capacitor shells | Marshall + agent | Mac needed for iOS archive |
| C. Listing assets | Marshall | Screenshots from phone / Simulator |
| D. Product polish | Agent | Icons, age gates, legal (mostly done) |

## Bundle IDs (register in Apple / Play)

| App | iOS | Android |
|-----|-----|---------|
| QuitCurve | `app.quitcurve.ios` | `app.quitcurve.android` |
| MOMENT | `app.moment.ios` | `app.moment.android` |

## This week — ordered

### Day 1–2 (accounts)
1. Apple Developer Program enrollment (or team invite)
2. Google Play Console signup
3. Create ASC apps: QuitCurve + MOMENT
4. Register the four bundle / package IDs above

### Day 2–3 (native shells)
1. Mac: follow `moment/native/README.md` → TestFlight MOMENT
2. Mac: same pattern for QuitCurve repo → TestFlight QuitCurve
3. Android Studio builds → Play internal tracks

### Day 3–4 (listing)
1. Screenshots (6.7" + 6.5") for each app
2. Paste draft copy from each `APP_STORE.md`
3. Privacy labels + age questionnaires

### Day 5 (submit)
1. Submit both for review (stagger by a day if you want calmer review)
2. Keep PWA live as fallback while review runs

## What’s already green

- Both apps: privacy / terms / support / account deletion
- QuitCurve: 18+ onboarding gate, PNG PWA icons, live domain
- MOMENT: PNG icons, 18+ Welcome gate, delete Moments, cloud sync

## What’s still on you (can’t be done from cloud agent alone)

- Pay / accept Apple + Google developer agreements
- Run Xcode on a Mac for signing + TestFlight upload
- Capture marketing screenshots
- Answer age-rating questionnaires honestly
