import type { AssessmentRecord } from "@/lib/types";

const KEY = "powr.assessments.v1";

export function loadLocalAssessments(): AssessmentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AssessmentRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalAssessments(records: AssessmentRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function upsertLocalAssessment(record: AssessmentRecord) {
  const existing = loadLocalAssessments().filter((r) => r.id !== record.id);
  const next = [record, ...existing].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  saveLocalAssessments(next);
  return next;
}

export function clearLocalAssessments() {
  localStorage.removeItem(KEY);
}
