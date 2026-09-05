import type { AnalysisResult, AssessmentGoal } from "@/lib/types";

/** Sample report matching the live POWR MVP demo. */
export const SAMPLE_ANALYSIS: AnalysisResult = {
  overallScore: 82,
  summary:
    "Strong overall acceleration mechanics with good forward intent and solid stride power. The biggest opportunity is staying lower through the first few strides to generate more force into the ice and build speed faster.",
  strengths: [
    "Strong forward body angle during acceleration",
    "Good full-stride extension once up to speed",
    "Controlled upper-body movement",
  ],
  priorityImprovement: "Stay lower through the first three acceleration strides.",
  whyItMatters:
    "A deeper knee bend allows you to apply more force into the ice and produce stronger, more explosive first steps.",
  movementMetrics: [
    {
      title: "Knee Flexion",
      score: 76,
      explanation:
        "Your skating position is generally strong, but you become slightly upright during the first few acceleration strides.",
      observations: [
        { type: "good", text: "Good athletic posture once up to speed." },
        {
          type: "improve",
          text: "Stay more compressed during the first three strides.",
        },
      ],
      whyItMatters:
        "Greater knee flexion helps create stronger pushes and improves acceleration.",
    },
    {
      title: "Stride Extension",
      score: 88,
      explanation:
        "You demonstrate strong extension through the hip, knee and ankle during your power phase.",
      observations: [
        {
          type: "good",
          text: "Strong extension through the majority of the stride.",
        },
        {
          type: "improve",
          text: "Reach full extension slightly earlier during acceleration.",
        },
      ],
      whyItMatters:
        "Complete extension helps maximize the amount of force transferred into each stride.",
    },
    {
      title: "Body Position",
      score: 84,
      explanation:
        "Your upper body stays controlled with a useful forward lean during acceleration.",
      observations: [
        {
          type: "good",
          text: "Good forward intent without excessive upper-body movement.",
        },
        {
          type: "improve",
          text: "Maintain the forward angle as speed increases.",
        },
      ],
      whyItMatters:
        "Efficient body positioning helps direct more of your force toward forward acceleration.",
    },
  ],
  drills: [
    {
      title: "3-Step Explosion",
      description:
        "Start from a low athletic stance and focus on three powerful, aggressive strides while staying compressed.",
      duration: "3 sets × 5 reps",
    },
    {
      title: "Wall Drive Starts",
      description:
        "Use a wall for support and rehearse a deep forward body angle while driving through each leg.",
      duration: "2 sets × 8 reps per side",
    },
    {
      title: "Low Stance Accelerations",
      description:
        "Perform short accelerations while deliberately maintaining deeper knee flexion through the first few strides.",
      duration: "5 × 10–15 m",
    },
  ],
  confidence: {
    score: 91,
    label: "High",
    reason:
      "The skater remains clearly visible and the clip provides a useful side-angle view of the acceleration mechanics.",
  },
};

export const SAMPLE_FILE_NAME = "POWR Sample Skating Assessment";

type GoalPack = {
  overallScore: number;
  priorityImprovement: string;
  whyItMatters: string;
  strengths: string[];
  metrics: Array<{
    title: string;
    score: number;
    explanation: string;
    good: string;
    improve: string;
    whyItMatters: string;
  }>;
  drills: AnalysisResult["drills"];
};

const GOAL_PACKS: Record<AssessmentGoal, GoalPack> = {
  "Overall skating": {
    overallScore: 80,
    priorityImprovement: "Improve edge control while keeping stride length.",
    whyItMatters:
      "Cleaner edges with full strides raise both speed and control at game pace.",
    strengths: [
      "Balanced skating posture",
      "Consistent tempo",
      "Good directional control",
    ],
    metrics: [
      {
        title: "Balance",
        score: 82,
        explanation: "Stable base with room to quiet upper-body noise.",
        good: "You stay centered through most strides.",
        improve: "Quiet the upper body on edge changes.",
        whyItMatters: "Quiet balance frees the legs to push harder.",
      },
      {
        title: "Stride Length",
        score: 79,
        explanation: "Stride length is usable and can finish more completely.",
        good: "Rhythm stays consistent.",
        improve: "Finish each push under the hip.",
        whyItMatters: "Finished strides add free speed.",
      },
      {
        title: "Edge Control",
        score: 77,
        explanation: "Edges are reliable; ride them a touch longer.",
        good: "You change direction with control.",
        improve: "Ride outside edges a half-beat longer.",
        whyItMatters: "Longer edge rides create power and cut quality.",
      },
    ],
    drills: [
      {
        title: "Full-Extension Strides",
        description:
          "Skate the length of the ice focusing on complete hip-knee-ankle extension each stride.",
        duration: "3 sets × length of ice",
      },
      {
        title: "Quiet Upper Body Skates",
        description:
          "Skate with hands on stick and minimize shoulder rotation while holding edge pressure.",
        duration: "4 × 30 seconds",
      },
      {
        title: "Edge Holds",
        description:
          "Hold outside then inside edges in a shallow arc before switching.",
        duration: "3 sets each edge",
      },
    ],
  },
  "Acceleration": {
    overallScore: 81,
    priorityImprovement: "Stay lower through your first 3 strides.",
    whyItMatters:
      "A deeper first-step load creates more force into the ice and faster separation.",
    strengths: [
      "Clear forward intent out of the start",
      "Strong recovery once up to speed",
      "Balanced upper body",
    ],
    metrics: [
      {
        title: "First-Step Pop",
        score: 78,
        explanation: "Useful intent, but the first load can go deeper.",
        good: "You move forward quickly out of the stance.",
        improve: "Load deeper before the first push.",
        whyItMatters: "First-step depth drives early acceleration.",
      },
      {
        title: "Stride Power",
        score: 85,
        explanation: "Power shows up once you are moving.",
        good: "Strong extension after the first few strides.",
        improve: "Drive through full extension earlier.",
        whyItMatters: "Earlier extension turns posture into speed.",
      },
      {
        title: "Body Angle",
        score: 80,
        explanation: "Forward lean is present and controlled.",
        good: "Good forward intent without excess motion.",
        improve: "Hold the forward lean longer.",
        whyItMatters: "Lean keeps force pointed down the ice.",
      },
    ],
    drills: SAMPLE_ANALYSIS.drills,
  },
  "Stride efficiency": {
    overallScore: 79,
    priorityImprovement: "Recover the skate beneath your hips more quickly.",
    whyItMatters:
      "Faster recovery shortens dead time between pushes and raises stride rate without chopping power.",
    strengths: ["Consistent rhythm", "Solid glide phase", "Controlled arm swing"],
    metrics: [
      {
        title: "Recovery Speed",
        score: 74,
        explanation: "Recovery can snap under the body sooner.",
        good: "Push phase stays composed.",
        improve: "Snap the free skate under sooner.",
        whyItMatters: "Recovery speed sets your stride rate ceiling.",
      },
      {
        title: "Push Path",
        score: 83,
        explanation: "Push direction is generally efficient.",
        good: "Force travels well through the skate.",
        improve: "Push more side-back than straight back.",
        whyItMatters: "Side-back pushes create better ice pressure.",
      },
      {
        title: "Glide Stability",
        score: 81,
        explanation: "Glide leg is mostly stacked and quiet.",
        good: "You hold glide without collapsing.",
        improve: "Stay stacked over the glide leg.",
        whyItMatters: "A stacked glide preserves speed between pushes.",
      },
    ],
    drills: [
      {
        title: "Full-Extension Strides",
        description: "Emphasize finishing every push before recovering.",
        duration: "3 sets × 20 seconds",
      },
      {
        title: "Single-Leg Glides",
        description: "Hold a balanced glide after each push for two counts.",
        duration: "2 sets × 8 per side",
      },
      {
        title: "Tempo Strides",
        description:
          "Alternate slow powerful strides with quick recovery strides.",
        duration: "5 × 15 seconds",
      },
    ],
  },
  "Crossovers": {
    overallScore: 78,
    priorityImprovement: "Increase under-push power through each crossover.",
    whyItMatters:
      "A stronger under-push is the difference between coasting a turn and accelerating through it.",
    strengths: [
      "Controlled circle posture",
      "Stable stick position",
      "Smooth entries",
    ],
    metrics: [
      {
        title: "Under-Push",
        score: 73,
        explanation: "Under-push can travel longer under the body.",
        good: "Crossover timing is readable.",
        improve: "Drive the under skate longer under the body.",
        whyItMatters: "Under-push creates turn acceleration.",
      },
      {
        title: "Lean Angle",
        score: 80,
        explanation: "Lean is present; commit earlier into the turn.",
        good: "You stay composed on the circle.",
        improve: "Commit lean earlier into the turn.",
        whyItMatters: "Earlier lean sets up a stronger under-push.",
      },
      {
        title: "Rhythm",
        score: 82,
        explanation: "Cadence is even and repeatable.",
        good: "Crossover rhythm stays consistent.",
        improve: "Keep crossover cadence even under fatigue.",
        whyItMatters: "Even cadence protects mechanics late in shifts.",
      },
    ],
    drills: [
      {
        title: "Circle Crossovers",
        description:
          "Continuous crossovers on face-off circles with deep under-pushes.",
        duration: "5 laps each direction",
      },
      {
        title: "Wide-to-Tight Circles",
        description:
          "Start wide, tighten radius while holding crossover quality.",
        duration: "4 rounds",
      },
      {
        title: "Under-Push Holds",
        description:
          "Pause briefly on the under-push skate to feel load transfer.",
        duration: "3 sets × 6",
      },
    ],
  },
  "Backward skating": {
    overallScore: 77,
    priorityImprovement: "Generate more power from every C-cut.",
    whyItMatters:
      "Stronger C-cuts create gap control and escape speed without turning your back on the play.",
    strengths: ["Stable hips", "Good visual awareness", "Controlled stops"],
    metrics: [
      {
        title: "C-Cut Power",
        score: 72,
        explanation: "C-cuts can finish with more hip open and push.",
        good: "You stay oriented and composed.",
        improve: "Open the hip and finish each cut.",
        whyItMatters: "Finished C-cuts create true backward speed.",
      },
      {
        title: "Stance Width",
        score: 79,
        explanation: "Base is athletic and ready.",
        good: "Ready stance holds under pressure.",
        improve: "Keep a ready, athletic base.",
        whyItMatters: "Stance width sets balance for C-cuts.",
      },
      {
        title: "Backward Balance",
        score: 81,
        explanation: "Balance is solid moving backward.",
        good: "You do not sit too far on the heels.",
        improve: "Stay on the balls of your feet.",
        whyItMatters: "Forefoot pressure keeps you mobile and explosive.",
      },
    ],
    drills: [
      {
        title: "Backward C-Cuts",
        description:
          "Emphasize deep, complete C-cuts with a quiet upper body.",
        duration: "5 reps × 20 m",
      },
      {
        title: "Backward Figure-8s",
        description: "Link C-cuts through figure-8 patterns both directions.",
        duration: "4 rounds",
      },
      {
        title: "Backward Escape Starts",
        description:
          "From a ready stance, explode backward for 3–4 hard C-cuts.",
        duration: "6 reps",
      },
    ],
  },
  "Transitions": {
    overallScore: 78,
    priorityImprovement:
      "Tighten timing between forward and backward transitions.",
    whyItMatters:
      "Cleaner timing lets you reverse direction without losing speed or awareness.",
    strengths: [
      "Composed direction changes",
      "Good stick control",
      "Balanced exits",
    ],
    metrics: [
      {
        title: "Transition Timing",
        score: 74,
        explanation: "Pivot can start earlier to protect speed.",
        good: "You stay composed through the change.",
        improve: "Initiate the pivot earlier.",
        whyItMatters: "Earlier pivots reduce deceleration.",
      },
      {
        title: "Exit Speed",
        score: 80,
        explanation: "Exit can re-accelerate sooner.",
        good: "You leave the transition balanced.",
        improve: "Re-accelerate immediately after the turn.",
        whyItMatters: "Exit speed turns a transition into an advantage.",
      },
      {
        title: "Edge Security",
        score: 79,
        explanation: "Edges hold through most pivots.",
        good: "You do not wash out of the turn.",
        improve: "Keep pressure through the pivot edge.",
        whyItMatters: "Edge pressure keeps transitions sharp and safe.",
      },
    ],
    drills: [
      {
        title: "Forward-to-Backward Transitions",
        description:
          "Mohawk into backward skating, then re-accelerate for 3 strides.",
        duration: "8 reps each side",
      },
      {
        title: "Open Hip Pivots",
        description: "Practice open-hip turns with eyes up and stick ready.",
        duration: "3 sets × 6",
      },
      {
        title: "Transition Chase",
        description: "Partner or cone chase using only transition patterns.",
        duration: "4 × 20 seconds",
      },
    ],
  },
};

/** Deterministic coaching engine used when no external AI key is configured. */
export function buildAnalysisForGoal(
  goal: AssessmentGoal,
  opts?: { frameCount?: number },
): AnalysisResult {
  const pack = GOAL_PACKS[goal];
  const frames = opts?.frameCount ?? 0;
  const confidenceScore = frames >= 6 ? 88 : frames >= 3 ? 76 : 64;
  const confidenceLabel =
    confidenceScore >= 85 ? "High" : confidenceScore >= 70 ? "Medium" : "Limited";

  return {
    overallScore: pack.overallScore,
    summary: `Focused on ${goal.toLowerCase()}. ${pack.strengths[0]} The biggest unlock right now: ${pack.priorityImprovement}`,
    strengths: pack.strengths,
    priorityImprovement: pack.priorityImprovement,
    whyItMatters: pack.whyItMatters,
    movementMetrics: pack.metrics.map((m) => ({
      title: m.title,
      score: m.score,
      explanation: m.explanation,
      observations: [
        { type: "good" as const, text: m.good },
        { type: "improve" as const, text: m.improve },
      ],
      whyItMatters: m.whyItMatters,
    })),
    drills: pack.drills,
    confidence: {
      score: confidenceScore,
      label: confidenceLabel,
      reason:
        frames > 0
          ? `Processed ${frames} video frame${frames === 1 ? "" : "s"} for this ${goal.toLowerCase()} assessment.`
          : "Generated from the selected focus area with prototype coaching logic.",
    },
  };
}
