# Launch checklist — all 3 apps

Goal: QuitCurve, MOMENT, and POWR live on **App Store** and **Google Play**, then ads.

## 0. Blockers (do first)

- [ ] Apple Developer Program enrolled (can take 24–48h for new orgs)
- [ ] Google Play Console created
- [ ] MOMENT deployed on Vercel (`Root Directory = moment`) and URL pasted into `apps/moment/capacitor.config.ts`
- [ ] POWR privacy page live (e.g. `https://powr-mvp.vercel.app/privacy`)
- [ ] Support email that you monitor (App Store + Play require it)

## 1. Per-app store listing copy

### QuitCurve
- **Subtitle:** Personalized vape quit coach
- **Category:** Health & Fitness
- **Keywords:** quit vaping, nicotine, taper, craving, quit smoking
- **Privacy:** https://www.quitcurve.app/privacy
- **Disclaimer in description:** Not medical advice. Consult a clinician for nicotine dependence.

### MOMENT
- **Subtitle:** Leave it here. Unlock when you return.
- **Category:** Lifestyle / Social Networking
- **Keywords:** time capsule, geofence, memories, location notes
- **Privacy:** `https://<your-moment-host>/privacy`
- **Permission copy:** Location used only to pin/unlock Moments.

### POWR
- **Subtitle:** AI hockey development
- **Category:** Sports / Health & Fitness
- **Keywords:** hockey, skating, AI coach, video analysis, drills
- **Privacy:** `https://powr-mvp.vercel.app/privacy` (add if missing)
- **Claim care:** Avoid “guarantees performance”; use “insights / suggestions.”

## 2. Build & submit (each app)

### Android (any OS with Android Studio)
```bash
cd store-apps/apps/quitcurve   # then moment, powr
npx cap sync android
npx cap open android
```
- Generate a signed release AAB (Play requires AAB).
- Create Play app → Internal testing → Production.

### iOS (Mac + Xcode required)
```bash
cd store-apps/apps/quitcurve
npx cap sync ios
npx cap open ios
```
- Set Team, unique Bundle ID, icons, version `1.0.0`.
- Archive → Upload → App Store Connect → TestFlight → Submit for Review.

## 3. Review risk (fix rejection)

| App | Risk | Mitigation |
|-----|------|------------|
| QuitCurve | Health claims | Medical disclaimer + no “cure” language |
| MOMENT | Location / thin wrapper | Accurate location purpose string; real splash + native plugins |
| POWR | AI / youth sports | Honest beta framing; COPPA/age rating if under-13 |

Apple **4.2** (minimum functionality): these shells include native splash, status bar, network, share, and permission plugins. Still ship a polished first-run in the web app.

## 4. After “Ready for Sale” / Published

- [ ] Store URLs saved
- [ ] App Store Connect / Play analytics on
- [ ] Deep links / product page for ads
- [ ] Start Meta + Google **App** campaigns (not only web traffic)
- [ ] One monetization path live (IAP, subscription, or lead → paid coaching)

## Suggested ship order (revenue)

1. **QuitCurve** — live domain + privacy already done  
2. **POWR** — live MVP URL known (`powr-mvp.vercel.app`)  
3. **MOMENT** — right after Vercel deploy + privacy URL
