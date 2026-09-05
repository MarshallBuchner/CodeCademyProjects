"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo, Wordmark } from "@/components/Logo";
import { useMoment } from "@/context/MomentProvider";

export function Welcome() {
  const { dismissWelcome, seedDemo } = useMoment();
  const [acceptedAge, setAcceptedAge] = useState(false);

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <div className="city-glow pointer-events-none absolute inset-0" />

      {/* Hero — brand first, uncluttered */}
      <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 pb-16 pt-16 text-center">
        <Logo size={88} />
        <Wordmark className="mt-8 text-4xl sm:text-5xl" />
        <p className="mt-5 max-w-sm text-balance text-lg leading-relaxed text-foreground/85">
          Leave something behind. Unlock it when you return.
        </p>
        <p className="mt-3 font-display text-lg tracking-wide text-accent/90">
          Make the moment last forever.
        </p>

        <label className="mt-10 flex max-w-sm cursor-pointer items-start gap-3 text-left text-sm text-muted">
          <input
            type="checkbox"
            checked={acceptedAge}
            onChange={(e) => setAcceptedAge(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-transparent accent-[var(--accent)]"
          />
          <span>
            I confirm I&apos;m 18+ and agree to the{" "}
            <Link href="/terms" className="text-accent underline-offset-2 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
          <button
            type="button"
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!acceptedAge}
            onClick={dismissWelcome}
          >
            Get Started
          </button>
          <button
            type="button"
            className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!acceptedAge}
            onClick={() => void seedDemo()}
          >
            Load demo Moments
          </button>
        </div>

        <a
          href="#forever"
          className="mt-14 text-[11px] tracking-[0.28em] text-muted uppercase transition hover:text-accent"
        >
          Why it lasts ↓
        </a>
      </section>

      <section
        id="forever"
        className="relative z-10 border-t border-white/8 px-6 pb-16 pt-16"
      >
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs tracking-[0.28em] text-accent uppercase">
            A tradition generator
          </p>
          <h2 className="font-display mt-4 text-3xl leading-snug tracking-wide text-balance">
            Come back. Open the past. Leave something for the future.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-foreground/80">
            Every summer, we come back here. Every summer, we open the MOMENT we
            left ourselves the year before.
          </p>

          <ul className="mt-10 space-y-4 text-left">
            {[
              {
                year: "Year 1",
                body: "Young kids at the cottage — leave a video on the dock.",
              },
              {
                year: "Year 2",
                body: "They return and unlock last year’s video together.",
              },
              {
                year: "Year 5",
                body: "Same dock. Kids older. A new Moment waiting.",
              },
              {
                year: "Year 10",
                body: "Family still returning — the story keeps growing.",
              },
            ].map((row) => (
              <li
                key={row.year}
                className="flex gap-4 border-l border-accent/35 pl-4"
              >
                <span>
                  <span className="block text-xs tracking-[0.18em] text-accent uppercase">
                    {row.year}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{row.body}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-pretty text-sm leading-relaxed text-foreground/75">
            Some places become part of your story. MOMENT helps you keep adding to
            it.
          </p>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/8 px-6 pb-20 pt-14">
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs tracking-[0.28em] text-accent uppercase">
            Annual Moments
          </p>
          <h2 className="font-display mt-3 text-2xl tracking-wide">
            Return here next year to unlock.
          </h2>
          <p className="mt-3 text-sm text-muted">
            After you open it — create next year’s MOMENT. The tradition loops.
          </p>

          <ul className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { title: "Location-locked", body: "Only opens at the right place." },
              { title: "Private or shared", body: "Just for you or who you choose." },
              { title: "Photo, video, notes", body: "Capture what matters most." },
              { title: "Built to return", body: "Moments that grow with you." },
            ].map((f) => (
              <li
                key={f.title}
                className="rounded-[20px] border border-white/8 bg-card/40 px-3 py-4"
              >
                <p className="text-sm font-medium text-foreground">{f.title}</p>
                <p className="mt-1 text-xs text-muted">{f.body}</p>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn-primary mt-10 w-full disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!acceptedAge}
            onClick={dismissWelcome}
          >
            Start a tradition
          </button>
          <p className="mt-6 text-[10px] tracking-[0.28em] text-muted/80 uppercase">
            Be present. Leave legacy. Meet yourself there.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
            <Link href="/support" className="hover:text-accent">
              Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
