import { NextResponse } from "next/server";
import { buildAnalysisForGoal } from "@/lib/analysis";
import { ASSESSMENT_GOALS, type AssessmentGoal } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  goal?: string;
  frames?: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const goal = body.goal as AssessmentGoal | undefined;
    const frames = Array.isArray(body.frames) ? body.frames : [];

    if (!goal || !ASSESSMENT_GOALS.includes(goal)) {
      return NextResponse.json(
        { success: false, error: "Choose a valid assessment focus." },
        { status: 400 },
      );
    }

    if (frames.length === 0) {
      return NextResponse.json(
        { success: false, error: "No video frames were provided." },
        { status: 400 },
      );
    }

    // Prototype coaching engine. Swap for vision-model inference later.
    const analysis = buildAnalysisForGoal(goal, { frameCount: frames.length });

    return NextResponse.json({ success: true, analysis });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Analysis failed",
      },
      { status: 500 },
    );
  }
}
