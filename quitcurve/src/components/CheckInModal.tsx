"use client";

import { useState } from "react";
import { useQuitCurve } from "@/context/QuitCurveProvider";
import type { DailyCheckIn } from "@/lib/types";

type CheckInModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CheckInModal({ open, onClose }: CheckInModalProps) {
  const { submitCheckIn } = useQuitCurve();
  const [mood, setMood] = useState<DailyCheckIn["mood"]>("okay");
  const [stayedOnPlan, setStayedOnPlan] = useState(true);
  const [note, setNote] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    submitCheckIn({ mood, stayedOnPlan, note: note || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl border border-white/10 bg-card p-6 sm:rounded-3xl sm:p-8">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Daily check-in
        </p>
        <h2 className="mt-2 text-2xl font-bold">How was today?</h2>

        <p className="mt-6 text-sm font-medium">Mood</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(
            [
              { value: "great", label: "Great" },
              { value: "okay", label: "Okay" },
              { value: "tough", label: "Tough" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMood(opt.value)}
              className={`rounded-xl border py-3 text-sm font-medium transition ${
                mood === opt.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-white/10 text-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={stayedOnPlan}
            onChange={(e) => setStayedOnPlan(e.target.checked)}
            className="h-4 w-4 rounded accent-accent"
          />
          <span className="text-sm">I stayed on my nicotine target today</span>
        </label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything you want to remember?"
          rows={2}
          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 w-full rounded-full bg-accent py-4 text-sm font-semibold text-background"
        >
          Complete check-in
        </button>
      </div>
    </div>
  );
}
