# MOMENT — App Store / Play Store race checklist

MOMENT is live as a **web PWA** at [moment-opal.vercel.app](https://moment-opal.vercel.app).  
App Store / Play submission needs a **Capacitor native shell** + developer accounts. POWR waits until after MOMENT + QuitCurve.

## Already live (web)

- [x] Drop / lock / unlock, maps, share links, traditions
- [x] Magic-link auth (Supabase) + guest mode + cross-device sync
- [x] Privacy (`/privacy`), Terms (`/terms`), Support (`/support`)
- [x] In-app account deletion (`/account`)
- [x] Delete Moments (⋯ menu)
- [x] Vercel Analytics
- [x] PWA manifest + PNG home-screen icons (180 / 192 / 512 / 1024)
- [x] 18+ gate on Welcome
- [x] Demo Moments + **Simulate arrival (demo)** for reviewers

## Apple / store accounts

- [x] Apple Developer Program enrolled
- [x] App ID registered: **`app.moment.ios`**
- [x] App Store Connect app: **MOMENT Capsules** (Prepare for Submission)
- [ ] ASC listing fields — paste from **Paste packet** below (while signed in)
- [ ] Age rating questionnaire — use suggested answers below
- [ ] App Privacy nutrition labels — use table below
- [ ] Pricing: Free + availability
- [ ] Screenshots: 6.7" + 6.5" iPhone (needs Mac Simulator or device)
- [ ] Capacitor iOS → TestFlight (needs M1+ Mac — see `native/README.md`)
- [ ] Google Play — paused until Android device
- [ ] Play package: **`app.moment.android`**
- [ ] Custom domain (optional)

## Mac for TestFlight

Need **Apple Silicon (M1+)**. 2017 Air cannot run current Xcode.  
Under ~$500: verified M1 Air 8GB / 256–512GB is enough to ship. Prefer 512GB. Skip Intel.

---

## Paste packet — App Store Connect

Copy/paste into ASC. Character limits noted.

### App Information

| Field | Value |
|-------|--------|
| Name | MOMENT Capsules |
| Subtitle (≤30) | `Leave it. Return. Unlock.` |
| Primary category | Lifestyle |
| Secondary | Social Networking |
| Privacy Policy URL | https://moment-opal.vercel.app/privacy |
| Copyright | 2026 Marshall Buchner |

**Subtitle alternatives (≤30):** `Place-locked memories` · `Private place capsules`

### Version 1.0 — listing

**Promotional text (≤170):**  
Leave photos, voice, and notes locked to a real place—then unlock them when you return. Private traditions, not a public feed.

**Description:**  
MOMENT lets you leave photos, video, voice, and notes locked to a real place—then unlock them when you return. Start annual traditions, share private Moments with people you choose, and keep a map of the places that matter.

Private by design. Not a public feed.

Features:
• Drop a Moment at a place that matters  
• Unlock only when you return (location check)  
• Photos, video, voice notes, and text  
• Private share links for people you choose  
• Guest mode or optional magic-link sync  
• Annual traditions on your map  

**Keywords (≤100 chars, commas, no spaces after commas):**  
`time capsule,location lock,memories,geofence,tradition,private share,anniversary`

**Support URL:** https://moment-opal.vercel.app/support  
**Marketing URL:** https://moment-opal.vercel.app  
**What's New (1.0):** Initial release — leave Moments at a place, unlock when you return, private shares, and traditions.

### Pricing

Free. No IAP for v1. Available in all territories (or default).

### Export compliance

Uses standard HTTPS only. In Xcode / ASC: **ITSAppUsesNonExemptEncryption = NO** (exempt).

---

## App Review notes (paste into ASC)

```
MOMENT is a private location-locked memory app (not a public social feed). No IAP.

How to review without traveling to a pin:
1. Open the app → check “I confirm I’m 18+…” → Continue
2. Tap “Load demo Moments”
3. Open any Moment → tap “Simulate arrival (demo)” to unlock

Optional signed-in path: request a magic link to your review email; open the link in the app/WebView. Account deletion: Account settings (/account).

Location: used only to unlock Moments near the drop pin (and for map UX). Camera / mic / photos: only when the user attaches Moment media.

Contact: marshallbuchner96@gmail.com
```

---

## Age rating — suggested questionnaire answers

Honest answers for ASC. In-app gate + Terms are **18+**; if ASC computes lower, **override to 17+ or 18+** to match.

| Topic | Suggested |
|-------|-----------|
| Cartoon / fantasy violence | None |
| Realistic violence | None |
| Sexual content / nudity | None |
| Profanity | None |
| Alcohol / tobacco / drugs | None |
| Simulated gambling | None |
| Horror / fear | None |
| Mature / suggestive themes | None |
| Medical / treatment info | None |
| Unrestricted web access | No |
| Gambling / contests | No |
| Advertisements | No |
| User-generated content | Yes — private Moments (photo/video/audio/text); sharable only with people the user chooses (secret link), not a public feed |
| Messaging / chat | Infrequent — private share via link/email, not open chat rooms |
| Location sharing (live to others) | No — drop coordinates stored for unlock; not live tracking of other users |
| Age assurance | In-app 18+ self-declaration checkbox on Welcome |

---

## Privacy Nutrition Label — ASC answers

Not used for tracking. Not sold. Not used for third-party advertising.

| Data type | Collect? | Linked to identity? | Tracking? | Purpose |
|-----------|----------|---------------------|-----------|---------|
| Email Address | Yes | Yes | No | App Functionality (magic-link auth) |
| Precise Location | Yes | Yes | No | App Functionality (geofence unlock; drop coords stored with Moment) |
| Photos or Videos | Yes | Yes | No | App Functionality (Moment media) |
| Audio Data | Yes | Yes | No | App Functionality (voice notes) |
| Product Interaction | Yes | No | No | Analytics (Vercel Analytics, aggregate) |
| Name (share recipient) | Optional | Yes | No | App Functionality (private shares) |

---

## Capacitor path

```
moment/native/   → Capacitor shell
server.url       → https://moment-opal.vercel.app
iOS bundle ID    → app.moment.ios
Android appId    → app.moment.android (set after `npx cap add android`)
```

See `native/README.md` and `native/Info.plist.snippets.md`.

## Ops before submit

- [ ] Vercel has `SUPABASE_SERVICE_ROLE_KEY` (account delete)
- [ ] Magic-link template uses `token_hash`; Site URL + redirect OK
- [ ] Resend SMTP sending for reviewers who sign in

## Suggested order

1. Paste ASC listing + privacy + age (phone/laptop — no new Mac)  
2. M1 Mac arrives → `moment/native` → TestFlight  
3. Screenshots from Simulator  
4. Submit; parallel QuitCurve ASC record  
5. POWR after both are in review / live  

See also: QuitCurve `APP_STORE.md` in the quitcurve repo.
