"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import * as dataService from "@/lib/data/service";
import { computePlanStats } from "@/lib/curve";
import type { PlanStats } from "@/lib/types";
import type {
  CravingLog,
  DailyCheckIn,
  UserPlan,
  UserProfile,
} from "@/lib/types";

type AuthResult = {
  mode: "local" | "magic_link";
  error?: string;
  user?: UserProfile;
};

type QuitCurveContextValue = {
  user: UserProfile | null;
  plan: UserPlan | null;
  stats: PlanStats | null;
  cravings: CravingLog[];
  checkIns: DailyCheckIn[];
  todayCheckIn: DailyCheckIn | null;
  loading: boolean;
  cloudEnabled: boolean;
  cloudSynced: boolean;
  refresh: () => Promise<void>;
  createAccount: (email: string, name: string) => Promise<AuthResult>;
  login: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  setUserPlan: (plan: UserPlan) => Promise<void>;
  logCraving: (data: Omit<CravingLog, "id" | "loggedAt">) => Promise<void>;
  submitCheckIn: (data: Omit<DailyCheckIn, "id" | "date">) => Promise<void>;
};

const QuitCurveContext = createContext<QuitCurveContextValue | null>(null);

export function QuitCurveProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [cravings, setCravings] = useState<CravingLog[]>([]);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloudSynced, setCloudSynced] = useState(false);
  const cloudEnabled = isSupabaseConfigured();

  const refresh = useCallback(async () => {
    setLoading(true);
    const state = await dataService.loadAppState();
    setUser(state.user);
    setPlan(state.plan);
    setCravings(state.cravings);
    setCheckIns(state.checkIns);
    setCloudSynced(state.cloudSynced);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!cloudEnabled) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });

    return () => subscription.unsubscribe();
  }, [cloudEnabled, refresh]);

  const stats = useMemo(() => {
    if (!plan) return null;
    return computePlanStats(plan, dataService.getManagedCount(cravings));
  }, [plan, cravings]);

  const todayCheckIn = useMemo(
    () =>
      checkIns.find((c) => c.date === new Date().toISOString().slice(0, 10)) ??
      null,
    [checkIns],
  );

  const value: QuitCurveContextValue = {
    user,
    plan,
    stats,
    cravings,
    checkIns,
    todayCheckIn,
    loading,
    cloudEnabled,
    cloudSynced,
    refresh,
    createAccount: async (email, name) => {
      const result = await dataService.createAccount(email, name);
      if (result.mode === "local") await refresh();
      return result;
    },
    login: async (email) => {
      const result = await dataService.requestLogin(email);
      if (result.mode === "local" && result.user) {
        setUser(result.user);
        await refresh();
      }
      return result;
    },
    logout: async () => {
      await dataService.logout();
      setUser(null);
      await refresh();
    },
    setUserPlan: async (nextPlan) => {
      const saved = await dataService.savePlan(nextPlan, user?.id);
      setPlan(saved);
    },
    logCraving: async (cravingData) => {
      const { plan: updatedPlan, cravings: updatedCravings } =
        await dataService.logCraving(cravingData, user?.id);
      setPlan(updatedPlan);
      setCravings(updatedCravings);
    },
    submitCheckIn: async (checkInData) => {
      const updated = await dataService.saveCheckIn(checkInData, user?.id);
      setCheckIns(updated);
    },
  };

  return (
    <QuitCurveContext.Provider value={value}>{children}</QuitCurveContext.Provider>
  );
}

export function useQuitCurve() {
  const ctx = useContext(QuitCurveContext);
  if (!ctx) throw new Error("useQuitCurve must be used within QuitCurveProvider");
  return ctx;
}
