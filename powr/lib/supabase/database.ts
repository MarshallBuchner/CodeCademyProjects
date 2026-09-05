import type { AnalysisRequest, RealAnalysis } from "@/app/components/types";
import { createClient } from "@/lib/supabase/client";

export type SavedAssessment = {
  id: string;
  userId: string | null;
  goal: string;
  fileName: string;
  durationSec: number | null;
  overallScore: number;
  priorityImprovement: string;
  analysis: RealAnalysis;
  source: "live" | "sample" | "guest";
  createdAt: string;
};

type AssessmentRow = {
  id: string;
  user_id: string;
  goal: string;
  file_name: string;
  duration_sec: number | null;
  overall_score: number;
  priority_improvement: string;
  analysis: RealAnalysis;
  source: string;
  created_at: string;
};

function rowToSaved(row: AssessmentRow): SavedAssessment {
  return {
    id: row.id,
    userId: row.user_id,
    goal: row.goal,
    fileName: row.file_name,
    durationSec: row.duration_sec,
    overallScore: row.overall_score,
    priorityImprovement: row.priority_improvement,
    analysis: row.analysis,
    source: (row.source as SavedAssessment["source"]) || "live",
    createdAt: row.created_at,
  };
}

export function requestToSavedInput(request: AnalysisRequest) {
  if (!request.analysis) {
    throw new Error("Assessment has no analysis to save.");
  }

  return {
    goal: request.goal,
    fileName: request.fileName,
    durationSec: request.duration,
    analysis: request.analysis,
    source: (request.fileName.includes("Sample")
      ? "sample"
      : "live") as SavedAssessment["source"],
  };
}

export async function fetchCloudAssessments(): Promise<SavedAssessment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data as AssessmentRow[]) || []).map(rowToSaved);
}

export async function insertCloudAssessment(input: {
  goal: string;
  fileName: string;
  durationSec: number | null;
  analysis: RealAnalysis;
  source: SavedAssessment["source"];
}): Promise<SavedAssessment> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("assessments")
    .insert({
      user_id: user.id,
      goal: input.goal,
      file_name: input.fileName,
      duration_sec: input.durationSec,
      overall_score: input.analysis.overallScore,
      priority_improvement: input.analysis.priorityImprovement,
      analysis: input.analysis,
      source: input.source,
    })
    .select("*")
    .single();

  if (error) throw error;
  return rowToSaved(data as AssessmentRow);
}

export async function sendMagicLink(email: string) {
  const supabase = createClient();
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
