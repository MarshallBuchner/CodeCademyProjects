"use client";

import Link from "next/link";
import AppHeader from "@/app/components/AppHeader";
import { usePowrAuth } from "@/lib/PowrAuthProvider";

export default function DashboardPage() {
  const { assessments, ready, user, cloudEnabled } = usePowrAuth();

  return (
    <div>
      <AppHeader />
      <main className="app-shell" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <div>
            <p className="eyebrow">HISTORY</p>
            <h1>Saved assessments</h1>
            <p>
              {user
                ? `Signed in as ${user.email}`
                : cloudEnabled
                  ? "Guest mode — sign in to sync across devices."
                  : "Stored on this device until Supabase is connected."}
            </p>
          </div>
          <Link className="primary-button" href="/#start-assessment" style={{ width: "auto", padding: "0 18px", textDecoration: "none" }}>
            New assessment
          </Link>
        </div>

        {!ready ? (
          <p style={{ marginTop: 28, opacity: 0.6 }}>Loading…</p>
        ) : assessments.length === 0 ? (
          <div
            style={{
              marginTop: 28,
              padding: 28,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
            }}
          >
            <p>No assessments saved yet.</p>
            <Link href="/#start-assessment" style={{ color: "#6dffae" }}>
              Run your first assessment →
            </Link>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gap: 12 }}>
            {assessments.map((a) => (
              <li
                key={a.id}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  padding: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <p className="eyebrow" style={{ marginBottom: 6 }}>
                    {a.goal}
                  </p>
                  <strong>{a.fileName}</strong>
                  <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.65 }}>
                    {new Date(a.createdAt).toLocaleString()} · {a.source}
                  </p>
                  <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.8 }}>
                    Priority: {a.priorityImprovement}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#6dffae" }}>
                    {a.overallScore}
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: "0.14em", opacity: 0.5 }}>
                    SCORE
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
