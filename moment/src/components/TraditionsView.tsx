"use client";

import { useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useMoment } from "@/context/MomentProvider";
import { formatShortDate, relativeTime } from "@/lib/format";

export function TraditionsView() {
  const { moments, openMoment, startDrop } = useMoment();

  const traditions = useMemo(() => {
    const annual = moments.filter((m) => m.annualTradition);
    const byPlace = new Map<string, typeof annual>();
    for (const m of annual) {
      const key = `${m.placeName}|${m.coords.lat.toFixed(3)},${m.coords.lng.toFixed(3)}`;
      const list = byPlace.get(key) ?? [];
      list.push(m);
      byPlace.set(key, list);
    }
    return Array.from(byPlace.entries()).map(([key, chain]) => ({
      key,
      placeName: chain[0].placeName,
      placeSubtitle: chain[0].placeSubtitle,
      chain: chain.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    }));
  }, [moments]);

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-28 pt-8">
        <p className="text-xs tracking-[0.28em] text-accent uppercase">
          Annual Moments
        </p>
        <h1 className="font-display mt-1 text-3xl tracking-wide">Traditions</h1>
        <p className="mt-2 text-sm text-muted">
          Come back. Open the past. Leave something for the future.
        </p>

        {traditions.length === 0 ? (
          <div className="mt-10 flex flex-1 flex-col items-center justify-center rounded-[28px] border border-dashed border-white/12 bg-card/40 px-6 py-16 text-center">
            <p className="font-display text-xl tracking-wide">No traditions yet</p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Drop your first Annual Moment — come back next year and open it together.
              The tradition grows with every visit.
            </p>
            <button
              type="button"
              className="btn-primary mt-8 w-full"
              onClick={startDrop}
            >
              Start a tradition
            </button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-8">
            {traditions.map((t) => (
              <section
                key={t.key}
                className="rounded-[24px] border border-white/8 bg-card/80 p-4"
              >
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground">
                    {t.placeName}
                  </p>
                  {t.placeSubtitle && (
                    <p className="text-xs text-muted">{t.placeSubtitle}</p>
                  )}
                  <p className="mt-1 text-xs text-accent">
                    {t.chain.length} {t.chain.length === 1 ? "chapter" : "chapters"}
                  </p>
                </div>

                <ol className="relative border-l border-accent/30 pl-5">
                  {t.chain.map((m, i) => {
                    const year = new Date(m.createdAt).getFullYear();
                    const unlocked = Boolean(m.unlockedAt);
                    return (
                      <li key={m.id} className="relative mb-6 last:mb-0">
                        <span
                          className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 ${
                            unlocked
                              ? "border-accent bg-accent/70"
                              : "border-muted bg-card"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => openMoment(m.id)}
                          className="w-full text-left"
                        >
                          <p className="text-xs tracking-[0.18em] text-accent uppercase">
                            Year {i + 1} · {year}
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-foreground">
                            {m.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted">
                            {unlocked
                              ? `Opened ${relativeTime(m.unlockedAt!)}`
                              : m.unlockAt
                                ? `Sealed until ${formatShortDate(m.unlockAt)}`
                                : "Locked — return to unlock"}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <button
                  type="button"
                  className="btn-ghost mt-4 w-full text-sm"
                  onClick={startDrop}
                >
                  + Add next year&apos;s chapter
                </button>
              </section>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
