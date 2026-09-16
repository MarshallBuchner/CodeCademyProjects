"use client";

import { BottomNav } from "@/components/BottomNav";
import { MomentOverflowMenu } from "@/components/MomentOverflowMenu";
import { MomentThumb } from "@/components/MomentThumb";
import { useMoment } from "@/context/MomentProvider";
import { distanceMeters, formatDistance } from "@/lib/geo";
import { formatShortDate, relativeTime } from "@/lib/format";

export function Home() {
  const { moments, startDrop, openMoment, userCoords, seedDemo, deleteMoment } =
    useMoment();

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
              Drop a picture, video, or message at a place that matters — then come
              back next year and open it together.
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
                <li
                  key={m.id}
                  className="flex items-center gap-1 rounded-[22px] border border-white/8 bg-card/80 p-2.5 pr-1.5 transition hover:border-accent/35 hover:bg-card"
                >
                  <button
                    type="button"
                    onClick={() => openMoment(m.id)}
                    className="group flex min-w-0 flex-1 items-center gap-3 p-1 text-left"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface">
                      <MomentThumb media={m.media} />
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
                        {m.receivedFrom
                          ? m.unlockedAt
                            ? `From ${m.receivedFrom} · unlocked`
                            : `From ${m.receivedFrom}`
                          : m.annualTradition
                          ? m.unlockedAt
                            ? `Tradition opened · ${relativeTime(m.unlockedAt)}`
                            : `Yearly tradition · opens ${m.unlockAt ? formatShortDate(m.unlockAt) : "next year"}`
                          : unlocked
                            ? `Unlocked · ${relativeTime(m.unlockedAt!)}`
                            : dist != null
                              ? `${formatDistance(dist)} away`
                              : "Location locked"}
                      </p>
                    </div>
                  </button>
                  <MomentOverflowMenu
                    momentTitle={m.title}
                    onDelete={() => deleteMoment(m.id)}
                  />
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
