"use client";

import { BottomNav } from "@/components/BottomNav";
import { useMoment } from "@/context/MomentProvider";
import { distanceMeters, formatDistance } from "@/lib/geo";
import { relativeTime } from "@/lib/format";

export function Home() {
  const { moments, startDrop, openMoment, userCoords, seedDemo } = useMoment();

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-28 pt-8">
        <header className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] text-muted uppercase">MOMENT</p>
            <h1 className="font-display mt-1 text-3xl tracking-wide">Your Moments</h1>
          </div>
          <button
            type="button"
            aria-label="Drop a Moment"
            onClick={startDrop}
            className="grid h-11 w-11 place-items-center rounded-full border border-accent/40 bg-accent/15 text-accent shadow-[0_0_20px_rgba(255,138,42,0.25)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </header>

        {moments.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-[28px] border border-dashed border-white/12 bg-card/40 px-6 py-16 text-center">
            <p className="font-display text-xl tracking-wide">Nothing left yet</p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Drop your first Moment at a place that matters — a picture, video, or written message.
            </p>
            <button type="button" className="btn-primary mt-8 w-full" onClick={startDrop}>
              + Drop a Moment
            </button>
            <button
              type="button"
              className="btn-ghost mt-3 w-full"
              onClick={() => void seedDemo()}
            >
              Try with demo Moments
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {moments.map((m) => {
              const dist =
                userCoords != null
                  ? distanceMeters(userCoords, m.coords)
                  : null;
              const unlocked = Boolean(m.unlockedAt);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => openMoment(m.id)}
                    className="group flex w-full items-center gap-4 rounded-[22px] border border-white/8 bg-card/80 p-3.5 text-left transition hover:border-accent/35 hover:bg-card"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface">
                      {m.media.find((x) => x.kind === "photo") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.media.find((x) => x.kind === "photo")!.payload}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : m.media.find((x) => x.kind === "video") ? (
                        <div className="relative h-full w-full bg-black">
                          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                          <video
                            src={m.media.find((x) => x.kind === "video")!.payload}
                            className="h-full w-full object-cover opacity-80"
                            muted
                            playsInline
                          />
                          <span className="absolute inset-0 grid place-items-center text-accent text-xs">
                            ▶
                          </span>
                        </div>
                      ) : (
                        <div className="grid h-full w-full place-items-center text-accent/80">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                        </div>
                      )}
                      <span
                        className={`absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border ${
                          unlocked
                            ? "border-accent/50 bg-accent/20 text-accent"
                            : "border-white/15 bg-black/55 text-muted"
                        }`}
                      >
                        {unlocked ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        ) : (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="11" width="14" height="10" rx="2" />
                            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                          </svg>
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{m.title}</p>
                      <p className="mt-0.5 truncate text-sm text-muted">{m.placeName}</p>
                      <p className="mt-1 text-xs text-muted/80">
                        {unlocked
                          ? `Unlocked · ${relativeTime(m.unlockedAt!)}`
                          : dist != null
                            ? `${formatDistance(dist)} away`
                            : "Location locked"}
                      </p>
                    </div>
                    <span className="text-muted/60 group-hover:text-accent">›</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-10 mx-auto flex max-w-md justify-center px-5">
        <button
          type="button"
          onClick={startDrop}
          className="pointer-events-auto btn-primary w-full max-w-sm shadow-[0_12px_40px_rgba(255,106,0,0.35)]"
        >
          + Drop a Moment
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
