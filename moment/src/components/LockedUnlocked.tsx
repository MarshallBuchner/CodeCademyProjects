"use client";

import { useMemo, useRef, useState } from "react";
import { JourneyMap } from "@/components/Maps";
import { MomentOverflowMenu } from "@/components/MomentOverflowMenu";
import { ShareMomentModal } from "@/components/ShareMomentModal";
import { useMoment } from "@/context/MomentProvider";
import { formatDistance } from "@/lib/geo";
import { formatShortDate } from "@/lib/format";

export function LockedView() {
  const {
    activeMoment,
    distanceToActive,
    setView,
    simulateArrival,
    refreshLocation,
    locationError,
    userCoords,
    deleteMoment,
  } = useMoment();
  const [shareOpen, setShareOpen] = useState(false);

  if (!activeMoment) {
    return (
      <main className="grid min-h-dvh place-items-center px-5">
        <button type="button" className="btn-primary" onClick={() => setView("home")}>
          Back home
        </button>
      </main>
    );
  }

  const distLabel =
    distanceToActive != null ? formatDistance(distanceToActive) : "…";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-muted"
          onClick={() => setView("home")}
        >
          ← Your Moments
        </button>
        <MomentOverflowMenu
          momentTitle={activeMoment.title}
          onDelete={() => deleteMoment(activeMoment.id)}
        />
      </div>

      {activeMoment.annualTradition ? (
        <span className="inline-flex self-start rounded-full border border-accent/45 bg-accent/15 px-3 py-1 text-[11px] tracking-[0.2em] text-accent uppercase">
          Last year
        </span>
      ) : (
        <p className="text-xs tracking-[0.22em] text-accent uppercase">Not there yet</p>
      )}
      <h1 className="font-display mt-2 text-3xl tracking-wide">
        {activeMoment.annualTradition
          ? "Come back to open."
          : "This Moment opens when you arrive."}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {activeMoment.title}
        {activeMoment.createdAt
          ? ` · ${formatShortDate(activeMoment.createdAt)}`
          : ""}
      </p>

      <JourneyMap
        user={userCoords}
        target={activeMoment.coords}
        className="mt-5 h-[300px]"
        unlocked={false}
      />

      <div className="mt-6 text-center">
        <p className="font-display text-4xl tracking-wide text-accent glow-text">
          {distLabel} away
        </p>
        <p className="mt-2 text-sm text-muted">
          {activeMoment.annualTradition
            ? "Locked here. Come back to open."
            : "Keep going…"}
        </p>
        {activeMoment.timeLocked && activeMoment.unlockAt && (
          <p className="mt-2 text-xs text-muted">
            {activeMoment.annualTradition
              ? `Yearly tradition — sealed until ${formatShortDate(activeMoment.unlockAt)}`
              : `Also locked until ${formatShortDate(activeMoment.unlockAt)}`}
          </p>
        )}
        {locationError && (
          <p className="mt-2 text-xs text-amber-300/90">{locationError}</p>
        )}
      </div>

      <button
        type="button"
        className="mt-6 flex items-center justify-between rounded-[22px] border border-white/8 bg-card px-4 py-4 text-left"
        onClick={() => void refreshLocation()}
      >
        <span>
          <span className="block text-xs tracking-wide text-muted uppercase">
            Destination
          </span>
          <span className="text-sm font-medium">{activeMoment.placeName}</span>
        </span>
        <span className="text-muted">›</span>
      </button>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => setShareOpen(true)}
        >
          Send to someone
        </button>
        <button type="button" className="btn-ghost w-full" onClick={simulateArrival}>
          Simulate arrival (demo)
        </button>
      </div>

      <ShareMomentModal
        moment={activeMoment}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </main>
  );
}

export function UnlockedView() {
  const {
    activeMoment,
    setView,
    saveMomentKeep,
    continueTradition,
    deleteMoment,
  } = useMoment();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const voice = useMemo(
    () => activeMoment?.media.find((m) => m.kind === "voice"),
    [activeMoment],
  );
  const photo = useMemo(
    () => activeMoment?.media.find((m) => m.kind === "photo"),
    [activeMoment],
  );
  const video = useMemo(
    () => activeMoment?.media.find((m) => m.kind === "video"),
    [activeMoment],
  );

  if (!activeMoment) {
    return (
      <main className="grid min-h-dvh place-items-center px-5">
        <button type="button" className="btn-primary" onClick={() => setView("home")}>
          Back home
        </button>
      </main>
    );
  }

  function togglePlay() {
    if (!voice || !audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      void audioRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-muted"
          onClick={() => setView("home")}
        >
          ← Your Moments
        </button>
        <MomentOverflowMenu
          momentTitle={activeMoment.title}
          onDelete={() => deleteMoment(activeMoment.id)}
        />
      </div>

      {activeMoment.annualTradition ? (
        <span className="inline-flex self-start rounded-full border border-accent/45 bg-accent/15 px-3 py-1 text-[11px] tracking-[0.2em] text-accent uppercase">
          Today
        </span>
      ) : (
        <p className="text-xs tracking-[0.22em] text-accent uppercase">You&apos;ve arrived</p>
      )}
      <h1 className="font-display mt-2 text-3xl tracking-wide">
        {activeMoment.annualTradition
          ? "Welcome back. This Moment is ready."
          : "This Moment is for you."}
      </h1>

      <div className="mx-auto mt-6 grid h-16 w-16 place-items-center rounded-full border border-accent/50 bg-accent/15 text-accent gift-glow">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>

      <article className="mt-6 rounded-[24px] border border-accent/35 bg-card/90 p-5 shadow-[0_0_40px_rgba(255,138,42,0.12)]">
        <p className="text-xs tracking-[0.22em] text-accent/80 uppercase">
          {activeMoment.annualTradition ? "Annual Moment" : "From you to you"}
        </p>
        <h2 className="mt-2 font-medium text-foreground">{activeMoment.title}</h2>
        <p className="mt-1 text-xs text-muted">{activeMoment.placeName}</p>
        {activeMoment.note && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {activeMoment.note}
          </p>
        )}

        {voice && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/30 px-3 py-3">
            <button
              type="button"
              onClick={togglePlay}
              className="grid h-10 w-10 place-items-center rounded-full bg-accent text-black"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <div className="waveform flex h-8 flex-1 items-end gap-0.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-accent/80"
                  style={{ height: `${8 + ((i * 13) % 20)}px` }}
                />
              ))}
            </div>
            <span className="text-xs text-muted">
              {voice.durationSeconds != null ? `0:${String(voice.durationSeconds).padStart(2, "0")}` : "audio"}
            </span>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
              ref={audioRef}
              src={voice.payload}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.payload}
            alt=""
            className="mt-4 h-36 w-full rounded-2xl object-cover"
          />
        )}

        {video && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={video.payload}
            controls
            playsInline
            className="mt-4 h-44 w-full rounded-2xl object-cover bg-black"
          />
        )}
      </article>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        {activeMoment.annualTradition && (
          <div className="rounded-[22px] border border-accent/40 bg-accent/10 px-4 py-4">
            <p className="text-sm font-medium text-foreground">
              Create next year&apos;s MOMENT?
            </p>
            <p className="mt-1 text-xs text-muted">
              Same place. New chapter. Keep the tradition looping.
            </p>
            <button
              type="button"
              className="btn-primary mt-4 w-full"
              onClick={() => continueTradition(activeMoment)}
            >
              Leave next year&apos;s Moment
            </button>
          </div>
        )}
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => setShareOpen(true)}
        >
          Send to someone
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-ghost flex-1"
            onClick={() => {
              saveMomentKeep(activeMoment.id);
              setView("home");
            }}
          >
            Save this moment
          </button>
          <button
            type="button"
            aria-label="Bookmark"
            className="grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-card text-accent"
            onClick={() => saveMomentKeep(activeMoment.id)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
            </svg>
          </button>
        </div>
      </div>

      <ShareMomentModal
        moment={activeMoment}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </main>
  );
}
