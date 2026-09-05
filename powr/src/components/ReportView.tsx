import type { AnalysisResult } from "@/lib/types";

export function ReportView({
  analysis,
  goal,
  fileName,
}: {
  analysis: AnalysisResult;
  goal: string;
  fileName: string;
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[#7dffb3]">
          {goal}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white">
          Overall score {analysis.overallScore}
        </h2>
        <p className="mt-1 text-sm text-white/50">{fileName}</p>
        <p className="mt-4 text-sm leading-relaxed text-white/75">
          {analysis.summary}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
            Strengths
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {analysis.strengths.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-[#7dffb3]/25 bg-[#7dffb3]/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7dffb3]">
            Top priority
          </h3>
          <p className="mt-3 text-lg text-white">{analysis.priorityImprovement}</p>
          <p className="mt-2 text-sm text-white/70">{analysis.whyItMatters}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
          Movement metrics
        </h3>
        {analysis.movementMetrics.map((m) => (
          <article
            key={m.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="font-semibold text-white">{m.title}</h4>
              <span className="text-[#7dffb3]">{m.score}</span>
            </div>
            <p className="mt-2 text-sm text-white/70">{m.explanation}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {m.observations.map((o) => (
                <li
                  key={o.text}
                  className={o.type === "good" ? "text-white/70" : "text-amber-200/90"}
                >
                  {o.type === "good" ? "✓" : "→"} {o.text}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
          Drills
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          {analysis.drills.map((d) => (
            <article
              key={d.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <h4 className="font-semibold text-white">{d.title}</h4>
              <p className="mt-2 text-sm text-white/70">{d.description}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#7dffb3]">
                {d.duration}
              </p>
            </article>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/45">
        Confidence {analysis.confidence.label} ({analysis.confidence.score}) —{" "}
        {analysis.confidence.reason}
      </p>
    </section>
  );
}
