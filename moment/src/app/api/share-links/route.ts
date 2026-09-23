import { NextResponse } from "next/server";
import { createAdminClient, getServiceRoleKey } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { unsealCapsule } from "@/lib/share";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SEALED_CHARS = 2_500_000;

/** Store a sealed capsule; returns a short /m/{id}?k=… path (no hash). */
export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured() || !getServiceRoleKey()) {
      return NextResponse.json(
        { error: "Short links are not configured." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      shareId?: string;
      accessKey?: string;
      sealed?: string;
      senderEmail?: string;
      recipientName?: string;
      placeName?: string;
      title?: string;
    };

    const shareId = body.shareId?.trim() ?? "";
    const accessKey = body.accessKey?.trim() ?? "";
    const sealed = body.sealed?.trim() ?? "";
    const senderEmail = body.senderEmail?.trim().toLowerCase() ?? "";
    const recipientName = body.recipientName?.trim() ?? "";
    const placeName = body.placeName?.trim() ?? "";
    const title = body.title?.trim() ?? "";

    if (!shareId || !accessKey || !sealed) {
      return NextResponse.json(
        { error: "shareId, accessKey, and sealed are required." },
        { status: 400 },
      );
    }
    if (sealed.length > MAX_SEALED_CHARS) {
      return NextResponse.json(
        { error: "Moment is too large to store as a link." },
        { status: 413 },
      );
    }

    const capsule = unsealCapsule(sealed);
    if (
      !capsule ||
      capsule.shareId !== shareId ||
      capsule.accessKey !== accessKey
    ) {
      return NextResponse.json(
        { error: "Sealed payload does not match shareId/accessKey." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const baseRow: Record<string, string> = {
      id: shareId,
      access_key: accessKey,
      sealed,
      expires_at: new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
    const row: Record<string, string> = { ...baseRow };
    if (senderEmail) row.sender_email = senderEmail;
    if (recipientName) row.recipient_name = recipientName;
    if (placeName) row.place_name = placeName;
    if (title) row.title = title;

    let { error } = await admin.from("share_links").upsert(row, {
      onConflict: "id",
    });

    // Older DBs without receipt columns — still create the short link
    if (
      error &&
      /sender_email|recipient_name|place_name|title|opened_at|column/i.test(
        error.message || "",
      )
    ) {
      ({ error } = await admin.from("share_links").upsert(baseRow, {
        onConflict: "id",
      }));
    }

    if (error) {
      const missing =
        error.message?.includes("share_links") ||
        error.code === "42P01" ||
        error.code === "PGRST205";
      return NextResponse.json(
        {
          error: missing
            ? "share_links table missing — run moment/supabase/share_links.sql."
            : error.message,
        },
        { status: missing ? 503 : 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      path: `/m/${shareId}?k=${encodeURIComponent(accessKey)}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create share link" },
      { status: 500 },
    );
  }
}
