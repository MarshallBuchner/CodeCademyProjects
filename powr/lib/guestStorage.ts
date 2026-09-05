import type { RealAnalysis } from "@/app/components/types";
import type { SavedAssessment } from "@/lib/supabase/database";

const KEY = "powr.guest.assessments.v1";

export function loadGuestAssessments(): SavedAssessment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedAssessment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestAssessments(records: SavedAssessment[]) {
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function upsertGuestAssessment(record: SavedAssessment) {
  const next = [record, ...loadGuestAssessments().filter((r) => r.id !== record.id)];
  saveGuestAssessments(next);
  return next;
}

export function clearGuestAssessments() {
  localStorage.removeItem(KEY);
}

export function createGuestAssessment(input: {
  goal: string;
  fileName: string;
  durationSec: number | null;
  analysis: RealAnalysis;
  source: SavedAssessment["source"];
}): SavedAssessment {
  return {
    id: crypto.randomUUID(),
    userId: null,
    goal: input.goal,
    fileName: input.fileName,
    durationSec: input.durationSec,
    overallScore: input.analysis.overallScore,
    priorityImprovement: input.analysis.priorityImprovement,
    analysis: input.analysis,
    source: input.source === "sample" ? "sample" : "guest",
    createdAt: new Date().toISOString(),
  };
}
