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

## Blockers for App Store (need Marshall)

- [ ] Apple Developer Program ($99/yr) — enroll or confirm access
- [ ] Google Play Console ($25 one-time)
- [ ] App Store Connect record + bundle ID: **`app.moment.ios`**
- [ ] Play package name: **`app.moment.android`**
- [ ] Capacitor iOS build on a Mac → TestFlight (see `native/README.md`)
- [ ] Capacitor Android build → Play internal testing
- [ ] Screenshots: 6.7" + 6.5" iPhone (from device or Simulator)
- [ ] Age rating questionnaire (expect **12+** or **17+** for UGC + location)
- [ ] App Privacy labels (email, location, photos/video, analytics)
- [ ] Custom domain for store URLs (optional but nicer than `*.vercel.app`)

## Capacitor path (chosen)

Remote WebView → production URL. Do **not** rewrite in Expo.

```
moment/native/   → Capacitor shell
server.url       → https://moment-opal.vercel.app
```

## Draft App Store listing

**Name:** MOMENT  
**Subtitle:** Leave something behind. Unlock it when you return.  
**Category:** Lifestyle (secondary: Social Networking)  
**Age:** 12+ or 17+ (confirm with ASC questionnaire)

**Description (draft):**  
MOMENT lets you leave photos, video, voice, and notes locked to a real place—then unlock them when you return. Start annual traditions, share private Moments with people you choose, and keep a map of the places that matter. Private by design. Not a public feed.

**Keywords (draft):** time capsule, location lock, memories, geofence, tradition, private share, anniversary  

**Support URL:** https://moment-opal.vercel.app/support  
**Privacy URL:** https://moment-opal.vercel.app/privacy  
**Marketing URL:** https://moment-opal.vercel.app  

## Privacy nutrition label — map from product

| Data type | Linked to identity? | Used for tracking? | Notes |
|-----------|---------------------|--------------------|-------|
| Email | Yes | No | Magic-link auth |
| Location | Yes | No | Unlock geofence (on-device + stored drop coords) |
| Photos / Video | Yes | No | User Moment media |
| Product interaction | No | No | Vercel Analytics (aggregate) |

## Suggested order this week

1. Enroll Apple Developer + Play Console  
2. Finish Capacitor shell on Mac → TestFlight  
3. Screenshots + listing copy  
4. Submit MOMENT + QuitCurve (parallel)  
5. POWR after both are in review / live  

See also: QuitCurve `APP_STORE.md` in the quitcurve repo.
