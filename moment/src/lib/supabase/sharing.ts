import { createClient } from "./client";
import { isSupabaseConfigured } from "./config";
import type { MomentRecord, MomentMedia, Coords } from "@/lib/types";

export type SharedMomentRow = {
  id: string;
  moment_id: string;
  sender_id: string;
  sender_name: string;
  recipient_email: string;
  recipient_name: string;
  recipient_id: string | null;
  claimed_at: string | null;
  unlocked_at: string | null;
  passcode: string | null;
  created_at: string;
  moments?: {
    id: string;
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
  };
};

export type SharedMomentInfo = {
  id: string;
  momentId: string;
  senderName: string;
  recipientEmail: string;
  recipientName: string;
  claimed: boolean;
  unlocked: boolean;
  passcode?: string;
  createdAt: string;
  moment?: {
    title: string;
    placeName: string;
    placeSubtitle?: string;
    coords: Coords;
    note: string;
    media: MomentMedia[];
    locationLocked: boolean;
    timeLocked: boolean;
    unlockAt?: string;
    annualTradition?: boolean;
    createdAt: string;
  };
};

function fromRow(row: SharedMomentRow): SharedMomentInfo {
  return {
    id: row.id,
    momentId: row.moment_id,
    senderName: row.sender_name,
    recipientEmail: row.recipient_email,
    recipientName: row.recipient_name,
    claimed: Boolean(row.claimed_at),
    unlocked: Boolean(row.unlocked_at),
    passcode: row.passcode ?? undefined,
    createdAt: row.created_at,
    moment: row.moments
      ? {
          title: row.moments.title,
          placeName: row.moments.place_name,
          placeSubtitle: row.moments.place_subtitle ?? undefined,
          coords: { lat: row.moments.lat, lng: row.moments.lng },
          note: row.moments.note,
          media: Array.isArray(row.moments.media) ? row.moments.media : [],
          locationLocked: row.moments.location_locked,
          timeLocked: row.moments.time_locked,
          unlockAt: row.moments.unlock_at ?? undefined,
          annualTradition: row.moments.annual_tradition || undefined,
          createdAt: row.moments.created_at,
        }
      : undefined,
  };
}

function shareErrorMessage(error: unknown): string {
  if (!error) return "Failed to send";
  if (typeof error === "string") return error;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = String((error as { message?: unknown }).message ?? "");
    const code =
      "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
    if (code === "23503" || /foreign key/i.test(msg)) {
      return "Couldn’t sync this Moment to the cloud before sharing. Try again, or create a link instead.";
    }
    if (code === "42501" || /row-level security|permission denied/i.test(msg)) {
      return "Cloud share blocked by permissions. Confirm you’re signed in, then try again.";
    }
    if (msg) return msg;
  }
  return "Failed to send";
}

/**
 * Upserts the Moment (and sender profile) then creates a shared_moments row.
 * Account delivery does not email automatically — recipient signs in with that
 * address to claim it.
 */
export async function createSharedMoment(input: {
  moment: MomentRecord;
  senderId: string;
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  recipientName: string;
  passcode?: string;
}): Promise<SharedMomentInfo> {
  if (!isSupabaseConfigured()) throw new Error("Cloud not configured");
  const supabase = createClient();

  const senderName = input.senderName.trim() || input.senderEmail.split("@")[0] || "Someone";
  const recipientEmail = input.recipientEmail.toLowerCase().trim();
  if (!recipientEmail || !recipientEmail.includes("@")) {
    throw new Error("Enter a valid email for them.");
  }

  // Profile must exist (shared_moments.sender_id → profiles)
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: input.senderId,
      email: input.senderEmail.toLowerCase().trim(),
      name: senderName,
    },
    { onConflict: "id" },
  );
  if (profileError) {
    throw new Error(shareErrorMessage(profileError));
  }

  // Moment must exist in cloud (shared_moments.moment_id → moments)
  const { upsertCloudMoments } = await import("./sync");
  try {
    await upsertCloudMoments(input.senderId, [input.moment]);
  } catch (e) {
    throw new Error(shareErrorMessage(e));
  }

  const { data, error } = await supabase
    .from("shared_moments")
    .insert({
      moment_id: input.moment.id,
      sender_id: input.senderId,
      sender_name: senderName,
      recipient_email: recipientEmail,
      recipient_name: input.recipientName.trim() || "friend",
      passcode: input.passcode?.trim() || null,
    })
    .select("*")
    .single();
  if (error) throw new Error(shareErrorMessage(error));
  return fromRow(data as SharedMomentRow);
}

export async function fetchSentShares(userId: string): Promise<SharedMomentInfo[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("shared_moments")
    .select("*, moments(*)")
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as SharedMomentRow[]).map(fromRow);
}

export async function fetchReceivedShares(userId: string): Promise<SharedMomentInfo[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("shared_moments")
    .select("*, moments(*)")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as SharedMomentRow[]).map(fromRow);
}

export async function claimShare(shareId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) return;
  await supabase
    .from("shared_moments")
    .update({
      recipient_id: session.session.user.id,
      claimed_at: new Date().toISOString(),
    })
    .eq("id", shareId);
}

export async function markShareUnlocked(shareId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  await supabase
    .from("shared_moments")
    .update({ unlocked_at: new Date().toISOString() })
    .eq("id", shareId);
}
