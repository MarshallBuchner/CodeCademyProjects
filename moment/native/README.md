# MOMENT Capacitor shell

Thin native wrapper that loads the **production web app**.  
Build iOS on a **Mac** with Xcode. Android can build on Mac or Linux with Android Studio.

## Production URL

Default: `https://moment-opal.vercel.app`  
Override with `MOMENT_SERVER_URL` when running Capacitor CLI if needed.

## One-time setup (Mac)

```bash
cd moment/native
npm install
npx cap add ios
npx cap add android   # optional; set applicationId to app.moment.android
npx cap sync
```

`capacitor.config.ts` uses `appId: "app.moment.ios"` (matches App Store Connect).  
After `cap add android`, change Android `applicationId` / namespace to **`app.moment.android`**.

### iOS
1. `npx cap open ios`
2. In Xcode → Signing & Capabilities → your Team
3. Bundle ID: `app.moment.ios`
4. Display name: MOMENT
5. Add usage descriptions — see **`Info.plist.snippets.md`**
6. Product → Archive → Distribute → TestFlight

### Android
1. `npx cap open android`
2. `applicationId` → `app.moment.android`
3. Permissions in manifest: `ACCESS_FINE_LOCATION`, `CAMERA`, `RECORD_AUDIO`, `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`
4. Build signed bundle → Play internal testing

## Sync after web deploys

The shell loads the live site — most web deploys need **no new store build**.  
Re-run `npx cap sync` only when changing native config, icons, or splash.

## Icons & splash

Source assets in `native/assets/`:
- `icon.png` — 1024×1024 RGB
- `splash.png` — 2732×2732 RGB (`#050608` background)

```bash
npm run assets
```

Or:

```bash
npx @capacitor/assets generate --iconBackgroundColor '#050608' --iconBackgroundColorDark '#050608' --splashBackgroundColor '#050608' --splashBackgroundColorDark '#050608'
```

Also available under `../public/icons/` for the PWA.
