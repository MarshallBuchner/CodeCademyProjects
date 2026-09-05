# Dual-app store sprint — MOMENT + QuitCurve

**Goal:** get **MOMENT** and **QuitCurve** onto App Store + Play. **POWR after.**

## Parallel tracks

| Track | Owner | Notes |
|-------|--------|------|
| A. Apple Developer + Play Console | Marshall | Apple enrolled; Play paused (need Android device) |
| B. Capacitor shells | Marshall + agent | **Blocked on M1+ Mac** for iOS archive |
| C. Listing assets | Marshall | Paste `APP_STORE.md` now; screenshots after Mac |
| D. Product polish | Agent | Icons, age gates, legal, ASC paste packet |

## Bundle IDs

| App | iOS | Android |
|-----|-----|---------|
| QuitCurve | `app.quitcurve.ios` | `app.quitcurve.android` |
| MOMENT | `app.moment.ios` ✅ | `app.moment.android` |

## Prep now (Mac in transit)

1. App Store Connect → **MOMENT Capsules**: paste listing / privacy / age from `moment/APP_STORE.md`  
2. Register QuitCurve App ID `app.quitcurve.ios` + create ASC app (mirror MOMENT)  
3. Optional: custom domain for MOMENT  

## After M1+ Mac arrives

1. `moment/native/README.md` → signing → Archive → TestFlight  
2. Same Capacitor pattern for QuitCurve  
3. Screenshots (6.7" + 6.5")  
4. Submit for review; keep PWAs live  

## What’s already green

- Both apps: privacy / terms / support / account deletion  
- QuitCurve: 18+ gate, PWA icons, live domain  
- MOMENT: PNG icons, 18+ Welcome, delete Moments, cloud sync, ASC app record, reviewer demo unlock  

## What’s still on you

- Sign into App Store Connect and paste the packet in `APP_STORE.md`  
- Set up new Mac → Xcode → TestFlight  
- Screenshots  
- Play Console after a cheap Android device  
