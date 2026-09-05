"use client";

import Link from "next/link";
import AppHeader from "@/app/components/AppHeader";
import { usePowrAuth } from "@/lib/PowrAuthProvider";

export default function ProgressPage() {
  const { assessments, ready } = usePowrAuth();
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
    (acc[a.goal] ||= []).push(a.overallScore);
    return acc;
  }, {});

  return (
    <div>
      <AppHeader />
      <main className="app-shell" style={{ maxWidth: 900, margin: "0 auto" }}>
        <p className="eyebrow">PROGRESS</p>
        <h1>Development over time</h1>
        <p>
          Re-test the same focus after drills. POWR compares scores so players and
          coaches can see what is actually improving.
        </p>

        {!ready ? (
          <p style={{ marginTop: 28, opacity: 0.6 }}>Loading…</p>
        ) : assessments.length === 0 ? (
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <p>Complete an assessment to unlock progress tracking.</p>
            <Link href="/#start-assessment" style={{ color: "#6dffae" }}>
              Start now →
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
                marginTop: 28,
              }}
            >
              {[
                ["Assessments", String(assessments.length)],
                ["Latest score", String(latest?.overallScore ?? "—")],
                [
                  "Change since first",
                  delta === null ? "—" : `${delta > 0 ? "+" : ""}${delta}`,
                ],
              ].map(([label, value]) => (
                <article
                  key={label}
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.55, letterSpacing: "0.12em" }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8, color: "#6dffae" }}>
                    {value}
                  </div>
                </article>
              ))}
            </div>

            <section style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 16, letterSpacing: "0.12em" }}>BY FOCUS</h2>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                {Object.entries(byGoal).map(([goal, scores]) => {
                  const avg = Math.round(
                    scores.reduce((sum, n) => sum + n, 0) / scores.length,
                  );
                  return (
                    <div
                      key={goal}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "12px 14px",
                      }}
                    >
                      <div>
                        <strong>{goal}</strong>
                        <div style={{ fontSize: 12, opacity: 0.55 }}>
                          {scores.length} assessment{scores.length === 1 ? "" : "s"}
                        </div>
                      </div>
                      <span style={{ color: "#6dffae" }}>avg {avg}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 16, letterSpacing: "0.12em" }}>TIMELINE</h2>
              <ol style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 8 }}>
                {chronological.map((a) => (
                  <li
                    key={a.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 12,
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "10px 12px",
                      fontSize: 14,
                    }}
                  >
                    <span>
                      {new Date(a.createdAt).toLocaleDateString()} · {a.goal}
                    </span>
                    <strong style={{ color: "#6dffae" }}>{a.overallScore}</strong>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
