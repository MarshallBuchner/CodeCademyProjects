export type Device = "disposable" | "pod" | "refillable" | "pouches";
export type Frequency = "occasionally" | "regularly" | "constantly";
export type Pace = "4-week" | "8-week" | "12-week";
export type NicotineStrength =
  | "5%"
  | "3%"
  | "0mg"
  | "6mg-pouch"
  | "12mg-pouch"
  | "unknown";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type UserPlan = {
  device: Device;
  frequency: Frequency;
  nicotineStrength: NicotineStrength;
  weeklySpend: number;
  pace: Pace;
  startDate: string;
  slipCount: number;
};

export type CravingLog = {
  id: string;
  loggedAt: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  trigger?: string;
  managed: boolean;
  note?: string;
};

export type DailyCheckIn = {
  id: string;
  date: string;
  mood: "great" | "okay" | "tough";
  stayedOnPlan: boolean;
  note?: string;
};

/** One logged puff (or multi-count hit) toward today's budget. */
export type PuffLog = {
  id: string;
  loggedAt: string;
  count: number;
};

export type DayPacing = {
  baselinePuffs: number;
  todayTarget: number;
  used: number;
  remaining: number;
  budgetUsedPct: number;
  onPace: boolean;
  vsBaselinePct: number;
  nextWindowLabel: string;
  waitMinutes: number | null;
  /** Cumulative puff counts by hour 0–23 for today's chart. */
  hourlyCumulative: number[];
  /** Expected baseline cumulative by hour (for dashed line). */
  hourlyBaseline: number[];
};

export type PlanStats = {
  nicotineReductionPct: number;
  moneySaved: number;
  cravingsManaged: number;
  currentWeek: number;
  totalWeeks: number;
  currentDay: number;
  nextMilestoneDay: number;
  status: "on_track" | "adapting" | "ahead";
  curvePoints: number[];
  todayTargetPct: number;
};

export type OnboardingData = {
  device: Device | null;
  frequency: Frequency | null;
  nicotineStrength: NicotineStrength | null;
  weeklySpend: number;
  pace: Pace;
};
