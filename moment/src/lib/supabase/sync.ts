import type { MomentMedia, MomentRecord } from "@/lib/types";
import { createClient } from "./client";
import { isSupabaseConfigured } from "./config";

type MomentRow = {
  id: string;
  user_id: string;
  title: string;
  place_name: string;
  place_subtitle: string | null;
  lat: number;
  lng: number;
  note: string;
  media: MomentMedia[];
  location_locked: boolean;
  time_locked: boolean;
  unlock_at: string | null;
  annual_tradition: boolean;
  created_at: string;
  unlocked_at: string | null;
  saved: boolean;
  updated_at: string;
};

function toRow(userId: string, m: MomentRecord): MomentRow {
  // Keep cloud payloads lean — skip huge video data URLs (>1.2MB)
  const media = m.media.filter((item) => {
    if (item.kind === "note") return true;
    return item.payload.length < 1_200_000;
  });
  return {
    id: m.id,
    user_id: userId,
    title: m.title,
    place_name: m.placeName,
    place_subtitle: m.placeSubtitle ?? null,
    lat: m.coords.lat,
    lng: m.coords.lng,
    note: m.note,
    media,
    location_locked: m.locationLocked,
    time_locked: m.timeLocked,
    unlock_at: m.unlockAt ?? null,
    annual_tradition: Boolean(m.annualTradition),
    created_at: m.createdAt,
    unlocked_at: m.unlockedAt ?? null,
    saved: m.saved,
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row: MomentRow): MomentRecord {
  return {
    id: row.id,
    title: row.title,
    placeName: row.place_name,
    placeSubtitle: row.place_subtitle ?? undefined,
    coords: { lat: row.lat, lng: row.lng },
    note: row.note,
    media: Array.isArray(row.media) ? row.media : [],
    locationLocked: row.location_locked,
    timeLocked: row.time_locked,
    unlockAt: row.unlock_at ?? undefined,
    annualTradition: row.annual_tradition || undefined,
    createdAt: row.created_at,
    unlockedAt: row.unlocked_at ?? undefined,
    saved: row.saved,
  };
}

export async function fetchCloudMoments(userId: string): Promise<MomentRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("moments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as MomentRow[] | null)?.map(fromRow) ?? [];
}

export async function upsertCloudMoments(
  userId: string,
  moments: MomentRecord[],
): Promise<void> {
  if (!isSupabaseConfigured() || moments.length === 0) return;
  const supabase = createClient();
  const rows = moments.map((m) => toRow(userId, m));
  const { error } = await supabase.from("moments").upsert(rows, {
    onConflict: "id",
  });
  if (error) throw error;
}

export async function deleteCloudMoment(
  userId: string,
  momentId: string,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  const { error } = await supabase
    .from("moments")
    .delete()
    .eq("user_id", userId)
    .eq("id", momentId);
  if (error) throw error;
}

/** Merge local + cloud by id, prefer newer unlocked/saved/updated fields heuristically */
export function mergeMoments(
  local: MomentRecord[],
  cloud: MomentRecord[],
): MomentRecord[] {
  const map = new Map<string, MomentRecord>();
  for (const m of [...cloud, ...local]) {
    const prev = map.get(m.id);
    if (!prev) {
      map.set(m.id, m);
      continue;
    }
    const prefer =
      (m.unlockedAt && !prev.unlockedAt) ||
      (m.saved && !prev.saved) ||
      new Date(m.createdAt).getTime() >= new Date(prev.createdAt).getTime()
        ? m
        : prev;
    map.set(m.id, {
      ...prefer,
      unlockedAt: m.unlockedAt || prev.unlockedAt,
      saved: m.saved || prev.saved,
    });
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
