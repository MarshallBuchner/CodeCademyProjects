import type {
  CravingLog,
  DailyCheckIn,
  UserPlan,
  UserProfile,
} from "./types";

const KEYS = {
  user: "quitcurve-user",
  users: "quitcurve-users",
  plan: "quitcurve-plan",
  cravings: "quitcurve-cravings",
  checkins: "quitcurve-checkins",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentUser(): UserProfile | null {
  return read<UserProfile | null>(KEYS.user, null);
}

export function signUp(email: string, name: string): UserProfile {
  const users = read<UserProfile[]>(KEYS.users, []);
  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (existing) {
    write(KEYS.user, existing);
    return existing;
  }

  const profile: UserProfile = {
    id: crypto.randomUUID(),
    email: email.trim().toLowerCase(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  write(KEYS.users, [...users, profile]);
  write(KEYS.user, profile);
  return profile;
}

export function signIn(email: string): UserProfile | null {
  const users = read<UserProfile[]>(KEYS.users, []);
  const profile = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (profile) write(KEYS.user, profile);
  return profile ?? null;
}

export function signOut(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEYS.user);
}

export function savePlan(plan: UserPlan): void {
  write(KEYS.plan, plan);
}

export function getPlan(): UserPlan | null {
  return read<UserPlan | null>(KEYS.plan, null);
}

export function getCravings(): CravingLog[] {
  return read<CravingLog[]>(KEYS.cravings, []);
}

export function addCraving(
  craving: Omit<CravingLog, "id" | "loggedAt">,
): CravingLog {
  const log: CravingLog = {
    ...craving,
    id: crypto.randomUUID(),
    loggedAt: new Date().toISOString(),
  };
  const cravings = [...getCravings(), log];
  write(KEYS.cravings, cravings);

  if (!craving.managed && craving.intensity >= 4) {
    const plan = getPlan();
    if (plan) {
      savePlan({ ...plan, slipCount: plan.slipCount + 1 });
    }
  }

  return log;
}

export function getCheckIns(): DailyCheckIn[] {
  return read<DailyCheckIn[]>(KEYS.checkins, []);
}

export function getTodayCheckIn(): DailyCheckIn | null {
  const today = new Date().toISOString().slice(0, 10);
  return getCheckIns().find((c) => c.date === today) ?? null;
}

export function saveCheckIn(
  checkIn: Omit<DailyCheckIn, "id" | "date">,
): DailyCheckIn {
  const today = new Date().toISOString().slice(0, 10);
  const existing = getCheckIns().filter((c) => c.date !== today);
  const entry: DailyCheckIn = {
    ...checkIn,
    id: crypto.randomUUID(),
    date: today,
  };
  write(KEYS.checkins, [...existing, entry]);
  return entry;
}

export function getManagedCravingCount(): number {
  return getCravings().filter((c) => c.managed).length;
}
