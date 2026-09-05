"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ReportView } from "@/components/ReportView";
import { usePowr } from "@/context/PowrProvider";
import { extractVideoFrames, requestAnalysis } from "@/lib/frames";
import {
  ASSESSMENT_GOALS,
  type AssessmentGoal,
  type AssessmentRecord,
} from "@/lib/types";

export function AssessmentFlow() {
  const { saveAssessment, loadSample, user, cloudEnabled } = usePowr();
  const [goal, setGoal] = useState<AssessmentGoal>("Acceleration");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AssessmentRecord | null>(null);

  const fileLabel = useMemo(() => {
    if (!file) return "MP4, MOV · max ~250MB";
    return `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  }, [file]);

  async function runLive() {
    if (!file) {
      setError("Upload a skating clip first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { frames, durationSec } = await extractVideoFrames(file, 8);
      const analysis = await requestAnalysis({ goal, frames });
      const saved = await saveAssessment({
        goal,
        fileName: file.name,
        durationSec: durationSec || null,
        analysis,
        source: "live",
      });
      setResult(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assessment failed");
    } finally {
      setBusy(false);
    }
  }

  async function runSample() {
    setBusy(true);
    setError("");
    try {
      const saved = await loadSample();
      setResult(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load sample");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-6">
        <ReportView
          analysis={result.analysis}
          goal={result.goal}
          fileName={result.fileName}
        />
        {!user && (
          <div className="rounded-3xl border border-[#7dffb3]/30 bg-[#7dffb3]/10 p-5">
            <h3 className="text-lg font-semibold text-white">
              Save this assessment to your account
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Create a free POWR account to keep history, compare scores over time,
              and pick up on any device.
              {!cloudEnabled
                ? " Add Supabase keys to enable cloud sync."
                : null}
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-full bg-[#7dffb3] px-4 py-2 text-sm font-semibold text-[#041016]"
            >
              Save with email magic link
            </Link>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white"
            onClick={() => setResult(null)}
          >
            New assessment
          </button>
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#041016]"
          >
            View history
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#7dffb3]">
          Start your assessment
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white">
          What do you want to improve today?
        </h2>
        <p className="mt-2 text-sm text-white/65">
          Choose a focus, upload a 10–30s skating clip, get a development report.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ASSESSMENT_GOALS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGoal(g)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              goal === g
                ? "bg-[#7dffb3] font-semibold text-[#041016]"
                : "border border-white/15 text-white/75 hover:border-white/40"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/20 px-4 py-10 text-center">
        <span className="text-sm font-medium text-white">Upload skating video</span>
        <span className="mt-1 text-xs text-white/50">{fileLabel}</span>
        <input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void runLive()}
          className="rounded-full bg-[#7dffb3] px-5 py-3 text-sm font-semibold text-[#041016] disabled:opacity-60"
        >
          {busy ? "Analyzing…" : "Analyze my skating"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runSample()}
          className="rounded-full border border-white/20 px-5 py-3 text-sm text-white disabled:opacity-60"
        >
          View sample assessment
        </button>
        <Link
          href="/sample"
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 hover:text-white"
        >
          Open sample page
        </Link>
      </div>
      <p className="text-xs text-white/45">
        First assessment works as a guest. Sign in after to keep history and track
        progress.
      </p>
    </div>
  );
}
