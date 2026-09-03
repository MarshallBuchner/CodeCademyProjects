"use client";

import Image from "next/image";
import { Wordmark } from "@/components/Logo";
import { useMoment } from "@/context/MomentProvider";

export function Welcome() {
  const { dismissWelcome, seedDemo } = useMoment();

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background">
      {/* Hero — full-bleed dock sunset, brand first */}
      <section className="relative flex min-h-dvh flex-col justify-end overflow-hidden">
        <Image
          src="/branding/hero-dock.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />

        <div className="relative z-10 flex flex-col items-center px-6 pb-14 pt-24 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/logo-pin.jpg"
            alt=""
            className="h-20 w-20 rounded-2xl object-cover shadow-[0_0_40px_rgba(255,138,42,0.45)]"
          />
          <Wordmark className="mt-6 text-4xl text-foreground sm:text-5xl" />
          <p className="mt-4 max-w-sm text-balance text-lg leading-relaxed text-foreground/90">
            Leave something behind. Unlock it when you return.
          </p>
          <p className="mt-2 font-display text-base tracking-wide text-accent">
            Make the moment last forever.
          </p>

          <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
            <button type="button" className="btn-primary" onClick={dismissWelcome}>
              Get Started
            </button>
            <button
              type="button"
              className="btn-ghost border-white/20 bg-black/30 backdrop-blur-sm"
              onClick={() => void seedDemo()}
            >
              Load demo Moments
            </button>
          </div>

          <a
            href="#tradition"
            className="mt-12 text-[11px] tracking-[0.28em] text-foreground/70 uppercase transition hover:text-accent"
          >
            Why it lasts ↓
          </a>
        </div>
      </section>

      {/* Tradition story — family dock */}
      <section id="tradition" className="relative border-t border-white/8">
        <div className="relative mx-auto max-w-md overflow-hidden">
          <div className="relative h-72 w-full">
            <Image
              src="/branding/hero-tradition.jpg"
              alt=""
              fill
              className="object-cover object-[center_30%]"
              sizes="(max-width: 448px) 100vw, 448px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
          <div className="relative -mt-16 px-6 pb-16 text-center">
            <p className="text-xs tracking-[0.28em] text-accent uppercase">
              Start a tradition
            </p>
            <h2 className="font-display mt-3 text-3xl leading-snug tracking-wide text-balance">
              Every year we come back here. Every year we open the MOMENT we left
              behind.
            </h2>
            <p className="mt-4 text-sm text-muted">
              Come back. Open the past. Leave something for the future.
            </p>
          </div>
        </div>
      </section>

      {/* Legacy — grandpa & kid */}
      <section className="relative border-t border-white/8">
        <div className="relative mx-auto max-w-md overflow-hidden">
          <div className="relative h-80 w-full">
            <Image
              src="/branding/hero-legacy.jpg"
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 448px) 100vw, 448px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent" />
          </div>
          <div className="relative -mt-20 px-6 pb-16 text-center">
            <h2 className="font-display text-3xl leading-snug tracking-wide text-balance">
              Some moments deserve to be found again.
            </h2>
            <p className="mt-3 text-sm text-muted">
              Leave a message for the people you love.
            </p>
          </div>
        </div>
      </section>

      {/* Private share — couples overlook */}
      <section className="relative border-t border-white/8">
        <div className="relative mx-auto max-w-md overflow-hidden">
          <div className="relative h-72 w-full">
            <Image
              src="/branding/hero-private.jpg"
              alt=""
              fill
              className="object-cover object-[center_25%]"
              sizes="(max-width: 448px) 100vw, 448px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/45 to-transparent" />
          </div>
          <div className="relative -mt-16 px-6 pb-14 text-center">
            <p className="text-xs tracking-[0.28em] text-accent uppercase">
              Private by design
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-wide">
              Only they can unlock it.
            </h2>
            <p className="mt-3 text-sm text-muted">
              Send a private MOMENT that opens only at the right place.
            </p>
          </div>
        </div>
      </section>

      {/* Use cases — from new marketing set */}
      <section className="border-t border-white/8 px-6 pb-16 pt-14">
        <div className="mx-auto max-w-md">
          <p className="text-center text-xs tracking-[0.28em] text-accent uppercase">
            Made for what matters
          </p>
          <h2 className="font-display mt-3 text-center text-3xl tracking-wide text-balance">
            Anniversary. Trip. Proposal. Team. Future you.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {[
              {
                src: "/branding/hero-anniversary.jpg",
                label: "Anniversary",
                line: "For the place we first met.",
              },
              {
                src: "/branding/hero-trip.jpg",
                label: "Trips",
                line: "Leave a piece of the trip behind.",
              },
              {
                src: "/branding/hero-proposal.jpg",
                label: "Proposals",
                line: "A proposal they’ll never forget.",
              },
              {
                src: "/branding/hero-team.jpg",
                label: "Teams",
                line: "Every season deserves a MOMENT.",
              },
              {
                src: "/branding/hero-future.jpg",
                label: "Future you",
                line: "Leave something for the person you’re becoming.",
              },
            ].map((item) => (
              <li
                key={item.label}
                className="relative overflow-hidden rounded-[22px] border border-white/10"
              >
                <div className="relative h-36 w-full">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 448px) 100vw, 448px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
                  <p className="text-[11px] tracking-[0.22em] text-accent uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 font-display text-xl tracking-wide text-foreground">
                    {item.line}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features + CTA */}
      <section className="border-t border-white/8 px-6 pb-20 pt-14">
        <div className="mx-auto max-w-md">
          <ul className="grid grid-cols-2 gap-4 text-center">
            {[
              { title: "Location-locked", body: "Only opens at the right place." },
              { title: "Private or shared", body: "Just for you or who you choose." },
              { title: "Photo, video, notes", body: "Capture what matters most." },
              { title: "Meaningful by design", body: "Moments that anchor your story." },
            ].map((f) => (
              <li
                key={f.title}
                className="rounded-[20px] border border-white/8 bg-card/60 px-3 py-4"
              >
                <p className="text-sm font-medium text-foreground">{f.title}</p>
                <p className="mt-1 text-xs text-muted">{f.body}</p>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn-primary mt-10 w-full"
            onClick={dismissWelcome}
          >
            Start a tradition
          </button>
          <p className="mt-6 text-center text-[10px] tracking-[0.28em] text-muted/80 uppercase">
            Be present. Leave legacy. Meet yourself there.
          </p>
        </div>
      </section>
    </main>
  );
}
