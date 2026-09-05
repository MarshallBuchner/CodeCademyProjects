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
import type { AnalysisRequest } from "@/app/components/types";
import {
  clearGuestAssessments,
  createGuestAssessment,
  loadGuestAssessments,
  upsertGuestAssessment,
} from "@/lib/guestStorage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import {
  fetchCloudAssessments,
  insertCloudAssessment,
  requestToSavedInput,
  sendMagicLink,
  signOut as supabaseSignOut,
  type SavedAssessment,
} from "@/lib/supabase/database";

export type PowrUser = {
  id: string;
  email: string;
  name: string;
};

type PowrAuthValue = {
  cloudEnabled: boolean;
  ready: boolean;
  user: PowrUser | null;
  assessments: SavedAssessment[];
  saveAssessment: (request: AnalysisRequest) => Promise<SavedAssessment>;
  requestMagicLink: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const PowrAuthContext = createContext<PowrAuthValue | null>(null);

export function PowrAuthProvider({ children }: { children: ReactNode }) {
  const cloudEnabled = isSupabaseConfigured();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<PowrUser | null>(null);
  const [assessments, setAssessments] = useState<SavedAssessment[]>([]);

  const refresh = useCallback(async () => {
    if (cloudEnabled && user) {
      try {
        setAssessments(await fetchCloudAssessments());
        return;
      } catch (err) {
        console.error(err);
      }
    }
    setAssessments(loadGuestAssessments());
  }, [cloudEnabled, user]);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    async function boot() {
      if (!cloudEnabled) {
        if (!active) return;
        setAssessments(loadGuestAssessments());
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
        setAssessments(loadGuestAssessments());
      }
      setReady(true);

      const { data } = supabase.auth.onAuthStateChange((_event, next) => {
        if (!next?.user) {
          setUser(null);
          setAssessments(loadGuestAssessments());
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
    async (request: AnalysisRequest) => {
      const input = requestToSavedInput(request);

      if (cloudEnabled && user) {
        const saved = await insertCloudAssessment(input);
        setAssessments((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
        clearGuestAssessments();
        return saved;
      }

      const guest = createGuestAssessment(input);
      setAssessments(upsertGuestAssessment(guest));
      return guest;
    },
    [cloudEnabled, user],
  );

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
    setAssessments(loadGuestAssessments());
  }, [cloudEnabled]);

  const value = useMemo(
    () => ({
      cloudEnabled,
      ready,
      user,
      assessments,
      saveAssessment,
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
      requestMagicLink,
      signOut,
      refresh,
    ],
  );

  return (
    <PowrAuthContext.Provider value={value}>{children}</PowrAuthContext.Provider>
  );
}

export function usePowrAuth() {
  const ctx = useContext(PowrAuthContext);
  if (!ctx) throw new Error("usePowrAuth must be used within PowrAuthProvider");
  return ctx;
}
