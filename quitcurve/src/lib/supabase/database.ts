import { createClient } from "./client";
import type {
  CravingLog,
  DailyCheckIn,
  UserPlan,
  UserProfile,
} from "@/lib/types";

type PlanRow = {
  device: string;
  frequency: string;
  nicotine_strength: string;
  weekly_spend: number;
  pace: string;
  start_date: string;
  slip_count: number;
};

type CravingRow = {
  id: string;
  logged_at: string;
  intensity: number;
  trigger_label: string | null;
  managed: boolean;
  note: string | null;
};

type CheckInRow = {
  id: string;
  checkin_date: string;
  mood: string;
  stayed_on_plan: boolean;
  note: string | null;
};

function toPlan(row: PlanRow): UserPlan {
  return {
    device: row.device as UserPlan["device"],
    frequency: row.frequency as UserPlan["frequency"],
    nicotineStrength: row.nicotine_strength as UserPlan["nicotineStrength"],
    weeklySpend: Number(row.weekly_spend),
    pace: row.pace as UserPlan["pace"],
    startDate: row.start_date,
    slipCount: row.slip_count,
  };
}

function toCraving(row: CravingRow): CravingLog {
  return {
    id: row.id,
    loggedAt: row.logged_at,
    intensity: row.intensity as CravingLog["intensity"],
    trigger: row.trigger_label ?? undefined,
    managed: row.managed,
    note: row.note ?? undefined,
  };
}

function toCheckIn(row: CheckInRow): DailyCheckIn {
  return {
    id: row.id,
    date: row.checkin_date,
    mood: row.mood as DailyCheckIn["mood"],
    stayedOnPlan: row.stayed_on_plan,
    note: row.note ?? undefined,
  };
}

export async function getSessionUser(): Promise<UserProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, name, created_at")
    .eq("id", user.id)
    .single();

  if (profile) {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      createdAt: profile.created_at,
    };
  }

  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.name ?? user.email?.split("@")[0] ?? "User",
    createdAt: user.created_at,
  };
}

export async function sendMagicLink(
  email: string,
  name?: string,
): Promise<{ error?: string }> {
  const supabase = createClient();
  const redirectTo = `${window.location.origin}/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: true,
      emailRedirectTo: redirectTo,
      data: name ? { name: name.trim() } : undefined,
    },
  });

  return { error: error?.message };
}

export async function signOutCloud(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function fetchUserData(userId: string): Promise<{
  plan: UserPlan | null;
  cravings: CravingLog[];
  checkIns: DailyCheckIn[];
}> {
  const supabase = createClient();

  const [planRes, cravingsRes, checkInsRes] = await Promise.all([
    supabase.from("user_plans").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("craving_logs")
      .select("*")
      .eq("user_id", userId)
      .order("logged_at", { ascending: true }),
    supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", userId)
      .order("checkin_date", { ascending: true }),
  ]);

  return {
    plan: planRes.data ? toPlan(planRes.data as PlanRow) : null,
    cravings: (cravingsRes.data ?? []).map((r) => toCraving(r as CravingRow)),
    checkIns: (checkInsRes.data ?? []).map((r) => toCheckIn(r as CheckInRow)),
  };
}

export async function upsertPlan(userId: string, plan: UserPlan): Promise<void> {
  const supabase = createClient();
  await supabase.from("user_plans").upsert({
    user_id: userId,
    device: plan.device,
    frequency: plan.frequency,
    nicotine_strength: plan.nicotineStrength,
    weekly_spend: plan.weeklySpend,
    pace: plan.pace,
    start_date: plan.startDate,
    slip_count: plan.slipCount,
    updated_at: new Date().toISOString(),
  });
}

export async function insertCraving(
  userId: string,
  craving: Omit<CravingLog, "id" | "loggedAt">,
): Promise<CravingLog> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("craving_logs")
    .insert({
      user_id: userId,
      intensity: craving.intensity,
      trigger_label: craving.trigger ?? null,
      managed: craving.managed,
      note: craving.note ?? null,
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to log craving");
  return toCraving(data as CravingRow);
}

export async function upsertCheckIn(
  userId: string,
  checkIn: Omit<DailyCheckIn, "id" | "date">,
): Promise<DailyCheckIn> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("daily_checkins")
    .upsert(
      {
        user_id: userId,
        checkin_date: today,
        mood: checkIn.mood,
        stayed_on_plan: checkIn.stayedOnPlan,
        note: checkIn.note ?? null,
      },
      { onConflict: "user_id,checkin_date" },
    )
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to save check-in");
  return toCheckIn(data as CheckInRow);
}

export async function syncLocalToCloud(
  userId: string,
  local: {
    plan: UserPlan | null;
    cravings: CravingLog[];
    checkIns: DailyCheckIn[];
  },
): Promise<void> {
  const supabase = createClient();
  const remote = await fetchUserData(userId);

  if (local.plan && !remote.plan) {
    await upsertPlan(userId, local.plan);
  }
  if (local.cravings.length > 0 && remote.cravings.length === 0) {
    await supabase.from("craving_logs").insert(
      local.cravings.map((c) => ({
        user_id: userId,
        logged_at: c.loggedAt,
        intensity: c.intensity,
        trigger_label: c.trigger ?? null,
        managed: c.managed,
        note: c.note ?? null,
      })),
    );
  }
  if (local.checkIns.length > 0 && remote.checkIns.length === 0) {
    await supabase.from("daily_checkins").insert(
      local.checkIns.map((c) => ({
        user_id: userId,
        checkin_date: c.date,
        mood: c.mood,
        stayed_on_plan: c.stayedOnPlan,
        note: c.note ?? null,
      })),
    );
  }
}

export async function updatePlanSlipCount(
  userId: string,
  slipCount: number,
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("user_plans")
    .update({ slip_count: slipCount, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
}
