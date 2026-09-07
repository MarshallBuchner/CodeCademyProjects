"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckInModal } from "./CheckInModal";
import { CravingLogModal } from "./CravingLogModal";
import { DayPacingChart } from "./DayPacingChart";
import { Logo } from "./Logo";
import { OnboardingFlow } from "./OnboardingFlow";
import { useQuitCurve } from "@/context/QuitCurveProvider";
import { getPaceLabel, STATUS_LABELS } from "@/lib/curve";
import { getTimeGreeting } from "@/lib/greeting";

export function Dashboard() {
  const router = useRouter();
  const {
    user,
    plan,
    stats,
    pacing,
    todayCheckIn,
    logout,
    cloudSynced,
    logPuff,
  } = useQuitCurve();
  const [cravingOpen, setCravingOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingPuff, setLoggingPuff] = useState(false);

  if (!plan || !stats || !pacing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
        <Logo />
        <h1 className="mt-8 text-2xl font-bold">Let&apos;s build your curve</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Complete a quick intake to get your personalized quit plan and
          dashboard.
        </p>
        <button
          type="button"
          onClick={() => setOnboardingOpen(true)}
          className="mt-8 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-background"
        >
          Build my quit plan
        </button>
        <Link href="/" className="mt-4 text-sm text-muted">
          Back to home
        </Link>
        <OnboardingFlow
          open={onboardingOpen}
          onClose={() => setOnboardingOpen(false)}
        />
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const ringPct = Math.min(100, pacing.budgetUsedPct);
  const ringOffset = 100 - ringPct;

  const handleLogPuff = async () => {
    setLoggingPuff(true);
    try {
      await logPuff(1);
    } finally {
      setLoggingPuff(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10"
              aria-label="Menu"
            >
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-4 bg-foreground" />
                <span className="block h-0.5 w-4 bg-foreground" />
                <span className="block h-0.5 w-4 bg-foreground" />
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-white/10 bg-card py-2 shadow-xl">
                {user && (
                  <Link
                    href="/reminders"
                    className="block px-4 py-2 text-sm text-muted hover:text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    Reminders
                  </Link>
                )}
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-muted hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {user ? "Switch account" : "Sign in"}
                </Link>
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      router.push("/");
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-muted hover:text-foreground"
                  >
                    Sign out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-6">
        <p className="text-sm text-muted">{getTimeGreeting(firstName)}</p>
        <h1 className="text-2xl font-bold">
          Week {stats.currentWeek} of {stats.totalWeeks}
        </h1>
        <p className="mt-1 text-xs text-muted">{getPaceLabel(plan.pace)}</p>

        {!todayCheckIn && (
          <button
            type="button"
            onClick={() => setCheckInOpen(true)}
            className="mt-4 w-full rounded-2xl border border-dashed border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent"
          >
            ✦ Complete today&apos;s check-in
          </button>
        )}

        <div className="mt-6 rounded-3xl border border-white/8 bg-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Today&apos;s target
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight">
            {pacing.todayTarget}{" "}
            <span className="text-lg font-medium text-muted">puffs</span>
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="min-w-[4.5rem] text-center">
              <p className="text-2xl font-semibold">{pacing.used}</p>
              <p className="text-xs text-muted">used</p>
            </div>

            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#5ee9b5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-lg font-bold text-accent">{ringPct}%</p>
                <p className="px-2 text-[10px] leading-tight text-muted">
                  of today&apos;s budget
                </p>
              </div>
            </div>

            <div className="min-w-[4.5rem] text-center">
              <p className="text-2xl font-semibold">{pacing.remaining}</p>
              <p className="text-xs text-muted">remaining</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                pacing.onPace
                  ? "bg-accent/15 text-accent"
                  : "bg-amber-500/15 text-amber-300"
              }`}
            >
              {pacing.onPace ? "✓ On pace" : "Behind pace"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
              {pacing.vsBaselinePct >= 0 ? "↓" : "↑"}{" "}
              {Math.abs(pacing.vsBaselinePct)}%{" "}
              {pacing.vsBaselinePct >= 0 ? "below" : "above"} baseline
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-card px-4 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted">
              Next pacing window
            </p>
            <p className="mt-0.5 text-xl font-semibold">
              {pacing.nextWindowLabel}
            </p>
          </div>
          <p className="max-w-[40%] text-right text-sm text-muted">
            {pacing.waitMinutes != null
              ? `Try to wait ${pacing.waitMinutes} min`
              : "Protect your remaining budget"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleLogPuff}
            disabled={loggingPuff}
            className="flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
          >
            <span className="text-lg leading-none">+</span>
            {loggingPuff ? "Logging…" : "Log a puff"}
          </button>
          <button
            type="button"
            onClick={() => setCravingOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-4 text-sm font-medium transition hover:border-accent/40"
          >
            Log craving
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-white/8 bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Your curve</p>
            <div className="flex gap-3 text-[10px] text-muted">
              <span>Baseline · dashed</span>
              <span className="text-accent">Today</span>
            </div>
          </div>
          <DayPacingChart
            today={pacing.hourlyCumulative}
            baseline={pacing.hourlyBaseline}
            maxY={Math.max(pacing.baselinePuffs, pacing.todayTarget)}
          />
          <p className="mt-2 text-center text-xs text-muted">
            {STATUS_LABELS[stats.status]} · Day {stats.currentDay}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { value: String(stats.cravingsManaged), label: "cravings" },
            { value: `$${stats.moneySaved}`, label: "saved" },
            { value: `Day ${stats.nextMilestoneDay}`, label: "next goal" },
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

        <p className="mt-8 text-center text-xs text-white/30">
          {user
            ? cloudSynced
              ? `Synced as ${user.name}`
              : `Signed in as ${user.name}`
            : "Guest mode · puffs saved on this device"}
        </p>
      </main>

      <CravingLogModal open={cravingOpen} onClose={() => setCravingOpen(false)} />
      <CheckInModal open={checkInOpen} onClose={() => setCheckInOpen(false)} />
    </div>
  );
}
