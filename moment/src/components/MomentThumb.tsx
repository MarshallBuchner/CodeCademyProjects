"use client";

import type { MomentMedia } from "@/lib/types";

/** Soft cap — decoding huge data-URLs as list thumbs OOMs Safari. */
const PHOTO_THUMB_MAX_CHARS = 600_000;

function PlaceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="6" width="14" height="12" rx="2" />
      <path d="M17 10l4-2v8l-4-2" />
    </svg>
  );
}

/**
 * List/thumbnail for a Moment — never mounts `<video src={dataUrl}>`.
 * Full media only belongs on the unlocked detail screen.
 */
export function MomentThumb({ media }: { media: MomentMedia[] }) {
  const photo = media.find((x) => x.kind === "photo");
  const hasVideo = media.some((x) => x.kind === "video");
  const photoOk =
    photo &&
    typeof photo.payload === "string" &&
    photo.payload.startsWith("data:") &&
    photo.payload.length <= PHOTO_THUMB_MAX_CHARS;

  if (photoOk) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo.payload}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    );
  }

  if (hasVideo) {
    return (
      <div className="grid h-full w-full place-items-center bg-black/60 text-accent/90">
        <VideoIcon />
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center text-accent/80">
      <PlaceIcon />
    </div>
  );
}
