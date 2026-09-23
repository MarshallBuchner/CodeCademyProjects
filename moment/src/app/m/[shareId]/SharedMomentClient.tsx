"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MapSafeBoundary } from "@/components/MapSafeBoundary";
import { JourneyMap } from "@/components/Maps";
import { Logo, Wordmark } from "@/components/Logo";
import { OpenInBrowserBanner } from "@/components/OpenInBrowserBanner";
import { isInAppBrowser } from "@/lib/browser";
import {
  distanceMeters,
  formatDistance,
  watchPosition,
  withinUnlockRadius,
  type CoordsWithAccuracy,
} from "@/lib/geo";
import {
  capsuleToLocalMoment,
  fetchSealedShareLink,
  getInboxCapsule,
  rememberInbox,
  reportShareOpened,
  unsealCapsule,
  type SharedCapsule,
} from "@/lib/share";
import {
  findMomentByShareId,
  upsertReceivedMoment,
} from "@/lib/storage";
import { UNLOCK_RADIUS_METERS } from "@/lib/types";

type Phase = "loading" | "pin" | "locked" | "unlocked" | "invalid";

export function SharedMomentClient({ shareId }: { shareId: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [capsule, setCapsule] = useState<SharedCapsule | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<CoordsWithAccuracy | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const openedReportedRef = useRef(false);
  const inAppBrowser = useMemo(() => isInAppBrowser(), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const params = new URLSearchParams(window.location.search);
        const key = params.get("k") ?? "";
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;
        const sealedHash = new URLSearchParams(hash).get("d");

        let found: SharedCapsule | null = null;

        // Huge #d= payloads can OOM Safari before React paints
        if (sealedHash && sealedHash.length > 2_000_000) {
          if (!cancelled) setPhase("invalid");
          return;
        }
        if (sealedHash) {
          found = unsealCapsule(sealedHash);
          try {
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}${window.location.search}`,
            );
          } catch {
            /* ignore */
          }
        }

        if (!found && key) {
          const ids = Array.from(new Set([shareId, decodeURIComponent(shareId)]));
          for (const id of ids) {
            const sealed = await fetchSealedShareLink(id, key);
            if (!sealed || sealed.length > 2_000_000) continue;
            found = unsealCapsule(sealed);
            if (found) break;
          }
        }
        if (!found) found = getInboxCapsule(shareId);

        if (cancelled) return;

        if (!found || found.shareId !== shareId) {
          setPhase("invalid");
          return;
        }
        if (key && found.accessKey !== key) {
          setPhase("invalid");
          return;
        }

        try {
          rememberInbox(found);
        } catch {
          /* Safari private / quota */
        }
        setCapsule(found);
        setPhase(found.passcode ? "pin" : "locked");

        try {
          if (findMomentByShareId(found.shareId)) setSaveState("saved");
        } catch {
          /* ignore */
        }
      } catch {
        if (!cancelled) setPhase("invalid");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [shareId]);

  useEffect(() => {
    if (phase !== "loading") return;
    const id = window.setTimeout(() => setPhase("invalid"), 15_000);
    return () => window.clearTimeout(id);
  }, [phase]);

  // Defer map — Leaflet + GPS together can crash low-memory iPhones
  useEffect(() => {
    if (phase !== "locked") {
      setShowMap(false);
      return;
    }
    const id = window.setTimeout(() => setShowMap(true), 350);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "locked" && phase !== "unlocked") return;
    return watchPosition(
      (coords) => {
        setUserCoords(coords);
        setLocationError(null);
      },
      () => {
        setLocationError(
          inAppBrowser
            ? "Location blocked here — open this link in Safari or Chrome"
            : "Need location to unlock this Moment",
        );
      },
      { enableHighAccuracy: false, maximumAge: 5000, timeout: 20000 },
    );
  }, [phase, inAppBrowser]);

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
    return withinUnlockRadius(
      distance,
      UNLOCK_RADIUS_METERS,
      userCoords?.accuracy,
    );
  }, [capsule, distance, userCoords?.accuracy]);

  useEffect(() => {
    if (phase === "locked" && canUnlock) setPhase("unlocked");
  }, [phase, canUnlock]);

  // Read receipt: notify sender once when recipient unlocks (arrives)
  useEffect(() => {
    if (phase !== "unlocked" || !capsule || openedReportedRef.current) return;
    openedReportedRef.current = true;
    void reportShareOpened(capsule.shareId, capsule.accessKey);
  }, [phase, capsule]);

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

  function saveToMyMoments(unlocked: boolean) {
    if (!capsule) return;
    try {
      const record = capsuleToLocalMoment(capsule, { unlocked });
      upsertReceivedMoment(record);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  if (phase === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-6 text-center">
        <div>
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-accent/30" />
          <p className="mt-4 text-sm text-muted">Opening Moment…</p>
        </div>
      </div>
    );
  }

  if (phase === "invalid" || !capsule) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <Logo size={64} />
        <h1 className="font-display mt-6 text-3xl tracking-wide">Link invalid</h1>
        <p className="mt-2 text-sm text-muted">
          This private Moment link is missing its key, was altered, or isn&apos;t
          for this device. If you copied it from Messenger, try{" "}
          <span className="text-foreground/90">Open in Safari</span>, or ask them
          to resend with a fresh short link.
        </p>
        <Link href="/" className="btn-primary mt-8 w-full">
          Open MOMENT
        </Link>
      </main>
    );
  }

  const voice = capsule.media.find((m) => m.kind === "voice");
  const photo = capsule.media.find((m) => m.kind === "photo");
  const video = capsule.media.find((m) => m.kind === "video");
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
          {capsule.senderName} left this at {capsule.placeName}. It opens only when you
          arrive.
        </p>
        <OpenInBrowserBanner force={Boolean(locationError)} className="mt-4" />
        <MapSafeBoundary
          fallback={
            <div className="mt-5 grid h-[280px] place-items-center rounded-[28px] border border-white/8 bg-card px-4 text-center text-sm text-muted">
              Map couldn’t load on this device — keep walking toward{" "}
              <span className="text-foreground/90">{capsule.placeName}</span>.
            </div>
          }
        >
          {showMap ? (
            <JourneyMap
              user={userCoords}
              target={capsule.coords}
              className="mt-5 h-[280px]"
            />
          ) : (
            <div className="mt-5 grid h-[280px] place-items-center rounded-[28px] border border-white/8 bg-[#0a0b10] text-sm text-muted">
              Loading map…
            </div>
          )}
        </MapSafeBoundary>
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
        <button
          type="button"
          className="btn-ghost mt-4 w-full"
          onClick={() => saveToMyMoments(false)}
          disabled={saveState === "saved"}
        >
          {saveState === "saved"
            ? "Saved to My Moments"
            : "Save for later · open from MOMENT"}
        </button>
        {saveState === "error" && (
          <p className="mt-2 text-center text-xs text-amber-300">
            Couldn&apos;t save on this device. Try again.
          </p>
        )}
        <p className="mt-auto pt-6 text-center text-xs text-muted">
          This Moment unlocks when you arrive — location required.
        </p>
      </main>
    );
  }

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

        {voice && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/30 px-3 py-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-accent text-black"
              aria-label={playing ? "Pause voice message" : "Play voice message"}
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
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground/90">Voice message</p>
              <div className="waveform mt-1.5 flex h-6 items-end gap-0.5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-accent/80"
                    style={{ height: `${8 + ((i * 13) % 20)}px` }}
                  />
                ))}
              </div>
            </div>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
              ref={audioRef}
              src={voice.payload}
              preload="metadata"
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        {moment.note && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {moment.note}
          </p>
        )}

        {moment.songUrl && (
          <a
            href={moment.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-3 py-3 text-sm text-accent"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-black">
              ♫
            </span>
            <span className="min-w-0">
              <span className="block font-medium text-foreground">Play the song</span>
              <span className="block truncate text-xs text-muted">
                Opens Spotify / Music / YouTube
              </span>
            </span>
          </a>
        )}

        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.payload}
            alt=""
            loading="lazy"
            decoding="async"
            className="mt-4 h-36 w-full rounded-2xl object-cover"
          />
        )}
        {video && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={video.payload}
            controls
            playsInline
            preload="metadata"
            className="mt-4 h-44 w-full rounded-2xl object-cover bg-black"
          />
        )}
      </article>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => saveToMyMoments(true)}
          disabled={saveState === "saved"}
        >
          {saveState === "saved" ? "Saved to My Moments" : "Save to My Moments"}
        </button>
        {saveState === "error" && (
          <p className="text-center text-xs text-amber-300">
            Couldn&apos;t save on this device. Try again.
          </p>
        )}
        <Link href="/" className="btn-ghost w-full text-center">
          {saveState === "saved" ? "Open in MOMENT" : "Open MOMENT app"}
        </Link>
        <p className="text-center text-xs text-muted">
          Saving keeps this Moment in Your Moments so you don&apos;t need the
          chat link again.
        </p>
      </div>
    </main>
  );
}
