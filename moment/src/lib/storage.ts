import type { MomentMedia, MomentRecord } from "./types";

const KEY = "moment.app.v1";
const WELCOME_KEY = "moment.welcome.seen";

/** Keep persisted payloads under Safari-friendly sizes (chars ≈ bytes for data URLs). */
const MAX_VIDEO_PAYLOAD_CHARS = 4_500_000;
const MAX_PHOTO_PAYLOAD_CHARS = 1_200_000;
const MAX_VOICE_PAYLOAD_CHARS = 500_000;
/** Rough localStorage budget before we start dropping video blobs. */
const SOFT_STORE_CHARS = 4_000_000;

type Store = {
  moments: MomentRecord[];
};

function clampMedia(media: MomentMedia[]): MomentMedia[] {
  return media
    .map((m) => {
      if (typeof m.payload !== "string") return null;
      if (m.kind === "video" && m.payload.length > MAX_VIDEO_PAYLOAD_CHARS) {
        return {
          ...m,
          payload: "",
          mimeType: m.mimeType,
        };
      }
      if (m.kind === "photo" && m.payload.length > MAX_PHOTO_PAYLOAD_CHARS) {
        return null;
      }
      if (m.kind === "voice" && m.payload.length > MAX_VOICE_PAYLOAD_CHARS) {
        return null;
      }
      return m;
    })
    .filter((m): m is MomentMedia => m != null && (m.kind !== "video" || m.payload.length > 0));
}

function sanitizeMoments(moments: MomentRecord[]): MomentRecord[] {
  return moments.map((m) => ({
    ...m,
    media: Array.isArray(m.media) ? clampMedia(m.media) : [],
  }));
}

function stripHeavyMedia(moments: MomentRecord[]): MomentRecord[] {
  return moments.map((m) => ({
    ...m,
    media: m.media.filter((x) => x.kind !== "video"),
  }));
}

function read(): Store {
  if (typeof window === "undefined") return { moments: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { moments: [] };
    // Enormous stores can OOM Safari during JSON.parse — refuse and reset.
    if (raw.length > 12_000_000) {
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* ignore */
      }
      return { moments: [] };
    }
    const parsed = JSON.parse(raw) as Store;
    const moments = Array.isArray(parsed.moments)
      ? sanitizeMoments(parsed.moments)
      : [];
    return { moments };
  } catch {
    return { moments: [] };
  }
}

function write(store: Store): boolean {
  if (typeof window === "undefined") return false;
  const sanitized = { moments: sanitizeMoments(store.moments) };
  try {
    const json = JSON.stringify(sanitized);
    if (json.length > SOFT_STORE_CHARS) {
      const lighter = { moments: stripHeavyMedia(sanitized.moments) };
      localStorage.setItem(KEY, JSON.stringify(lighter));
      return true;
    }
    localStorage.setItem(KEY, json);
    return true;
  } catch {
    try {
      const lighter = { moments: stripHeavyMedia(sanitized.moments) };
      localStorage.setItem(KEY, JSON.stringify(lighter));
      return true;
    } catch {
      try {
        localStorage.setItem(KEY, JSON.stringify({ moments: [] }));
      } catch {
        /* private mode / full */
      }
      return false;
    }
  }
}

export function loadMoments(): MomentRecord[] {
  return read().moments;
}

export function saveMoments(moments: MomentRecord[]) {
  write({ moments });
}

export function hasSeenWelcome(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(WELCOME_KEY) === "1";
}

export function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Wipe guest/local MOMENT data on this device. */
export function clearLocalMomentData() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(WELCOME_KEY);
    localStorage.removeItem("moment.shares.outbox.v1");
    localStorage.removeItem("moment.shares.inbox.v1");
  } catch {
    /* ignore */
  }
}

export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}


/** Insert or replace a received Moment (idempotent by sourceShareId / id). */
export function upsertReceivedMoment(record: MomentRecord): MomentRecord[] {
  const prev = loadMoments();
  const next = [
    record,
    ...prev.filter(
      (m) =>
        m.id !== record.id &&
        !(record.sourceShareId && m.sourceShareId === record.sourceShareId),
    ),
  ];
  saveMoments(next);
  return next;
}

export function findMomentByShareId(shareId: string): MomentRecord | undefined {
  return loadMoments().find(
    (m) =>
      m.sourceShareId === shareId ||
      m.id === `received_${shareId}` ||
      m.id === `shared_${shareId}`,
  );
}
