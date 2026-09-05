"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SAMPLE_ANALYSIS, SAMPLE_FILE_NAME } from "@/lib/analysis";
import {
  clearLocalAssessments,
  loadLocalAssessments,
  upsertLocalAssessment,
} from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import {
  fetchCloudAssessments,
  insertCloudAssessment,
  sendMagicLink,
  signOut as supabaseSignOut,
} from "@/lib/supabase/database";
import type {
  AnalysisResult,
  AssessmentGoal,
  AssessmentRecord,
  Profile,
} from "@/lib/types";

type SaveInput = {
  goal: AssessmentGoal;
  fileName: string;
  durationSec: number | null;
  analysis: AnalysisResult;
  source: AssessmentRecord["source"];
};

type PowrContextValue = {
  cloudEnabled: boolean;
  ready: boolean;
  user: Profile | null;
  assessments: AssessmentRecord[];
  latest: AssessmentRecord | null;
  saveAssessment: (input: SaveInput) => Promise<AssessmentRecord>;
  loadSample: () => Promise<AssessmentRecord>;
  requestMagicLink: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const PowrContext = createContext<PowrContextValue | null>(null);

export function PowrProvider({ children }: { children: ReactNode }) {
  const cloudEnabled = isSupabaseConfigured();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);

  const refresh = useCallback(async () => {
    if (cloudEnabled && user) {
      try {
        setAssessments(await fetchCloudAssessments());
        return;
      } catch (err) {
        console.error(err);
      }
    }
    setAssessments(loadLocalAssessments());
  }, [cloudEnabled, user]);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    async function boot() {
      if (!cloudEnabled) {
        if (!active) return;
        setAssessments(loadLocalAssessments());
        setReady(true);
        return;
      }

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name:
            (session.user.user_metadata?.name as string | undefined) ||
            session.user.email?.split("@")[0] ||
            "Athlete",
        });
      } else {
        setAssessments(loadLocalAssessments());
      }
      setReady(true);

      const { data } = supabase.auth.onAuthStateChange((_event, next) => {
        if (!next?.user) {
          setUser(null);
          setAssessments(loadLocalAssessments());
          return;
        }
        setUser({
          id: next.user.id,
          email: next.user.email ?? "",
          name:
            (next.user.user_metadata?.name as string | undefined) ||
            next.user.email?.split("@")[0] ||
            "Athlete",
        });
      });
      unsubscribe = () => data.subscription.unsubscribe();
    }

    void boot();
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [cloudEnabled]);

  useEffect(() => {
    if (!ready) return;
    void refresh();
  }, [ready, user?.id, refresh]);

  const saveAssessment = useCallback(
    async (input: SaveInput) => {
      if (cloudEnabled && user) {
        const saved = await insertCloudAssessment(input);
        setAssessments((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
        clearLocalAssessments();
        return saved;
      }

      const local: AssessmentRecord = {
        id: crypto.randomUUID(),
        userId: null,
        goal: input.goal,
        fileName: input.fileName,
        durationSec: input.durationSec,
        overallScore: input.analysis.overallScore,
        priorityImprovement: input.analysis.priorityImprovement,
        analysis: input.analysis,
        createdAt: new Date().toISOString(),
        source: input.source === "sample" ? "sample" : "guest",
      };
      setAssessments(upsertLocalAssessment(local));
      return local;
    },
    [cloudEnabled, user],
  );

  const loadSample = useCallback(async () => {
    return saveAssessment({
      goal: "Acceleration",
      fileName: SAMPLE_FILE_NAME,
      durationSec: 13,
      analysis: SAMPLE_ANALYSIS,
      source: "sample",
    });
  }, [saveAssessment]);

  const requestMagicLink = useCallback(async (email: string) => {
    try {
      await sendMagicLink(email);
      return {};
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Could not send magic link",
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (cloudEnabled) await supabaseSignOut();
    setUser(null);
    setAssessments(loadLocalAssessments());
  }, [cloudEnabled]);

  const value = useMemo(
    () => ({
      cloudEnabled,
      ready,
      user,
      assessments,
      latest: assessments[0] ?? null,
      saveAssessment,
      loadSample,
      requestMagicLink,
      signOut,
      refresh,
    }),
    [
      cloudEnabled,
      ready,
      user,
      assessments,
      saveAssessment,
      loadSample,
      requestMagicLink,
      signOut,
      refresh,
    ],
  );

  return <PowrContext.Provider value={value}>{children}</PowrContext.Provider>;
}

export function usePowr() {
  const ctx = useContext(PowrContext);
  if (!ctx) throw new Error("usePowr must be used within PowrProvider");
  return ctx;
}
