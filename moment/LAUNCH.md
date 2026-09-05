# Dual-app store sprint — MOMENT + QuitCurve

**Goal:** get **MOMENT** and **QuitCurve** onto App Store + Play. **POWR after.**

## Parallel tracks

| Track | Owner | Notes |
|-------|--------|------|
| A. Apple Developer + Play Console | Marshall | Apple enrolled; Play paused (need Android device) |
| B. Capacitor shells | Marshall + agent | **Blocked on M1+ Mac** for iOS archive |
| C. Listing assets | Marshall | ASC text now; screenshots after Mac/Simulator |
| D. Product polish | Agent | Icons, age gates, legal (mostly done) |

## Bundle IDs (register in Apple / Play)

| App | iOS | Android |
|-----|-----|---------|
| QuitCurve | `app.quitcurve.ios` | `app.quitcurve.android` |
| MOMENT | `app.moment.ios` ✅ registered | `app.moment.android` |

## Prep now (no new Mac)

1. App Store Connect → **MOMENT Capsules**: paste listing from `APP_STORE.md`, Privacy URL, category, Free pricing, age rating, privacy labels  
2. Register QuitCurve App ID `app.quitcurve.ios` + create ASC app record  
3. Optional: custom domain for MOMENT  

## After M1+ Mac arrives

1. Follow `moment/native/README.md` → signing → Archive → TestFlight  
2. Same Capacitor pattern for QuitCurve  
3. Screenshots (6.7" + 6.5")  
4. Submit for review (stagger if you want calmer review)  
5. Keep PWAs live as fallback  

## What’s already green

- Both apps: privacy / terms / support / account deletion  
- QuitCurve: 18+ onboarding gate, PNG PWA icons, live domain  
- MOMENT: PNG icons, 18+ Welcome gate, delete Moments, cloud sync, ASC app record  

## What’s still on you

- Sign into App Store Connect to finish listing / privacy / age (agent cannot without your Apple ID session)  
- Buy / borrow **M1+ Mac** for Xcode + TestFlight  
- Capture marketing screenshots  
- Play Console after a cheap Android device  
