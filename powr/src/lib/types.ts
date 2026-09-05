export type AssessmentGoal =
  | "Overall skating"
  | "Acceleration"
  | "Stride efficiency"
  | "Crossovers"
  | "Backward skating"
  | "Transitions";

export const ASSESSMENT_GOALS: AssessmentGoal[] = [
  "Overall skating",
  "Acceleration",
  "Stride efficiency",
  "Crossovers",
  "Backward skating",
  "Transitions",
];

export type MetricObservation = {
  type: "good" | "improve";
  text: string;
};

export type MovementMetric = {
  title: string;
  score: number;
  explanation: string;
  observations: MetricObservation[];
  whyItMatters: string;
};

export type Drill = {
  title: string;
  description: string;
  duration: string;
};

export type AnalysisResult = {
  overallScore: number;
  summary: string;
  strengths: string[];
  priorityImprovement: string;
  whyItMatters: string;
  movementMetrics: MovementMetric[];
  drills: Drill[];
  confidence: {
    score: number;
    label: string;
    reason: string;
  };
};

export type AssessmentRecord = {
  id: string;
  userId?: string | null;
  goal: AssessmentGoal;
  fileName: string;
  durationSec: number | null;
  overallScore: number;
  priorityImprovement: string;
  analysis: AnalysisResult;
  createdAt: string;
  source: "sample" | "live" | "guest";
};

export type Profile = {
  id: string;
  email: string;
  name: string;
};
