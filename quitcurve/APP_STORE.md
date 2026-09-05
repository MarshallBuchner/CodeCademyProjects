# QuitCurve — App Store race checklist

QuitCurve is live today as a **web PWA** at [www.quitcurve.app](https://www.quitcurve.app).  
Apple App Store submission needs a **native shell** + Apple Developer account work. This doc tracks both tracks.

## Already live (web)

- [x] Landing, onboarding, dashboard, craving + puff pacing
- [x] Magic-link auth (Supabase) + guest mode
- [x] Optional email/SMS reminders
- [x] Privacy Policy (`/privacy`), Terms (`/terms`), Support (`/support`)
- [x] In-app account deletion (`/account`)
- [x] Adult / medical disclaimer gate in onboarding
- [x] PWA manifest + Big Q home-screen icons
- [x] OG image, sitemap, robots

## Blockers for App Store (need Marshall)

- [ ] Apple Developer Program enrollment ($99/yr)
- [ ] App Store Connect app record + bundle ID (e.g. `app.quitcurve.ios`)
- [ ] Decide wrapper: **Capacitor** (fastest for this Next app) vs Expo rebuild
- [ ] Signing certificates + TestFlight build
- [ ] Working inboxes: `hello@quitcurve.app`, `privacy@quitcurve.app`
- [ ] Age rating questionnaire (expect **17+** for nicotine content)
- [ ] App Privacy “nutrition labels” (email, optional phone, health-ish usage, analytics)
- [ ] Screenshots: 6.7" and 6.5" iPhone (and iPad if supporting)
- [ ] Free vs paid / IAP decision (free for v1 is simplest)

## Code / product still valuable before ASC

- [ ] Capacitor scaffold (`ios/` project, splash, icons) — unsigned
- [ ] Push notifications (APNs) — only after native shell
- [ ] Offline service worker for stronger PWA
- [ ] Data export (JSON download of plan / logs)
- [ ] Unit tests for curve + pacing engines

## Draft App Store listing (edit freely)

**Name:** QuitCurve  
**Subtitle:** Quit vaping. Keep your momentum.  
**Category:** Health & Fitness (secondary: Lifestyle)  
**Age:** 17+  

**Description (draft):**  
QuitCurve builds a personalized nicotine step-down curve from how you actually vape—then helps you stay on pace with daily puff budgets, craving logs, and check-ins. Slip-ups adapt the curve instead of resetting your progress. Optional daily reminders keep you honest. Not medical advice.

**Keywords (draft):** quit vaping, stop vaping, nicotine, taper, craving tracker, quit coach, puff counter  

**Support URL:** https://www.quitcurve.app/support  
**Privacy URL:** https://www.quitcurve.app/privacy  
**Marketing URL:** https://www.quitcurve.app  

## Privacy nutrition label — map from product

| Data type | Linked to identity? | Used for tracking? | Notes |
|-----------|---------------------|--------------------|-------|
| Email | Yes | No | Auth + optional reminders |
| Name | Yes | No | Profile |
| Phone (optional) | Yes | No | Only if SMS reminders enabled |
| Health / wellness | Yes | No | Quit plan, cravings, puffs, check-ins |
| Product interaction | No | No | Vercel Analytics (aggregate) |

## Suggested order this week

1. Confirm `hello@` / `privacy@` mailboxes work  
2. Enroll Apple Developer (or confirm org access)  
3. Ship Capacitor iOS shell + TestFlight  
4. Screenshots + listing copy  
5. Submit for review  

POWR / MOMENT account setup can happen in parallel — it does not block QuitCurve web polish.
