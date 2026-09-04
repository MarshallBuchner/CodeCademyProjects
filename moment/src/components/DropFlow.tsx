"use client";

import { useEffect, useRef, useState } from "react";
import { PlacePickerMap } from "@/components/Maps";
import { useMoment } from "@/context/MomentProvider";
import { formatShortDate } from "@/lib/format";
import { reverseGeocode, searchPlaces, type PlaceLookup } from "@/lib/geocode";
import { compressImageFile, readFileAsDataUrl } from "@/lib/media";
import { oneYearFromNowIso, toDatetimeLocalValue } from "@/lib/time";
import type { Coords, MediaKind, MomentMedia } from "@/lib/types";

export function DropPlace() {
  const { draft, setDraft, setView, userCoords, refreshLocation, locationError } =
    useMoment();
  const [query, setQuery] = useState(draft.placeName || "");
  const [results, setResults] = useState<PlaceLookup[]>([]);
  const [searching, setSearching] = useState(false);
  const [labelBusy, setLabelBusy] = useState(false);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapCenter = draft.coords ?? userCoords ?? { lat: 42.3149, lng: -83.0364 };

  useEffect(() => {
    void refreshLocation().then((coords) => {
      if (coords && !draft.coords) {
        setDraft({
          coords,
          placeName: draft.placeName || "Current location",
          placeSubtitle: draft.placeSubtitle || "Where you are right now",
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshLocation]);

  function scheduleLabel(coords: Coords) {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(() => {
      setLabelBusy(true);
      void reverseGeocode(coords).then((place) => {
        setDraft({
          coords: place.coords,
          placeName: place.name,
          placeSubtitle: place.subtitle,
        });
        setQuery(place.name);
        setLabelBusy(false);
      });
    }, 450);
  }

  function onMapMoved(coords: Coords) {
    setDraft({ coords });
    scheduleLabel(coords);
  }

  function onSearchChange(value: string) {
    setQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (value.trim().length < 2) {
        setResults([]);
        return;
      }
      setSearching(true);
      void searchPlaces(value, userCoords).then((items) => {
        setResults(items);
        setSearching(false);
      });
    }, 350);
  }

  function applyPlace(place: PlaceLookup) {
    setDraft({
      coords: place.coords,
      placeName: place.name,
      placeSubtitle: place.subtitle,
    });
    setQuery(place.name);
    setResults([]);
  }

  async function useMyLocation() {
    const coords = await refreshLocation();
    if (!coords) return;
    setDraft({ coords });
    scheduleLabel(coords);
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
      <p className="mt-1 text-sm text-muted">Pan the map — the pin stays in the center.</p>

      <div className="relative mt-5">
        <input
          value={query}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search a place…"
          className="field pl-10"
        />
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          ⌕
        </span>
      </div>

      {results.length > 0 && (
        <ul className="mt-2 max-h-40 overflow-auto rounded-2xl border border-white/10 bg-card">
          {results.map((r) => (
            <li key={`${r.name}-${r.coords.lat}-${r.coords.lng}`}>
              <button
                type="button"
                className="w-full border-b border-white/5 px-4 py-3 text-left last:border-0"
                onClick={() => applyPlace(r)}
              >
                <span className="block text-sm font-medium">{r.name}</span>
                <span className="text-xs text-muted">{r.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {searching && <p className="mt-2 text-xs text-muted">Searching…</p>}

      <PlacePickerMap
        center={mapCenter}
        className="mt-4 h-[300px]"
        onCenterChange={onMapMoved}
      />

      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-ghost flex-1 text-sm" onClick={() => void useMyLocation()}>
          Use my location
        </button>
      </div>

      {locationError && (
        <p className="mt-2 text-xs text-amber-300/90">
          {locationError}. You can still pan/search the map.
        </p>
      )}

      <div className="mt-auto pt-6">
        <div className="mb-3 rounded-2xl border border-white/8 bg-card/80 px-4 py-3">
          <p className="text-sm font-medium">
            {labelBusy ? "Finding place name…" : draft.placeName || "No place selected"}
          </p>
          <p className="text-xs text-muted">
            {draft.placeSubtitle ||
              (draft.coords
                ? `${draft.coords.lat.toFixed(5)}, ${draft.coords.lng.toFixed(5)}`
                : "Pan the map to set a pin")}
          </p>
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
              <p className="py-6 text-center text-sm text-muted">
                Use a shot from your camera roll — or take a new one here.
              </p>
            )}
            <label className="btn-primary w-full cursor-pointer text-center">
              {busy ? "Working…" : photo ? "Choose another from library" : "Choose from library"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => void onPhoto(e.target.files?.[0] ?? null)}
              />
            </label>
            <label className="btn-ghost w-full cursor-pointer text-center text-sm">
              Take a new photo
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
                Pick a clip from your camera roll (under ~1.8 MB), or record a new one.
              </p>
            )}
            <label className="btn-primary w-full cursor-pointer text-center">
              {busy ? "Working…" : video ? "Choose another from library" : "Choose from library"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => void onVideo(e.target.files?.[0] ?? null)}
              />
            </label>
            <label className="btn-ghost w-full cursor-pointer text-center text-sm">
              Record a new video
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
