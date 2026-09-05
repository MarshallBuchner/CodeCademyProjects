"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { usePowr } from "@/context/PowrProvider";

export default function DashboardPage() {
  const { assessments, ready, user, cloudEnabled } = usePowr();

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7dffb3]">
              History
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide">
              Saved assessments
            </h1>
            <p className="mt-2 text-sm text-white/60">
              {user
                ? `Signed in as ${user.email}`
                : cloudEnabled
                  ? "Guest mode — sign in to sync across devices."
                  : "Stored on this device until Supabase is connected."}
            </p>
          </div>
          <Link
            href="/#start"
            className="rounded-full bg-[#7dffb3] px-4 py-2 text-sm font-semibold text-[#041016]"
          >
            New assessment
          </Link>
        </div>

        {!ready ? (
          <p className="mt-10 text-sm text-white/50">Loading…</p>
        ) : assessments.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-white/70">No assessments yet.</p>
            <Link href="/#start" className="mt-4 inline-block text-[#7dffb3]">
              Run your first assessment →
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {assessments.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#7dffb3]">
                      {a.goal}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{a.fileName}</h2>
                    <p className="mt-1 text-sm text-white/55">
                      {new Date(a.createdAt).toLocaleString()} · {a.source}
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      Priority: {a.priorityImprovement}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-display)] text-3xl text-[#7dffb3]">
                      {a.overallScore}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                      score
                    </p>
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
