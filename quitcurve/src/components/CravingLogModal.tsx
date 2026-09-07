"use client";

import { useState } from "react";
import { useQuitCurve } from "@/context/QuitCurveProvider";

const TRIGGERS = [
  "Stress",
  "Boredom",
  "After meals",
  "Social",
  "Habit / routine",
  "Other",
];

type CravingLogModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CravingLogModal({ open, onClose }: CravingLogModalProps) {
  const { logCraving } = useQuitCurve();
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [trigger, setTrigger] = useState<string>("Stress");
  const [managed, setManaged] = useState(true);
  const [note, setNote] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    logCraving({ intensity, trigger, managed, note: note || undefined });
    setIntensity(3);
    setTrigger("Stress");
    setManaged(true);
    setNote("");
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
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-card p-6 sm:rounded-3xl sm:p-8">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Craving check-in
        </p>
        <h2 className="mt-2 text-2xl font-bold">How strong is it?</h2>
        <p className="mt-1 text-sm text-muted">
          Logging helps QuitCurve adapt without resetting your progress.
        </p>

        <div className="mt-6 flex justify-between gap-2">
          {([1, 2, 3, 4, 5] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setIntensity(level)}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                intensity === level
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-white/10 text-muted"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted">
          <span>Mild</span>
          <span>Intense</span>
        </div>

        <label className="mt-6 block text-sm font-medium">What triggered it?</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRIGGERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrigger(t)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                trigger === t
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-white/10 text-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={managed}
            onChange={(e) => setManaged(e.target.checked)}
            className="h-4 w-4 rounded accent-accent"
          />
          <span className="text-sm">I managed it without extra nicotine</span>
        </label>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note..."
          rows={2}
          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 w-full rounded-full bg-accent py-4 text-sm font-semibold text-background"
        >
          Save craving log
        </button>
      </div>
    </div>
  );
}
