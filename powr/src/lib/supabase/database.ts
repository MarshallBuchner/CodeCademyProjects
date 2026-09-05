import type { AnalysisResult, AssessmentGoal, AssessmentRecord } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type AssessmentRow = {
  id: string;
  user_id: string;
  goal: string;
  file_name: string;
  duration_sec: number | null;
  overall_score: number;
  priority_improvement: string;
  analysis: AnalysisResult;
  source: string;
  created_at: string;
};

function rowToRecord(row: AssessmentRow): AssessmentRecord {
  return {
    id: row.id,
    userId: row.user_id,
    goal: row.goal as AssessmentGoal,
    fileName: row.file_name,
    durationSec: row.duration_sec,
    overallScore: row.overall_score,
    priorityImprovement: row.priority_improvement,
    analysis: row.analysis,
    createdAt: row.created_at,
    source: (row.source as AssessmentRecord["source"]) || "live",
  };
}

export async function fetchCloudAssessments(): Promise<AssessmentRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as AssessmentRow[]).map(rowToRecord);
}

export async function insertCloudAssessment(input: {
  goal: AssessmentGoal;
  fileName: string;
  durationSec: number | null;
  analysis: AnalysisResult;
  source: AssessmentRecord["source"];
}): Promise<AssessmentRecord> {
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
  return rowToRecord(data as AssessmentRow);
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
