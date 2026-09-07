import type { Frequency, Pace, PlanStats, UserPlan } from "./types";

const PACE_WEEKS: Record<Pace, number> = {
  "4-week": 4,
  "8-week": 8,
  "12-week": 12,
};

const FREQUENCY_BASELINE: Record<Frequency, number> = {
  occasionally: 35,
  regularly: 60,
  constantly: 85,
};

function daysSince(isoDate: string): number {
  const start = new Date(isoDate);
  const now = new Date();
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Weekly nicotine index as % of baseline (100 = day 0, lower = less nicotine). */
export function generateWeeklyCurve(plan: UserPlan): number[] {
  const weeks = PACE_WEEKS[plan.pace];
  const slipPenalty = Math.min(plan.slipCount * 0.03, 0.12);

  return Array.from({ length: weeks }, (_, week) => {
    const progress = week / Math.max(weeks - 1, 1);
    const eased = easeOutCubic(progress);
    const target = 1 - eased * (0.92 - slipPenalty);
    return Math.round(Math.max(0.08, target) * 100);
  });
}

export function getCurrentWeek(plan: UserPlan): number {
  const day = daysSince(plan.startDate);
  const week = Math.floor(day / 7) + 1;
  return Math.min(week, PACE_WEEKS[plan.pace]);
}

export function getCurrentDay(plan: UserPlan): number {
  return daysSince(plan.startDate) + 1;
}

export function getNicotineReductionPct(plan: UserPlan): number {
  const curve = generateWeeklyCurve(plan);
  const week = getCurrentWeek(plan) - 1;
  const currentIndex = curve[week] ?? curve[curve.length - 1];
  return Math.round(100 - currentIndex);
}

export function getTodayTargetPct(plan: UserPlan): number {
  const curve = generateWeeklyCurve(plan);
  const week = getCurrentWeek(plan) - 1;
  const dayInWeek = daysSince(plan.startDate) % 7;
  const weekStart = curve[week] ?? 100;
  const weekEnd = curve[Math.min(week + 1, curve.length - 1)] ?? weekStart;
  const dayProgress = dayInWeek / 7;
  return Math.round(weekStart - (weekStart - weekEnd) * dayProgress);
}

export function getMoneySaved(plan: UserPlan, reductionPct: number): number {
  const days = daysSince(plan.startDate) + 1;
  const dailySpend = plan.weeklySpend / 7;
  const avgReduction = reductionPct / 100;
  return Math.round(dailySpend * days * avgReduction);
}

export function getNextMilestoneDay(plan: UserPlan): number {
  const day = getCurrentDay(plan);
  const milestones = [7, 14, 21, 28, 42, 56, 84, 90];
  return milestones.find((m) => m > day) ?? day + 7;
}

export function getPlanStatus(
  plan: UserPlan,
  cravingsManaged: number,
): PlanStats["status"] {
  const day = getCurrentDay(plan);
  const expectedReduction = getNicotineReductionPct(plan);
  const baseline = FREQUENCY_BASELINE[plan.frequency];

  if (plan.slipCount > 0 && plan.slipCount >= Math.floor(day / 5)) {
    return "adapting";
  }
  if (cravingsManaged > day * 0.5 && expectedReduction > baseline * 0.01) {
    return "ahead";
  }
  return "on_track";
}

export function computePlanStats(
  plan: UserPlan,
  cravingsManaged: number,
): PlanStats {
  const nicotineReductionPct = getNicotineReductionPct(plan);
  const curvePoints = generateWeeklyCurve(plan);
  const totalWeeks = PACE_WEEKS[plan.pace];

  return {
    nicotineReductionPct,
    moneySaved: getMoneySaved(plan, nicotineReductionPct),
    cravingsManaged,
    currentWeek: getCurrentWeek(plan),
    totalWeeks,
    currentDay: getCurrentDay(plan),
    nextMilestoneDay: getNextMilestoneDay(plan),
    status: getPlanStatus(plan, cravingsManaged),
    curvePoints,
    todayTargetPct: getTodayTargetPct(plan),
  };
}

export function getPaceLabel(pace: Pace): string {
  const labels: Record<Pace, string> = {
    "4-week": "4-week steady plan",
    "8-week": "8-week steady plan",
    "12-week": "12-week gentle plan",
  };
  return labels[pace];
}

export const STATUS_LABELS: Record<PlanStats["status"], string> = {
  on_track: "On track",
  adapting: "Adapting",
  ahead: "Ahead of plan",
};
