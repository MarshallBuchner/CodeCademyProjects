"use client";

import { Logo, Wordmark } from "@/components/Logo";
import { useMoment } from "@/context/MomentProvider";

export function Welcome() {
  const { dismissWelcome, seedDemo } = useMoment();

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <div className="city-glow pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-16 text-center">
        <Logo size={88} />
        <Wordmark className="mt-8 text-4xl sm:text-5xl" />
        <p className="mt-5 max-w-sm text-balance text-lg leading-relaxed text-foreground/85">
          Leave something behind. Unlock it when you return.
        </p>
        <p className="mt-4 text-xs tracking-[0.22em] text-muted uppercase">
          Location-locked · Private · Picture, video & messages
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
      </div>

      <p className="relative z-10 px-6 pb-8 text-center text-[10px] tracking-[0.28em] text-muted/80 uppercase">
        Be present. Leave legacy. Meet yourself there.
      </p>
    </main>
  );
}
