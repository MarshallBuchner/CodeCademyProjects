"use client";

import { useEffect, useRef, useState } from "react";
import { MapCanvas } from "@/components/MapCanvas";
import { useMoment } from "@/context/MomentProvider";
import { offsetCoords } from "@/lib/geo";
import { formatShortDate } from "@/lib/format";
import { compressImageFile, readFileAsDataUrl } from "@/lib/media";
import { oneYearFromNowIso, toDatetimeLocalValue } from "@/lib/time";
import type { MediaKind, MomentMedia } from "@/lib/types";

export function DropPlace() {
  const { draft, setDraft, setView, userCoords, refreshLocation, locationError } =
    useMoment();
  const [query, setQuery] = useState(draft.placeName || "");

  useEffect(() => {
    void refreshLocation();
  }, [refreshLocation]);

  const presets = [
    {
      name: "Riverside Viewpoint",
      subtitle: "123 River Rd",
      offset: [1200, 300] as const,
    },
    {
      name: "Harbor Pier",
      subtitle: "East boardwalk",
      offset: [-800, 1500] as const,
    },
    {
      name: "Current location",
      subtitle: "Where you are right now",
      offset: [0, 0] as const,
    },
  ];

  function pick(
    name: string,
    subtitle: string,
    north: number,
    east: number,
  ) {
    const base = userCoords ?? { lat: 42.3149, lng: -83.0364 };
    const coords = offsetCoords(base, north, east);
    setDraft({ placeName: name, placeSubtitle: subtitle, coords });
    setQuery(name);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
      <button
        type="button"
        className="mb-4 flex items-center gap-2 text-sm text-muted"
        onClick={() => setView("home")}
      >
        ← Back
      </button>
      <p className="text-xs tracking-[0.22em] text-accent uppercase">Drop a Moment</p>
      <h1 className="font-display mt-1 text-3xl tracking-wide">Choose a place</h1>

      <div className="relative mt-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a place…"
          className="field pl-10"
        />
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          ⌕
        </span>
      </div>

      <MapCanvas mode="pin" className="mt-4 h-[260px]" label={draft.placeName || "Pin a place"} />

      {locationError && (
        <p className="mt-3 text-xs text-amber-300/90">
          {locationError}. You can still pick a preset place for the prototype.
        </p>
      )}

      <ul className="mt-4 flex flex-col gap-2">
        {presets.map((p) => (
          <li key={p.name}>
            <button
              type="button"
              onClick={() => pick(p.name, p.subtitle, p.offset[0], p.offset[1])}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                draft.placeName === p.name
                  ? "border-accent/50 bg-accent/10"
                  : "border-white/8 bg-card"
              }`}
            >
              <span className="block text-sm font-medium">{p.name}</span>
              <span className="text-xs text-muted">{p.subtitle}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="mb-3 rounded-2xl border border-white/8 bg-card/80 px-4 py-3">
          <p className="text-sm font-medium">{draft.placeName || "No place selected"}</p>
          <p className="text-xs text-muted">{draft.placeSubtitle || "Pick a pin above"}</p>
        </div>
        <button
          type="button"
          className="btn-primary w-full"
          disabled={!draft.coords}
          onClick={() => setView("drop-record")}
        >
          Set this location
        </button>
      </div>
    </main>
  );
}

export function DropRecord() {
  const { draft, setDraft, setView } = useMoment();
  const [active, setActive] = useState<MediaKind>("note");
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);

  function upsertMedia(item: MomentMedia) {
    setDraft({
      media: [...draft.media.filter((m) => m.kind !== item.kind), item],
    });
  }

  async function toggleRecord() {
    if (recording && mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      startedAt.current = Date.now();
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          upsertMedia({
            kind: "voice",
            payload: String(reader.result),
            durationSeconds: Math.max(
              1,
              Math.round((Date.now() - startedAt.current) / 1000),
            ),
            mimeType: "audio/webm",
          });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.current = rec;
      rec.start();
      setRecording(true);
      setActive("voice");
    } catch {
      alert("Microphone permission is needed to record voice.");
    }
  }

  async function onPhoto(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const { dataUrl, mimeType } = await compressImageFile(file);
      upsertMedia({ kind: "photo", payload: dataUrl, mimeType });
      setActive("photo");
    } catch {
      alert("Could not read that picture.");
    } finally {
      setBusy(false);
    }
  }

  async function onVideo(file: File | null) {
    if (!file) return;
    // ~2.5MB data-URL ceiling keeps share links / localStorage workable
    if (file.size > 1.8 * 1024 * 1024) {
      alert(
        "Video is a bit large for this prototype (keep under ~1.8 MB). Trim it or use a short clip.",
      );
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      upsertMedia({
        kind: "video",
        payload: dataUrl,
        mimeType: file.type || "video/mp4",
      });
      setActive("video");
    } catch {
      alert("Could not read that video.");
    } finally {
      setBusy(false);
    }
  }

  const voice = draft.media.find((m) => m.kind === "voice");
  const photo = draft.media.find((m) => m.kind === "photo");
  const video = draft.media.find((m) => m.kind === "video");
  const attached = [photo && "Picture", video && "Video", draft.note.trim() && "Message", voice && "Voice"]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
      <button
        type="button"
        className="mb-4 flex items-center gap-2 text-sm text-muted"
        onClick={() => setView("drop-place")}
      >
        ← Back
      </button>
      <h1 className="font-display text-3xl tracking-wide">Record your Moment</h1>
      <p className="mt-1 text-sm text-muted">
        Picture, video, or a written message — at {draft.placeName || "this place"}.
      </p>

      <label className="mt-6 block text-xs tracking-wide text-muted uppercase">
        Title
        <input
          className="field mt-2"
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          placeholder="Sunset promise"
        />
      </label>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {(
          [
            { kind: "photo" as const, label: "Picture", icon: "🖼️" },
            { kind: "video" as const, label: "Video", icon: "🎬" },
            { kind: "note" as const, label: "Message", icon: "✍️" },
          ] as const
        ).map((item) => {
          const has =
            item.kind === "note"
              ? Boolean(draft.note.trim())
              : draft.media.some((m) => m.kind === item.kind);
          return (
            <button
              key={item.kind}
              type="button"
              onClick={() => setActive(item.kind)}
              className={`rounded-[20px] border px-3 py-4 text-center transition ${
                active === item.kind
                  ? "border-accent/60 bg-accent/15 text-accent shadow-[0_0_24px_rgba(255,138,42,0.2)]"
                  : "border-white/8 bg-card text-muted"
              }`}
            >
              <span className="block text-xl">{item.icon}</span>
              <span className="mt-1 block text-xs">{item.label}</span>
              {has && <span className="mt-1 block text-[10px] text-accent">Added</span>}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setActive("voice")}
        className={`mt-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
          active === "voice"
            ? "border-accent/50 bg-accent/10 text-accent"
            : "border-white/8 bg-card text-muted"
        }`}
      >
        + Optional voice note {voice ? "· Added" : ""}
      </button>

      <div className="mt-5 rounded-[22px] border border-white/8 bg-card p-4">
        {active === "photo" && (
          <div className="flex flex-col items-center gap-3">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.payload} alt="" className="h-40 w-full rounded-xl object-cover" />
            ) : (
              <p className="py-6 text-sm text-muted">Add a picture from this place.</p>
            )}
            <label className="btn-primary w-full cursor-pointer text-center">
              {busy ? "Working…" : photo ? "Replace picture" : "Choose picture"}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                disabled={busy}
                onChange={(e) => void onPhoto(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}

        {active === "video" && (
          <div className="flex flex-col items-center gap-3">
            {video ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={video.payload}
                controls
                playsInline
                className="h-44 w-full rounded-xl object-cover bg-black"
              />
            ) : (
              <p className="py-6 text-center text-sm text-muted">
                Add a short video clip (under ~1.8 MB for sharing).
              </p>
            )}
            <label className="btn-primary w-full cursor-pointer text-center">
              {busy ? "Working…" : video ? "Replace video" : "Choose video"}
              <input
                type="file"
                accept="video/*"
                capture="environment"
                className="hidden"
                disabled={busy}
                onChange={(e) => void onVideo(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}

        {active === "note" && (
          <label className="block text-xs tracking-wide text-muted uppercase">
            Written message
            <textarea
              className="field mt-2 min-h-36 resize-none"
              value={draft.note}
              onChange={(e) => {
                setDraft({ note: e.target.value });
                if (e.target.value.trim()) {
                  upsertMedia({ kind: "note", payload: e.target.value });
                }
              }}
              placeholder="Write something meaningful…"
              autoFocus
            />
          </label>
        )}

        {active === "voice" && (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="waveform flex h-12 w-full items-end justify-center gap-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-accent/80 ${recording ? "animate-pulse" : ""}`}
                  style={{
                    height: `${10 + ((i * 17) % 28)}px`,
                    opacity: voice || recording ? 1 : 0.35,
                  }}
                />
              ))}
            </div>
            <button type="button" className="btn-primary w-full" onClick={() => void toggleRecord()}>
              {recording ? "Stop recording" : voice ? "Re-record voice" : "Record voice"}
            </button>
            {voice?.durationSeconds != null && (
              <p className="text-xs text-muted">Saved · {voice.durationSeconds}s</p>
            )}
          </div>
        )}
      </div>

      {attached && (
        <p className="mt-3 text-center text-xs text-muted">Attached: {attached}</p>
      )}

      <button
        type="button"
        className="btn-primary mt-auto w-full"
        disabled={!draft.note.trim() && draft.media.length === 0}
        onClick={() => setView("drop-leave")}
      >
        Continue
      </button>
    </main>
  );
}

export function DropLeave() {
  const { draft, setDraft, setView, dropMoment } = useMoment();

  function enableAnnualTradition() {
    setDraft({
      annualTradition: true,
      locationLocked: true,
      timeLocked: true,
      unlockAt: oneYearFromNowIso(),
    });
  }

  function clearAnnualTradition() {
    setDraft({
      annualTradition: false,
      timeLocked: false,
      unlockAt: undefined,
    });
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-6">
      <button
        type="button"
        className="mb-4 flex items-center gap-2 text-sm text-muted"
        onClick={() => setView("drop-record")}
      >
        ← Back
      </button>
      <h1 className="font-display text-3xl tracking-wide">Leave it here</h1>
      <p className="mt-1 text-sm text-muted">Lock the Moment to this place.</p>

      <div className="mt-6 rounded-[22px] border border-white/8 bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">{draft.placeName}</p>
            <p className="text-xs text-muted">{draft.placeSubtitle}</p>
          </div>
          <button
            type="button"
            className="text-xs text-accent"
            onClick={() => setView("drop-place")}
          >
            Edit
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          draft.annualTradition ? clearAnnualTradition() : enableAnnualTradition()
        }
        className={`mt-4 w-full rounded-[22px] border px-4 py-4 text-left transition ${
          draft.annualTradition
            ? "border-accent/50 bg-accent/10"
            : "border-white/8 bg-card"
        }`}
      >
        <span className="block text-sm font-medium text-foreground">
          Annual Moment
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted">
          Return here next year to unlock. Keep the tradition going — make the
          moment last forever.
        </span>
        {draft.annualTradition && draft.unlockAt && (
          <span className="mt-2 block text-xs text-accent">
            Sealed until {formatShortDate(draft.unlockAt)} · at this location
          </span>
        )}
      </button>

      <label className="mt-3 flex items-center justify-between rounded-[22px] border border-white/8 bg-card px-4 py-4">
        <span>
          <span className="block text-sm font-medium">Only at this location</span>
          <span className="text-xs text-muted">Unlocks when you arrive</span>
        </span>
        <input
          type="checkbox"
          className="toggle"
          checked={draft.locationLocked}
          onChange={(e) => setDraft({ locationLocked: e.target.checked })}
        />
      </label>

      <label className="mt-3 flex items-center justify-between rounded-[22px] border border-white/8 bg-card px-4 py-4">
        <span>
          <span className="block text-sm font-medium">Time lock (optional)</span>
          <span className="text-xs text-muted">Also wait until a date</span>
        </span>
        <input
          type="checkbox"
          className="toggle"
          checked={draft.timeLocked}
          onChange={(e) =>
            setDraft({
              timeLocked: e.target.checked,
              annualTradition: e.target.checked ? draft.annualTradition : false,
              unlockAt: e.target.checked
                ? draft.unlockAt ?? oneYearFromNowIso()
                : undefined,
            })
          }
        />
      </label>

      {draft.timeLocked && (
        <input
          type="datetime-local"
          className="field mt-3"
          value={toDatetimeLocalValue(draft.unlockAt)}
          onChange={(e) =>
            setDraft({
              unlockAt: e.target.value
                ? new Date(e.target.value).toISOString()
                : undefined,
              annualTradition: false,
            })
          }
        />
      )}

      <button
        type="button"
        className="btn-primary mt-auto w-full"
        onClick={() => dropMoment()}
      >
        {draft.annualTradition ? "Drop Annual Moment" : "Drop Moment"}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        {draft.annualTradition
          ? "Return here next year to unlock."
          : "Only opens at this location."}
      </p>
    </main>
  );
}
