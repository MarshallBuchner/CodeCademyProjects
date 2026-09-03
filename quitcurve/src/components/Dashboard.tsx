"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckInModal } from "./CheckInModal";
import { CravingLogModal } from "./CravingLogModal";
import { Logo } from "./Logo";
import { NicotineCurveChart } from "./NicotineCurveChart";
import { OnboardingFlow } from "./OnboardingFlow";
import { useQuitCurve } from "@/context/QuitCurveProvider";
import { getPaceLabel, STATUS_LABELS } from "@/lib/curve";
import { getTimeGreeting } from "@/lib/greeting";

export function Dashboard() {
  const router = useRouter();
  const { user, plan, stats, todayCheckIn, logout, cloudSynced } = useQuitCurve();
  const [cravingOpen, setCravingOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!plan || !stats) {
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

        <div className="mt-6 rounded-2xl border border-white/8 bg-card p-5">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="text-4xl font-bold text-accent">
                {stats.nicotineReductionPct}%
              </p>
              <p className="text-sm text-muted">less nicotine</p>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {STATUS_LABELS[stats.status]}
            </span>
          </div>
          <NicotineCurveChart points={stats.curvePoints} />
          <p className="mt-3 text-center text-xs text-muted">
            Today&apos;s target: {stats.todayTargetPct}% of baseline
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

        <div className="mt-4 rounded-2xl border border-white/5 bg-card px-5 py-4 text-center text-sm text-muted">
          {stats.status === "adapting" ? (
            <>
              Life happened — your curve is{" "}
              <span className="text-accent">adapting</span>, not resetting.
              You&apos;ve got this.
            </>
          ) : (
            <>
              You&apos;re building something better every day.{" "}
              <span className="text-accent">Stay consistent.</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCravingOpen(true)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-semibold text-background transition hover:bg-accent-dim"
        >
          <span className="text-lg leading-none">+</span>
          Log a craving
        </button>

        <p className="mt-8 text-center text-xs text-white/30">
          Day {stats.currentDay} •{" "}
          {user
            ? cloudSynced
              ? `Synced as ${user.name}`
              : `Signed in as ${user.name}`
            : "Guest mode"}
        </p>
      </main>

      <CravingLogModal open={cravingOpen} onClose={() => setCravingOpen(false)} />
      <CheckInModal open={checkInOpen} onClose={() => setCheckInOpen(false)} />
    </div>
  );
}
