import type { MomentRecord } from "./types";

const KEY = "moment.app.v1";
const WELCOME_KEY = "moment.welcome.seen";

type Store = {
  moments: MomentRecord[];
};

function read(): Store {
  if (typeof window === "undefined") return { moments: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { moments: [] };
    const parsed = JSON.parse(raw) as Store;
    return { moments: Array.isArray(parsed.moments) ? parsed.moments : [] };
  } catch {
    return { moments: [] };
  }
}

function write(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
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
  localStorage.setItem(WELCOME_KEY, "1");
}

export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
