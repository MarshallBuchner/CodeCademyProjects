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

## Apple / store accounts

- [x] Apple Developer Program enrolled (Enrolment Complete)
- [x] App ID registered: **`app.moment.ios`**
- [x] App Store Connect app: **MOMENT Capsules** (Prepare for Submission)
- [ ] ASC listing fields (description, keywords, URLs, category) — fill while signed in
- [ ] Age rating questionnaire
- [ ] App Privacy nutrition labels
- [ ] Pricing: Free + availability
- [ ] Screenshots: 6.7" + 6.5" iPhone (needs device or Simulator on Mac)
- [ ] Capacitor iOS build → TestFlight (needs M1+ Mac + current Xcode)
- [ ] Google Play Console — paused until Android device
- [ ] Play package: **`app.moment.android`**
- [ ] Custom domain for store URLs (optional)

## Mac for TestFlight (hardware)

Current MacBook Air **2017 / Monterey** cannot run modern Xcode. Need **Apple Silicon (M1+)**.

**Buy guidance (CAD, Windsor area):**
- Target: used/refurb **M1 MacBook Air**, prefer **256GB+** (512 ideal), **16GB RAM** if budget allows
- Under ~$500: verified **M1 Air 8GB / 512GB** is acceptable to ship (close apps while building)
- Skip **Intel** Airs (2019–2020) even when cheap — same Xcode dead-end as the 2017
- MacBook Pro is optional; not required for Capacitor shells

Until then: finish all ASC text/privacy/age prep; keep PWA live.

## Capacitor path (chosen)

Remote WebView → production URL. Do **not** rewrite in Expo.

```
moment/native/   → Capacitor shell
server.url       → https://moment-opal.vercel.app
```

## Draft App Store listing

**Name:** MOMENT Capsules *(store name; “MOMENT” alone was taken)*  
**Subtitle:** Leave something. Unlock on return. *(≤30 chars)*  
**Category:** Lifestyle (secondary: Social Networking)  
**Age:** complete ASC questionnaire (UGC + location → likely 12+ or 17+)

**Description:**  
MOMENT lets you leave photos, video, voice, and notes locked to a real place—then unlock them when you return. Start annual traditions, share private Moments with people you choose, and keep a map of the places that matter. Private by design. Not a public feed.

**Keywords:** time capsule,location lock,memories,geofence,tradition,private share,anniversary  

**Support URL:** https://moment-opal.vercel.app/support  
**Privacy URL:** https://moment-opal.vercel.app/privacy  
**Marketing URL:** https://moment-opal.vercel.app  
**Copyright:** 2026 Marshall Buchner

## Privacy nutrition label — map from product

| Data type | Linked to identity? | Used for tracking? | Notes |
|-----------|---------------------|--------------------|-------|
| Email | Yes | No | Magic-link auth |
| Location | Yes | No | Unlock geofence (on-device + stored drop coords) |
| Photos / Video | Yes | No | User Moment media |
| Product interaction | No | No | Vercel Analytics (aggregate) |

## Suggested order

1. Fill ASC listing + privacy + age (no Mac required) — sign in on appstoreconnect.apple.com  
2. Get M1+ Mac → `moment/native` → TestFlight (see `native/README.md`)  
3. Screenshots from Simulator or device  
4. Submit MOMENT; parallel QuitCurve ASC record  
5. POWR after both are in review / live  

See also: QuitCurve `APP_STORE.md` in the quitcurve repo.
