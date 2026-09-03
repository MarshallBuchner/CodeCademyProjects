# MOMENT

**Leave something behind. Unlock it when you return.**

Location-locked digital time capsules — drop a voice, photo, or note at a real place, then unlock it only when you come back.

## Verdict (idea eval)

Strong concept. Clear emotional hook, viral share mechanic (distance → unlock), and a sharper MVP than a public audio feed. Brand **MOMENT** + CTA **Leave it here** is the right combo from your ChatGPT naming pass.

## MVP in this folder

Interactive prototype matching your Drop → Return → Unlock flow:

| Screen | What it does |
|--------|----------------|
| Welcome | Brand, tagline, Get Started / demo seed |
| Home | Your Moments list + drop CTA |
| Choose place | Pin presets / current GPS |
| Record | Title, note, voice (MediaRecorder), photo |
| Leave it here | Location lock + optional time lock |
| Locked | Distance to unlock + path map |
| Unlocked | Note / audio / photo reveal |

- **Guest mode** via `localStorage` (no backend required)
- **Geofence unlock** (~80m) using the browser Geolocation API
- **Simulate arrival** button for desktop / demo testing
- Dark + amber design system from the mockups

## Run locally

```bash
cd moment
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Allow location when prompted. On desktop, use **Simulate arrival** or **Load demo Moments**.

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript

## Next (post-MVP)

- Real map tiles (Mapbox dark style)
- Shared / collaborative capsules
- Auth + cloud sync (Supabase)
- Push when a shared Moment is nearby
- One-time “event capsule” purchases from your monetization notes

## Positioning notes from your screenshots

- Prefer **MOMENT** over HERE / DROP / RETRACE for brand weight
- Mechanic CTA: **Leave it here**
- Private or shared — not a public social audio feed (vs “Echoes”)
- Optional QuitCurve crossover later: milestone-locked “Reasons” messages
