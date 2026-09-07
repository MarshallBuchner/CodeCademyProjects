import { isSupabaseConfigured } from "@/lib/supabase/config";
import * as cloud from "@/lib/supabase/database";
import * as local from "@/lib/storage";
import type {
  CravingLog,
  DailyCheckIn,
  PuffLog,
  UserPlan,
  UserProfile,
} from "@/lib/types";

export function usingCloudSync(): boolean {
  return isSupabaseConfigured();
}

export async function loadAppState(): Promise<{
  user: UserProfile | null;
  plan: UserPlan | null;
  cravings: CravingLog[];
  checkIns: DailyCheckIn[];
  puffs: PuffLog[];
  cloudSynced: boolean;
}> {
  if (!usingCloudSync()) {
    return {
      user: local.getCurrentUser(),
      plan: local.getPlan(),
      cravings: local.getCravings(),
      checkIns: local.getCheckIns(),
      puffs: local.getPuffs(),
      cloudSynced: false,
    };
  }

  const user = await cloud.getSessionUser();
  if (!user) {
    return {
      user: null,
      plan: local.getPlan(),
      cravings: local.getCravings(),
      checkIns: local.getCheckIns(),
      puffs: local.getPuffs(),
      cloudSynced: false,
    };
  }

  const remote = await cloud.fetchUserData(user.id);
  const localPlan = local.getPlan();
  const localCravings = local.getCravings();
  const localCheckIns = local.getCheckIns();
  const localPuffs = local.getPuffs();

  if (
    localPlan ||
    localCravings.length ||
    localCheckIns.length ||
    localPuffs.length
  ) {
    await cloud.syncLocalToCloud(user.id, {
      plan: localPlan,
      cravings: localCravings,
      checkIns: localCheckIns,
      puffs: localPuffs,
    });
    const merged = await cloud.fetchUserData(user.id);
    if (merged.puffs.length) local.writePuffs(merged.puffs);
    return {
      user,
      plan: merged.plan ?? localPlan,
      cravings: merged.cravings.length ? merged.cravings : localCravings,
      checkIns: merged.checkIns.length ? merged.checkIns : localCheckIns,
      puffs: merged.puffs.length ? merged.puffs : localPuffs,
      cloudSynced: true,
    };
  }

  return { user, ...remote, cloudSynced: true };
}

export async function createAccount(
  email: string,
  name: string,
): Promise<{ mode: "local" | "magic_link"; error?: string }> {
  if (usingCloudSync()) {
    const { error } = await cloud.sendMagicLink(email, name);
    local.signUp(email, name);
    return { mode: "magic_link", error };
  }
  local.signUp(email, name);
  return { mode: "local" };
}

export async function requestLogin(
  email: string,
): Promise<{ mode: "local" | "magic_link"; user?: UserProfile; error?: string }> {
  if (usingCloudSync()) {
    const { error } = await cloud.sendMagicLink(email);
    return { mode: "magic_link", error };
  }
  const user = local.signIn(email);
  return { mode: "local", user: user ?? undefined };
}

export async function logout(): Promise<void> {
  if (usingCloudSync()) await cloud.signOutCloud();
  local.signOut();
}

/** Delete cloud account (if signed in) and wipe local QuitCurve data. */
export async function deleteAccount(): Promise<{ error?: string }> {
  if (usingCloudSync()) {
    const user = await cloud.getSessionUser();
    if (user) {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        return {
          error:
            body.error ??
            "Could not delete account. Email quitcurve@gmail.com for help.",
        };
      }
    }
  }
  local.clearAllLocalData();
  return {};
}

export async function savePlan(
  plan: UserPlan,
  userId?: string,
): Promise<UserPlan> {
  local.savePlan(plan);
  if (usingCloudSync() && userId) {
    await cloud.upsertPlan(userId, plan);
  }
  return plan;
}

export async function logCraving(
  data: Omit<CravingLog, "id" | "loggedAt">,
  userId?: string,
): Promise<{ plan: UserPlan | null; cravings: CravingLog[] }> {
  if (usingCloudSync() && userId) {
    await cloud.insertCraving(userId, data);
    let plan = local.getPlan();
    if (plan && !data.managed && data.intensity >= 4) {
      plan = { ...plan, slipCount: plan.slipCount + 1 };
      local.savePlan(plan);
      await cloud.updatePlanSlipCount(userId, plan.slipCount);
    }
    const remote = await cloud.fetchUserData(userId);
    if (plan) local.savePlan(plan);
    local.writeCravings(remote.cravings);
    return { plan: remote.plan ?? plan, cravings: remote.cravings };
  }

  local.addCraving(data);
  return { plan: local.getPlan(), cravings: [...local.getCravings()] };
}

export async function logPuff(
  count = 1,
  userId?: string,
): Promise<PuffLog[]> {
  if (usingCloudSync() && userId) {
    await cloud.insertPuff(userId, count);
    const remote = await cloud.fetchUserData(userId);
    local.writePuffs(remote.puffs);
    return remote.puffs;
  }
  local.addPuff(count);
  return [...local.getPuffs()];
}

export async function saveCheckIn(
  data: Omit<DailyCheckIn, "id" | "date">,
  userId?: string,
): Promise<DailyCheckIn[]> {
  if (usingCloudSync() && userId) {
    await cloud.upsertCheckIn(userId, data);
    const remote = await cloud.fetchUserData(userId);
    local.writeCheckIns(remote.checkIns);
    return remote.checkIns;
  }
  local.saveCheckIn(data);
  return local.getCheckIns();
}

export function getManagedCount(cravings: CravingLog[]): number {
  return cravings.filter((c) => c.managed).length;
}
