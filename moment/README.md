# MOMENT

**Leave something behind. Unlock it when you return.**

Location-locked digital time capsules — drop a picture, video, or written message at a real place, then unlock it only when you come back.

## Verdict (idea eval)

Strong concept. Clear emotional hook, viral share mechanic (distance → unlock), and a sharper MVP than a public audio feed. Brand **MOMENT** + CTA **Leave it here** is the right combo from your ChatGPT naming pass.

## MVP in this folder

Interactive prototype matching your Drop → Return → Unlock flow:

| Screen | What it does |
|--------|----------------|
| Welcome | Brand, tagline, Get Started / demo seed |
| Home | Your Moments list + drop CTA |
| Choose place | Pin presets / current GPS |
| Record | Title + picture / video / written message (+ optional voice) |
| Leave it here | Location lock + optional time lock |
| Locked | Distance to unlock + path map |
| Unlocked | Note / audio / photo reveal |

- **Guest mode** via `localStorage` (no backend required)
- **Geofence unlock** (~80m) using the browser Geolocation API
- **Simulate arrival** button for desktop / demo testing
- Dark + amber design system from the mockups

## Make it last forever

MOMENT is a **tradition generator**, not just location-locked messaging.

> Make the moment last forever.

> Come back. Open the past. Leave something for the future.

> Some places become part of your story. MOMENT helps you keep adding to it.

**Annual Moments:** drop with “Return here next year to unlock.” After opening → **Create next year’s MOMENT?** — the tradition loops.

Drop a Moment → **Send to someone**:

1. Enter who it’s for (+ optional PIN you tell them separately)
2. Copy / share the secret link
3. They open `/m/...` → enter PIN if set → Moment stays locked until they’re at the place

Access control for this MVP:
- Unguessable `accessKey` in the link (don’t post publicly)
- Optional PIN for “only them”
- Geofence still required to reveal content
- Capsule payload rides in the URL hash (works cross-device with no backend)

## Launch (GitHub + Vercel)

See **[DEPLOY.md](./DEPLOY.md)** — merge PR → import repo on Vercel with **Root Directory = `moment`**.

Guest mode ships live with no backend. Optional Supabase sync: [SETUP.md](./SETUP.md).

## Run locally

```bash
cd moment
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Allow location when prompted. On desktop, use **Simulate arrival** or **Load demo Moments**.

## Maps

Live dark OpenStreetMap tiles (Leaflet). Pan to pin a place, search via Nominatim, journey line on locked Moments, overview pins on the Map tab. No map API key required.

## Cloud sync

Optional Supabase magic-link sync — see [SETUP.md](./SETUP.md). Without keys, guest/local mode still works.

## Next (post-MVP)

- Wire Supabase Storage for large video uploads
- Push when a shared Moment is nearby
- Collaborative / team Moments
- Custom domain + App Store / Play wrap later
- One-time “event capsule” purchases from your monetization notes

## Positioning notes from your screenshots

- Prefer **MOMENT** over HERE / DROP / RETRACE for brand weight
- Mechanic CTA: **Leave it here**
- Private or shared — not a public social audio feed (vs “Echoes”)
- Optional QuitCurve crossover later: milestone-locked “Reasons” messages
