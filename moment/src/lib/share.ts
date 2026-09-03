import type { Coords, MomentMedia, MomentRecord } from "./types";

export type SharedCapsule = {
  v: 1;
  shareId: string;
  /** Unguessable key — must match ?k= in the link */
  accessKey: string;
  recipientName: string;
  senderName: string;
  /** Optional short PIN the sender tells the recipient */
  passcode?: string;
  title: string;
  placeName: string;
  placeSubtitle?: string;
  coords: Coords;
  note: string;
  media: MomentMedia[];
  locationLocked: boolean;
  timeLocked: boolean;
  unlockAt?: string;
  createdAt: string;
};

export type OutboundShare = {
  shareId: string;
  accessKey: string;
  recipientName: string;
  momentId: string;
  title: string;
  placeName: string;
  createdAt: string;
  urlPath: string;
};

const SHARE_OUTBOX = "moment.shares.outbox.v1";
const SHARE_INBOX = "moment.shares.inbox.v1";

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function randomToken(bytes = 18): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return bytesToBase64Url(arr);
}

/** Rough size guard — huge data-URLs blow past practical share-link length */
export function estimateCapsuleBytes(capsule: SharedCapsule): number {
  return new Blob([JSON.stringify(capsule)]).size;
}

export function sealCapsule(capsule: SharedCapsule): string {
  const json = JSON.stringify(capsule);
  const bytes = new TextEncoder().encode(json);
  return bytesToBase64Url(bytes);
}

export function unsealCapsule(sealed: string): SharedCapsule | null {
  try {
    const bytes = base64UrlToBytes(sealed);
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as SharedCapsule;
    if (parsed?.v !== 1 || !parsed.shareId || !parsed.accessKey || !parsed.coords) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function buildShareUrl(
  origin: string,
  capsule: SharedCapsule,
  sealed: string,
): string {
  const url = new URL(`/m/${capsule.shareId}`, origin);
  url.searchParams.set("k", capsule.accessKey);
  // Payload lives in the hash so it never hits the server
  url.hash = `d=${sealed}`;
  return url.toString();
}

export function createCapsuleFromMoment(input: {
  moment: MomentRecord;
  recipientName: string;
  senderName: string;
  passcode?: string;
}): SharedCapsule {
  const shareId = randomToken(12);
  const accessKey = randomToken(18);
  // Prefer lean media for link size — keep note + compressed photo if present
  const media = input.moment.media.filter((m) => {
    if (m.kind === "note") return true;
    if (m.kind === "voice") return m.payload.length < 400_000;
    if (m.kind === "photo") return m.payload.length < 900_000;
    return false;
  });

  return {
    v: 1,
    shareId,
    accessKey,
    recipientName: input.recipientName.trim() || "you",
    senderName: input.senderName.trim() || "Someone",
    passcode: input.passcode?.trim() || undefined,
    title: input.moment.title,
    placeName: input.moment.placeName,
    placeSubtitle: input.moment.placeSubtitle,
    coords: input.moment.coords,
    note: input.moment.note,
    media,
    locationLocked: input.moment.locationLocked,
    timeLocked: input.moment.timeLocked,
    unlockAt: input.moment.unlockAt,
    createdAt: new Date().toISOString(),
  };
}

export function capsuleToLocalMoment(capsule: SharedCapsule): MomentRecord {
  return {
    id: `shared_${capsule.shareId}`,
    title: capsule.title,
    placeName: capsule.placeName,
    placeSubtitle: capsule.placeSubtitle,
    coords: capsule.coords,
    note: capsule.note,
    media: capsule.media,
    locationLocked: capsule.locationLocked,
    timeLocked: capsule.timeLocked,
    unlockAt: capsule.unlockAt,
    createdAt: capsule.createdAt,
    saved: false,
  };
}

export function loadOutbox(): OutboundShare[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHARE_OUTBOX);
    return raw ? (JSON.parse(raw) as OutboundShare[]) : [];
  } catch {
    return [];
  }
}

export function saveOutbox(items: OutboundShare[]) {
  localStorage.setItem(SHARE_OUTBOX, JSON.stringify(items));
}

export function rememberOutbound(share: OutboundShare) {
  const prev = loadOutbox().filter((s) => s.shareId !== share.shareId);
  saveOutbox([share, ...prev].slice(0, 40));
}

export function loadInbox(): SharedCapsule[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHARE_INBOX);
    return raw ? (JSON.parse(raw) as SharedCapsule[]) : [];
  } catch {
    return [];
  }
}

export function rememberInbox(capsule: SharedCapsule) {
  const prev = loadInbox().filter((s) => s.shareId !== capsule.shareId);
  localStorage.setItem(
    SHARE_INBOX,
    JSON.stringify([capsule, ...prev].slice(0, 40)),
  );
}

export function getInboxCapsule(shareId: string): SharedCapsule | null {
  return loadInbox().find((c) => c.shareId === shareId) ?? null;
}
