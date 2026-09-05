# Daily puff pacing (QuitCurve taper engine)

Turns the dashboard into a **measurable taper**: today’s puff budget, live used/remaining, pacing status, suggested wait window, and one-tap logging.

## What users see

- **Today’s target** — e.g. `86 puffs` (derived from baseline × today’s curve %)
- **Used / remaining** + ring (% of budget)
- **On pace** vs behind, and **% below/above baseline**
- **Next pacing window** + “try to wait X min”
- **+ Log a puff** / **Log craving**
- **Your curve** — today vs baseline over the day

## How the numbers work

| Input | Source |
|-------|--------|
| Baseline puffs/day | Frequency from onboarding (`occasionally` 45 · `regularly` 100 · `constantly` 180) |
| Today’s target | `baseline × todayTargetPct / 100` from the weekly reduction curve |
| Used | Sum of today’s `puff_logs` |
| On pace | Used ≤ expected-by-time-of-day (7am–11pm waking window) × 1.12 |
| Next window | Spread remaining puffs evenly across remaining waking minutes |

## Files

- `src/lib/pacing.ts` — engine
- `src/components/DayPacingChart.tsx` — day chart
- `src/components/Dashboard.tsx` — UI
- `supabase/puff_logs.sql` — Supabase table
- Storage key `quitcurve-puffs` for guest mode

## Enable cloud sync for puffs

1. Supabase → **SQL Editor** → run `supabase/puff_logs.sql`
2. Redeploy (no new env vars required beyond existing Supabase keys)

Guest mode works without SQL — puffs stay in `localStorage` until sign-in sync.

## Later upgrades (not in this PR)

- Custom baseline from “pods / ml / estimated puffs” intake
- Mid-day push when ahead of pace
- Auto-adjust tomorrow’s target after overshoot (adaptive recovery)
