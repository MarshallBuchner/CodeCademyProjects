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
npx cap add android
npx cap sync
```

### iOS
1. `npx cap open ios`
2. In Xcode → Signing & Capabilities → your Team
3. Bundle ID: `app.moment.ios`
4. Display name: MOMENT
5. Add usage descriptions (Info.plist):
   - **Location When In Use** — “MOMENT uses your location to unlock Moments at the place they were left.”
   - **Camera** — “MOMENT uses the camera to capture photos and video for Moments.”
   - **Microphone** — “MOMENT uses the microphone for voice notes.”
   - **Photo Library** — “MOMENT lets you attach photos and videos from your library.”
6. Product → Archive → Distribute → TestFlight

### Android
1. `npx cap open android`
2. `applicationId` → `app.moment.android`
3. Permissions in manifest: `ACCESS_FINE_LOCATION`, `CAMERA`, `RECORD_AUDIO`, `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`
4. Build signed bundle → Play internal testing

## Sync after web deploys

The shell loads the live site — most web deploys need **no new store build**.  
Re-run `npx cap sync` only when changing native config, icons, or splash.

## Icons

Copy from `../public/icons/`:
- `moment-1024.png` → App Store icon
- `moment-180.png` / `moment-192.png` / `moment-512.png` → adaptive / PWA

```bash
npx @capacitor/assets generate --iconBackgroundColor '#050608' --iconBackgroundColorDark '#050608'
```
(after placing source icon in `native/assets/icon.png`)
