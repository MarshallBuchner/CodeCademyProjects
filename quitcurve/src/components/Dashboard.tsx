"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { NicotineCurveChart } from "./NicotineCurveChart";

type Plan = {
  device: string | null;
  frequency: string | null;
  pace: string;
};

const PACE_WEEKS: Record<string, { total: number; current: number }> = {
  "4-week": { total: 4, current: 2 },
  "8-week": { total: 8, current: 3 },
  "12-week": { total: 12, current: 3 },
};

const DEFAULT_PLAN: Plan = {
  device: null,
  frequency: null,
  pace: "8-week",
};

export function Dashboard() {
  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("quitcurve-plan");
      if (stored) setPlan({ ...DEFAULT_PLAN, ...JSON.parse(stored) });
    } catch {
      // use defaults
    }
  }, []);

  const weeks = PACE_WEEKS[plan.pace] ?? PACE_WEEKS["8-week"];
  const progressPct = Math.round(
    (weeks.current / weeks.total) * 100 * 0.38 + 20,
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10"
            aria-label="Menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-foreground" />
              <span className="block h-0.5 w-4 bg-foreground" />
              <span className="block h-0.5 w-4 bg-foreground" />
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-6">
        <p className="text-sm text-muted">Good evening, Alex</p>
        <h1 className="text-2xl font-bold">
          Week {weeks.current} of {weeks.total}
        </h1>

        <div className="mt-6 rounded-2xl border border-white/8 bg-card p-5">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-4xl font-bold text-accent">42%</p>
              <p className="text-sm text-muted">less nicotine</p>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              On track
            </span>
          </div>
          <NicotineCurveChart />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { value: "23", label: "cravings" },
            { value: "$86", label: "saved" },
            { value: "Day 28", label: "next goal" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/5 bg-card px-3 py-4 text-center"
            >
              <p className="text-lg font-semibold text-accent">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/5 bg-card px-5 py-4 text-center text-sm text-muted">
          You&apos;re building something better every day.{" "}
          <span className="text-accent">Stay consistent.</span> You&apos;ve got
          this.
        </div>

        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-semibold text-background transition hover:bg-accent-dim"
        >
          <span className="text-lg leading-none">+</span>
          Log a craving
        </button>

        <p className="mt-8 text-center text-xs text-white/30">
          {progressPct}% through your plan • Prototype dashboard
        </p>
      </main>
    </div>
  );
}
