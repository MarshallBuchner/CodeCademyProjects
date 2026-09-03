"use client";

import { Logo, Wordmark } from "@/components/Logo";
import { useMoment } from "@/context/MomentProvider";

export function Welcome() {
  const { dismissWelcome, seedDemo } = useMoment();

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      <div className="city-glow pointer-events-none absolute inset-0" />

      {/* Hero — brand first */}
      <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 pb-16 pt-16 text-center">
        <Logo size={88} />
        <Wordmark className="mt-8 text-4xl sm:text-5xl" />
        <p className="mt-5 max-w-sm text-balance text-lg leading-relaxed text-foreground/85">
          Leave something behind. Unlock it when you return.
        </p>

        <div className="mt-12 flex w-full max-w-sm flex-col gap-3">
          <button type="button" className="btn-primary" onClick={dismissWelcome}>
            Get Started
          </button>
          <button
            type="button"
            className="btn-ghost"
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

      {/* Marketing story — yearly family return */}
      <section
        id="forever"
        className="relative z-10 border-t border-white/8 px-6 pb-20 pt-16"
      >
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs tracking-[0.28em] text-accent uppercase">
            Make it last forever
          </p>
          <h2 className="font-display mt-4 text-3xl leading-snug tracking-wide text-balance">
            Come back next year. Open what you left.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-foreground/80">
            Every year when you return to that cottage, that restaurant, that rink
            with your family — you open the Moment you left for yourselves the year
            before.
          </p>
          <p className="mt-4 font-display text-xl tracking-wide text-accent glow-text">
            Literally making the moment last forever.
          </p>

          <ol className="mt-10 space-y-5 text-left">
            {[
              {
                step: "01",
                title: "Leave it here",
                body: "Drop a picture, video, or message at a place that matters.",
              },
              {
                step: "02",
                title: "Lock until next year",
                body: "Set a yearly tradition — it stays sealed until you return.",
              },
              {
                step: "03",
                title: "Open it together",
                body: "Same people. Same place. A new chapter waiting.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <span className="font-display text-accent/90 text-lg tracking-wide">
                  {item.step}
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{item.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <button
            type="button"
            className="btn-primary mt-12 w-full"
            onClick={dismissWelcome}
          >
            Start a tradition
          </button>
        </div>
      </section>

      <p className="relative z-10 px-6 pb-10 text-center text-[10px] tracking-[0.28em] text-muted/80 uppercase">
        Be present. Leave legacy. Meet yourself there.
      </p>
    </main>
  );
}
