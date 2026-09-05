"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { usePowr } from "@/context/PowrProvider";

export default function ProgressPage() {
  const { assessments, ready } = usePowr();
  const chronological = [...assessments].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  const latest = assessments[0];
  const first = chronological[0];
  const delta =
    latest && first && assessments.length > 1
      ? latest.overallScore - first.overallScore
      : null;

  const byGoal = assessments.reduce<Record<string, number[]>>((acc, a) => {
    acc[a.goal] = acc[a.goal] || [];
    acc[a.goal].push(a.overallScore);
    return acc;
  }, {});

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#7dffb3]">
          Progress
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide">
          Development over time
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          Retest the same focus area after drills. POWR compares scores so
          players, parents, and coaches can see what is actually improving.
        </p>

        {!ready ? (
          <p className="mt-10 text-sm text-white/50">Loading…</p>
        ) : assessments.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 p-8 text-center">
            <p className="text-white/70">Complete an assessment to unlock progress.</p>
            <Link href="/#start" className="mt-4 inline-block text-[#7dffb3]">
              Start now →
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                Assessments
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
                {assessments.length}
              </p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                Latest score
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[#7dffb3]">
                {latest?.overallScore ?? "—"}
              </p>
            </article>
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                Change since first
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
                {delta === null ? "—" : `${delta > 0 ? "+" : ""}${delta}`}
              </p>
            </article>
          </div>
        )}

        {Object.keys(byGoal).length > 0 ? (
          <section className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              By focus area
            </h2>
            {Object.entries(byGoal).map(([goal, scores]) => {
              const avg = Math.round(
                scores.reduce((s, n) => s + n, 0) / scores.length,
              );
              return (
                <div
                  key={goal}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{goal}</p>
                    <p className="text-xs text-white/50">
                      {scores.length} assessment{scores.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <p className="text-[#7dffb3]">avg {avg}</p>
                </div>
              );
            })}
          </section>
        ) : null}

        {chronological.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              Score timeline
            </h2>
            <ol className="mt-4 space-y-2">
              {chronological.map((a) => (
                <li
                  key={a.id}
                  className="grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm"
                >
                  <span>
                    {new Date(a.createdAt).toLocaleDateString()} · {a.goal}
                  </span>
                  <span className="font-semibold text-[#7dffb3]">
                    {a.overallScore}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </main>
    </div>
  );
}
