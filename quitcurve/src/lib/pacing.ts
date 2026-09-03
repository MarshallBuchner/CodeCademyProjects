import { getTodayTargetPct } from "./curve";
import type { DayPacing, Frequency, PuffLog, UserPlan } from "./types";

/** Estimated daily puffs at 100% baseline, by usage frequency. */
export const BASELINE_PUFFS: Record<Frequency, number> = {
  occasionally: 45,
  regularly: 100,
  constantly: 180,
};

const WAKE_HOUR = 7;
const SLEEP_HOUR = 23;

function wakingMinutesTotal(): number {
  return (SLEEP_HOUR - WAKE_HOUR) * 60;
}

function minutesIntoWakingDay(now = new Date()): number {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const wake = WAKE_HOUR * 60;
  const sleep = SLEEP_HOUR * 60;
  if (minutes <= wake) return 0;
  if (minutes >= sleep) return wakingMinutesTotal();
  return minutes - wake;
}

function elapsedFraction(now = new Date()): number {
  return Math.min(1, Math.max(0, minutesIntoWakingDay(now) / wakingMinutesTotal()));
}

function isToday(iso: string, now = new Date()): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function getBaselinePuffs(plan: UserPlan): number {
  return BASELINE_PUFFS[plan.frequency];
}

export function getTodayPuffTarget(plan: UserPlan): number {
  const baseline = getBaselinePuffs(plan);
  const targetPct = getTodayTargetPct(plan);
  return Math.max(1, Math.round((baseline * targetPct) / 100));
}

export function countTodayPuffs(puffs: PuffLog[], now = new Date()): number {
  return puffs
    .filter((p) => isToday(p.loggedAt, now))
    .reduce((sum, p) => sum + p.count, 0);
}

function buildHourlyCumulative(
  puffs: PuffLog[],
  now = new Date(),
): number[] {
  const hours = Array.from({ length: 24 }, () => 0);
  for (const puff of puffs) {
    if (!isToday(puff.loggedAt, now)) continue;
    const h = new Date(puff.loggedAt).getHours();
    hours[h] += puff.count;
  }
  const cumulative: number[] = [];
  let running = 0;
  for (let h = 0; h < 24; h++) {
    running += hours[h];
    cumulative.push(running);
  }
  return cumulative;
}

function buildHourlyBaseline(baselinePuffs: number): number[] {
  const wake = WAKE_HOUR;
  const sleep = SLEEP_HOUR;
  const span = sleep - wake;
  return Array.from({ length: 24 }, (_, h) => {
    if (h < wake) return 0;
    if (h >= sleep) return baselinePuffs;
    const progress = (h - wake + 1) / span;
    return Math.round(baselinePuffs * progress);
  });
}

export function computeDayPacing(
  plan: UserPlan,
  puffs: PuffLog[],
  now = new Date(),
): DayPacing {
  const baselinePuffs = getBaselinePuffs(plan);
  const todayTarget = getTodayPuffTarget(plan);
  const used = countTodayPuffs(puffs, now);
  const remaining = Math.max(0, todayTarget - used);
  const budgetUsedPct =
    todayTarget === 0 ? 0 : Math.min(100, Math.round((used / todayTarget) * 100));

  const fraction = elapsedFraction(now);
  const expectedUsed = todayTarget * fraction;
  const onPace = used <= expectedUsed * 1.12 + 1;

  const baselineExpected = Math.max(1, baselinePuffs * fraction);
  const vsBaselinePct = Math.round((1 - used / baselineExpected) * 100);

  let waitMinutes: number | null = null;
  let nextWindowLabel = "Budget reached";

  if (remaining > 0) {
    const minutesLeft = Math.max(
      1,
      wakingMinutesTotal() - minutesIntoWakingDay(now),
    );
    waitMinutes = Math.max(5, Math.round(minutesLeft / remaining));
    const next = new Date(now.getTime() + waitMinutes * 60_000);
    nextWindowLabel = next.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } else {
    waitMinutes = null;
    nextWindowLabel = "Hold for today";
  }

  return {
    baselinePuffs,
    todayTarget,
    used,
    remaining,
    budgetUsedPct,
    onPace,
    vsBaselinePct,
    nextWindowLabel,
    waitMinutes,
    hourlyCumulative: buildHourlyCumulative(puffs, now),
    hourlyBaseline: buildHourlyBaseline(baselinePuffs),
  };
}
