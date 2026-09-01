"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { NicotineCurveChart } from "./NicotineCurveChart";
import { OnboardingFlow } from "./OnboardingFlow";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#your-plan", label: "Your plan" },
  { href: "#progress", label: "Progress" },
  { href: "#resources", label: "Resources" },
];

export function Navbar({ onStartPlan }: { onStartPlan: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
          </span>
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/5 px-5 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-muted"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onStartPlan();
            }}
            className="mt-3 w-full rounded-full bg-accent py-3 text-sm font-semibold text-background"
          >
            Build my quit plan
          </button>
        </nav>
      )}
    </header>
  );
}

export function LandingPage() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  return (
    <>
      <Navbar onStartPlan={() => setOnboardingOpen(true)} />
      <main>
        <Hero onStartPlan={() => setOnboardingOpen(true)} />
        <HowItWorks />
        <ProgressSection />
        <NicotineCurvePreview />
        <CTASection onStartPlan={() => setOnboardingOpen(true)} />
      </main>
      <Footer />
      <OnboardingFlow
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </>
  );
}

function Hero({ onStartPlan }: { onStartPlan: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(94,233,181,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent">
              <span aria-hidden>✦</span> Your personal vape quit coach
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Quit vaping.{" "}
              <span className="text-accent">Keep your momentum.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              A personalized step-down plan that adapts when life happens—so one
              slip never means starting over.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onStartPlan}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-dim"
              >
                Build my quit plan
                <span aria-hidden>→</span>
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-foreground transition hover:border-white/30"
              >
                See how it works
              </a>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span>🛡 Private by design</span>
              <span className="hidden sm:inline">•</span>
              <span>No shame</span>
              <span className="hidden sm:inline">•</span>
              <span>Built for real progress</span>
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative rounded-[2.5rem] border border-white/10 bg-card p-3 shadow-2xl shadow-accent/5">
      <div className="overflow-hidden rounded-[2rem] bg-surface">
        <div className="border-b border-white/5 px-5 py-4">
          <p className="text-xs text-muted">Good evening, Alex</p>
          <p className="text-lg font-semibold">Week 3 of 8</p>
        </div>
        <div className="space-y-4 p-5">
          <div className="rounded-2xl border border-white/5 bg-card p-4">
            <div className="mb-1 flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-accent">42%</p>
                <p className="text-xs text-muted">less nicotine</p>
              </div>
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                On track
              </span>
            </div>
            <NicotineCurveChart compact />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { value: "23", label: "cravings" },
              { value: "$86", label: "saved" },
              { value: "Day 28", label: "next goal" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/5 bg-card px-2 py-3"
              >
                <p className="text-sm font-semibold text-accent">{stat.value}</p>
                <p className="text-[10px] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/5 bg-card px-4 py-3 text-center text-xs text-muted">
            You&apos;re building something better every day.{" "}
            <span className="text-accent">Stay consistent.</span>
          </div>
          <div className="rounded-full bg-accent py-3 text-center text-sm font-semibold text-background">
            + Log a craving
          </div>
        </div>
      </div>
      <div className="absolute -right-4 top-1/4 rounded-2xl border border-white/10 bg-card px-4 py-3 shadow-lg">
        <p className="text-lg font-bold text-accent">$86</p>
        <p className="text-xs text-muted">saved</p>
      </div>
      <div className="absolute -left-2 bottom-1/4 rounded-2xl border border-white/10 bg-card px-4 py-3 shadow-lg">
        <p className="text-lg font-bold text-accent">7 day</p>
        <p className="text-xs text-muted">streak</p>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Tell us where you're at",
      body: "Answer a short intake about your device, nicotine level, habits, triggers, and quit goal.",
      icon: "◎",
    },
    {
      num: "02",
      title: "Get your QuitCurve",
      body: "Receive a realistic step-down schedule with daily targets, craving tools, and milestones.",
      icon: "🧠",
    },
    {
      num: "03",
      title: "Adapt without restarting",
      body: "Had a difficult day? QuitCurve adjusts the path while protecting the progress you've made.",
      icon: "⏱",
    },
  ];

  return (
    <section id="how-it-works" className="px-5 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">
          A plan that bends, not breaks
        </p>
        <h2 className="text-3xl font-bold leading-tight md:text-4xl">
          Quitting isn&apos;t linear. Your plan shouldn&apos;t be either.
        </h2>
        <div className="mt-10 space-y-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-2xl border border-white/8 bg-card p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-sm text-white/20">{step.num}</span>
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgressSection() {
  const features = [
    "Daily targets that feel achievable",
    "A one-tap craving check-in",
    "Plans that adjust after a slip",
    "Milestones worth celebrating",
  ];

  return (
    <section id="progress" className="px-5 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">
          Your curve, your pace
        </p>
        <h2 className="text-3xl font-bold leading-tight md:text-4xl">
          See progress you can actually feel.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          QuitCurve turns an overwhelming goal into the next small decision.
          Track less nicotine, fewer cravings, more money saved, and the time
          you&apos;re taking back.
        </p>
        <ul className="mt-8 space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs text-accent">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NicotineCurvePreview() {
  return (
    <section id="your-plan" className="px-5 pb-16 md:pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-white/8 bg-card p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted">Your nicotine curve</p>
              <p className="text-lg font-semibold">8-week steady plan</p>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              On track
            </span>
          </div>
          <NicotineCurveChart />
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { value: "42%", label: "less nicotine" },
              { value: "23", label: "cravings logged" },
              { value: "$86", label: "money saved" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/5 bg-surface px-3 py-4"
              >
                <p className="text-xl font-bold text-accent">{stat.value}</p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ onStartPlan }: { onStartPlan: () => void }) {
  return (
    <section id="resources" className="px-5 pb-20 md:pb-28">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-white/8 bg-card p-8 text-center md:p-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">
            Ready when you are
          </p>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            You don&apos;t need another perfect Monday.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Start with where you are today. Your first personalized plan takes
            about 60 seconds.
          </p>
          <button
            type="button"
            onClick={onStartPlan}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-background transition hover:bg-accent-dim"
          >
            Build my quit plan
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Logo />
        <p className="mt-4 max-w-md text-xs leading-relaxed text-muted">
          QuitCurve supports behaviour change and does not replace professional
          medical advice.
        </p>
        <p className="mt-6 text-xs text-white/30">© 2026 QuitCurve</p>
      </div>
    </footer>
  );
}
