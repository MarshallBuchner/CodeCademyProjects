"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ReportView } from "@/components/ReportView";
import { SiteHeader } from "@/components/SiteHeader";
import { usePowr } from "@/context/PowrProvider";
import type { AssessmentRecord } from "@/lib/types";

export default function SamplePage() {
  const { loadSample, user, cloudEnabled } = usePowr();
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const saved = await loadSample();
        if (active) setRecord(saved);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Sample failed");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [loadSample]);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-xs uppercase tracking-[0.22em] text-[#7dffb3]">
          Sample assessment
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide">
          See POWR in action
        </h1>
        {error ? <p className="mt-6 text-sm text-red-300">{error}</p> : null}
        {!record && !error ? (
          <p className="mt-6 text-sm text-white/60">Loading sample report…</p>
        ) : null}
        {record ? (
          <div className="mt-8 space-y-6">
            <ReportView
              analysis={record.analysis}
              goal={record.goal}
              fileName={record.fileName}
            />
            {!user ? (
              <div className="rounded-3xl border border-[#7dffb3]/30 bg-[#7dffb3]/10 p-5">
                <h2 className="text-lg font-semibold">Save assessments to your account</h2>
                <p className="mt-2 text-sm text-white/70">
                  Sign in with email to keep history and track progress
                  {cloudEnabled ? "." : " (connect Supabase to enable cloud sync)."}
                </p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex rounded-full bg-[#7dffb3] px-4 py-2 text-sm font-semibold text-[#041016]"
                >
                  Save with magic link
                </Link>
              </div>
            ) : null}
            <Link href="/dashboard" className="text-sm text-[#7dffb3]">
              View history →
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
