# Store apps — QuitCurve, MOMENT, POWR

Fastest path to **real App Store + Google Play** listings: Capacitor native shells that load your live web apps, with splash / status bar / network / share / camera / location plugins so review isn’t a bare WebView.

| App | Bundle ID | Live URL |
|-----|-----------|----------|
| **QuitCurve** | `app.quitcurve.mobile` | https://www.quitcurve.app |
| **MOMENT** | `app.moment.leave` | Set after Vercel deploy (replace `https://YOUR-MOMENT.vercel.app`) |
| **POWR** | `app.powr.hockey` | https://powr-mvp.vercel.app |

## What you do next (order)

1. **Accounts** — Apple Developer ($99/yr) + Google Play Console ($25 once), under the same legal entity you’ll sell under.
2. **Deploy MOMENT** to Vercel (root directory `moment`), then set its URL in `apps/moment/capacitor.config.ts` → `server.url`.
3. **Privacy URLs** (required by both stores):
   - QuitCurve: already at `/privacy`
   - MOMENT: `/privacy` added in this PR — live after deploy
   - POWR: add `/privacy` on the POWR MVP (or host a static page) before submit
4. **Icons & screenshots** — replace default Capacitor icons; capture 6.7" + 6.1" iPhone and Play phone screenshots.
5. **On a Mac with Xcode** (iOS) and Android Studio (Play):
   ```bash
   cd store-apps && npm install
   npm run sync:all
   npm run open:ios:quitcurve    # repeat for moment / powr
   npm run open:android:quitcurve
   ```
6. Archive → TestFlight / internal testing → submit. Full checklist: **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)**.

## Why this shape

Your products are Next.js on Vercel. Rebuilding three native apps from scratch is months. These shells ship store binaries in days once accounts + assets are ready, then you run ads against App Store / Play URLs.

## Dev commands

```bash
cd store-apps
npm install
npm run sync:quitcurve   # or sync:moment / sync:powr / sync:all
```

Override the loaded URL for any app:

```bash
STORE_APP_URL=https://your-preview.vercel.app npx cap sync
```

(run inside `apps/<name>`).

## Revenue / ads (after listing live)

1. Get store URLs (or custom product pages).
2. Meta + Google App campaigns → install → paywall / IAP / coaching upsell.
3. Don’t spend hard on ads until each app passes review and has a clear first-session monetization path.
