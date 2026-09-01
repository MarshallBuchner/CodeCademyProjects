"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { computePlanStats, STATUS_LABELS } from "@/lib/curve";
import type { PlanStats } from "@/lib/types";
import {
  addCraving,
  getCheckIns,
  getCravings,
  getCurrentUser,
  getManagedCravingCount,
  getPlan,
  getTodayCheckIn,
  saveCheckIn,
  savePlan,
  signIn,
  signOut,
  signUp,
} from "@/lib/storage";
import type {
  CravingLog,
  DailyCheckIn,
  UserPlan,
  UserProfile,
} from "@/lib/types";

type QuitCurveContextValue = {
  user: UserProfile | null;
  plan: UserPlan | null;
  stats: PlanStats | null;
  cravings: CravingLog[];
  checkIns: DailyCheckIn[];
  todayCheckIn: DailyCheckIn | null;
  loading: boolean;
  refresh: () => void;
  createAccount: (email: string, name: string) => UserProfile;
  login: (email: string) => UserProfile | null;
  logout: () => void;
  setUserPlan: (plan: UserPlan) => void;
  logCraving: (data: Omit<CravingLog, "id" | "loggedAt">) => void;
  submitCheckIn: (data: Omit<DailyCheckIn, "id" | "date">) => void;
};

const QuitCurveContext = createContext<QuitCurveContextValue | null>(null);

export function QuitCurveProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [cravings, setCravings] = useState<CravingLog[]>([]);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setUser(getCurrentUser());
    setPlan(getPlan());
    setCravings(getCravings());
    setCheckIns(getCheckIns());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stats = useMemo(() => {
    if (!plan) return null;
    return computePlanStats(plan, getManagedCravingCount());
  }, [plan, cravings]);

  const todayCheckIn = useMemo(
    () => checkIns.find((c) => c.date === new Date().toISOString().slice(0, 10)) ?? null,
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
    refresh,
    createAccount: (email, name) => {
      const profile = signUp(email, name);
      setUser(profile);
      return profile;
    },
    login: (email) => {
      const profile = signIn(email);
      setUser(profile);
      return profile;
    },
    logout: () => {
      signOut();
      setUser(null);
    },
    setUserPlan: (nextPlan) => {
      savePlan(nextPlan);
      setPlan(nextPlan);
    },
    logCraving: (data) => {
      addCraving(data);
      setPlan(getPlan());
      setCravings(getCravings());
    },
    submitCheckIn: (data) => {
      saveCheckIn(data);
      setCheckIns(getCheckIns());
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
