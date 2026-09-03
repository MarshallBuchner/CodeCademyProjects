"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapCanvas } from "@/components/MapCanvas";
import { Logo, Wordmark } from "@/components/Logo";
import {
  distanceMeters,
  formatDistance,
  getCurrentPosition,
} from "@/lib/geo";
import {
  capsuleToLocalMoment,
  getInboxCapsule,
  rememberInbox,
  unsealCapsule,
  type SharedCapsule,
} from "@/lib/share";
import { UNLOCK_RADIUS_METERS, type Coords } from "@/lib/types";

type Phase = "loading" | "pin" | "locked" | "unlocked" | "invalid";

export function SharedMomentClient({ shareId }: { shareId: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [capsule, setCapsule] = useState<SharedCapsule | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("k") ?? "";
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const sealed = new URLSearchParams(hash).get("d");

    let found: SharedCapsule | null = null;
    if (sealed) {
      found = unsealCapsule(sealed);
    }
    if (!found) {
      found = getInboxCapsule(shareId);
    }

    if (!found || found.shareId !== shareId || found.accessKey !== key) {
      setPhase("invalid");
      return;
    }

    rememberInbox(found);
    setCapsule(found);
    setPhase(found.passcode ? "pin" : "locked");
  }, [shareId]);

  useEffect(() => {
    if (phase !== "locked" && phase !== "unlocked") return;
    let alive = true;
    const tick = async () => {
      try {
        const coords = await getCurrentPosition();
        if (alive) {
          setUserCoords(coords);
          setLocationError(null);
        }
      } catch {
        if (alive) setLocationError("Need location to unlock this Moment");
      }
    };
    void tick();
    const id = window.setInterval(() => void tick(), 6000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [phase]);

  const distance = useMemo(() => {
    if (!capsule || !userCoords) return null;
    return distanceMeters(userCoords, capsule.coords);
  }, [capsule, userCoords]);

  const canUnlock = useMemo(() => {
    if (!capsule) return false;
    const now = Date.now();
    if (capsule.timeLocked && capsule.unlockAt) {
      if (now < new Date(capsule.unlockAt).getTime()) return false;
    }
    if (!capsule.locationLocked) return true;
    if (distance == null) return false;
    return distance <= UNLOCK_RADIUS_METERS;
  }, [capsule, distance]);

  useEffect(() => {
    if (phase === "locked" && canUnlock) setPhase("unlocked");
  }, [phase, canUnlock]);

  function submitPin() {
    if (!capsule?.passcode) {
      setPhase("locked");
      return;
    }
    if (pinInput.trim() !== capsule.passcode) {
      setPinError("That PIN doesn’t match. Ask the sender.");
      return;
    }
    setPinError(null);
    setPhase("locked");
  }

  function simulateArrival() {
    if (!capsule) return;
    setUserCoords({ ...capsule.coords });
    setPhase("unlocked");
  }

  if (phase === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  if (phase === "invalid" || !capsule) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <Logo size={64} />
        <h1 className="font-display mt-6 text-3xl tracking-wide">Link invalid</h1>
        <p className="mt-2 text-sm text-muted">
          This private Moment link is missing its key, was altered, or isn’t for this device.
        </p>
        <Link href="/" className="btn-primary mt-8 w-full">
          Open MOMENT
        </Link>
      </main>
    );
  }

  const voice = capsule.media.find((m) => m.kind === "voice");
  const photo = capsule.media.find((m) => m.kind === "photo");
  const moment = capsuleToLocalMoment(capsule);

  if (phase === "pin") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-10">
        <Logo size={56} />
        <Wordmark className="mt-5 text-2xl" />
        <h1 className="font-display mt-8 text-3xl tracking-wide">
          A Moment for {capsule.recipientName}
        </h1>
        <p className="mt-2 text-sm text-muted">
          From {capsule.senderName}. Enter the PIN they gave you to continue.
        </p>
        <input
          className="field mt-6 tracking-[0.35em]"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="••••"
          inputMode="numeric"
          autoFocus
        />
        {pinError && <p className="mt-2 text-sm text-amber-300">{pinError}</p>}
        <button type="button" className="btn-primary mt-6" onClick={submitPin}>
          Continue
        </button>
      </main>
    );
  }

  if (phase === "locked") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
        <p className="text-xs tracking-[0.22em] text-accent uppercase">Private Moment</p>
        <h1 className="font-display mt-1 text-3xl tracking-wide">
          For {capsule.recipientName}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {capsule.senderName} left this at {capsule.placeName}. It opens only when you arrive.
        </p>
        <MapCanvas mode="path" className="mt-5 h-[280px]" />
        <div className="mt-6 text-center">
          <p className="font-display text-4xl tracking-wide text-accent glow-text">
            {distance != null ? `${formatDistance(distance)} away` : "Locating…"}
          </p>
          <p className="mt-2 text-sm text-muted">Keep going…</p>
          {locationError && (
            <p className="mt-2 text-xs text-amber-300">{locationError}</p>
          )}
        </div>
        <div className="mt-6 rounded-[22px] border border-white/8 bg-card px-4 py-4">
          <p className="text-xs tracking-wide text-muted uppercase">Destination</p>
          <p className="text-sm font-medium">{capsule.placeName}</p>
          {capsule.placeSubtitle && (
            <p className="text-xs text-muted">{capsule.placeSubtitle}</p>
          )}
        </div>
        <button type="button" className="btn-ghost mt-auto" onClick={simulateArrival}>
          Simulate arrival (demo)
        </button>
      </main>
    );
  }

  // unlocked
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
      <p className="text-xs tracking-[0.22em] text-accent uppercase">You&apos;ve arrived</p>
      <h1 className="font-display mt-1 text-3xl tracking-wide">
        This Moment is for {capsule.recipientName}.
      </h1>
      <p className="mt-1 text-sm text-muted">Left by {capsule.senderName}</p>

      <div className="mx-auto mt-6 grid h-16 w-16 place-items-center rounded-full border border-accent/50 bg-accent/15 text-accent shadow-[0_0_30px_rgba(255,138,42,0.35)]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>

      <article className="mt-6 rounded-[24px] border border-accent/35 bg-card/90 p-5 shadow-[0_0_40px_rgba(255,138,42,0.12)]">
        <h2 className="font-medium">{moment.title}</h2>
        <p className="mt-1 text-xs text-muted">{moment.placeName}</p>
        {moment.note && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {moment.note}
          </p>
        )}
        {voice && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/30 px-3 py-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-accent text-black"
              onClick={() => {
                if (!audioRef.current) return;
                if (playing) {
                  audioRef.current.pause();
                  setPlaying(false);
                } else {
                  void audioRef.current.play();
                  setPlaying(true);
                }
              }}
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
      </article>

      <Link href="/" className="btn-primary mt-auto text-center">
        Open MOMENT app
      </Link>
    </main>
  );
}
