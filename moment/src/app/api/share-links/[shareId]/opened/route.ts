import { NextResponse } from "next/server";
import { sendShareOpenedEmail } from "@/lib/email";
import { createAdminClient, getServiceRoleKey } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ shareId: string }> };

/**
 * Mark a short share link as opened/unlocked (read receipt).
 * Sends the sender one email via Resend when configured.
 */
export async function POST(request: Request, context: Ctx) {
  try {
    if (!isSupabaseConfigured() || !getServiceRoleKey()) {
      return NextResponse.json(
        { error: "Short links are not configured." },
        { status: 503 },
      );
    }

    const { shareId } = await context.params;
    const key = new URL(request.url).searchParams.get("k")?.trim() ?? "";
    if (!shareId || !key) {
      return NextResponse.json(
        { error: "Missing share id or key." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("share_links")
      .select(
        "id, access_key, opened_at, opened_notified_at, sender_email, recipient_name, place_name, title",
      )
      .eq("id", shareId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data || data.access_key !== key) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const alreadyOpened = Boolean(data.opened_at);

    if (!alreadyOpened) {
      const { error: updateError } = await admin
        .from("share_links")
        .update({ opened_at: now })
        .eq("id", shareId)
        .eq("access_key", key);
      if (updateError) {
        // Column may be missing until SQL migration is run — still OK for recipient
        const missingCol = /opened_at|column/i.test(updateError.message);
        if (!missingCol) {
          return NextResponse.json(
            { error: updateError.message },
            { status: 500 },
          );
        }
        return NextResponse.json({
          ok: true,
          openedAt: now,
          emailed: false,
          needsMigration: true,
        });
      }
    }

    let emailed = false;
    const senderEmail =
      typeof data.sender_email === "string" ? data.sender_email.trim() : "";
    if (senderEmail && !data.opened_notified_at) {
      emailed = await sendShareOpenedEmail({
        to: senderEmail,
        recipientName: String(data.recipient_name || "Someone"),
        placeName: String(data.place_name || "the place"),
        title: data.title ? String(data.title) : undefined,
      });
      if (emailed) {
        await admin
          .from("share_links")
          .update({ opened_notified_at: now })
          .eq("id", shareId);
      }
    }

    return NextResponse.json({
      ok: true,
      openedAt: data.opened_at || now,
      alreadyOpened,
      emailed,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to mark share opened",
      },
      { status: 500 },
    );
  }
}

/** Sender polls whether their share was unlocked (needs access key from outbox). */
export async function GET(request: Request, context: Ctx) {
  try {
    if (!isSupabaseConfigured() || !getServiceRoleKey()) {
      return NextResponse.json(
        { error: "Short links are not configured." },
        { status: 503 },
      );
    }

    const { shareId } = await context.params;
    const key = new URL(request.url).searchParams.get("k")?.trim() ?? "";
    if (!shareId || !key) {
      return NextResponse.json(
        { error: "Missing share id or key." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("share_links")
      .select("id, access_key, opened_at")
      .eq("id", shareId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data || data.access_key !== key) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      openedAt: (data.opened_at as string | null) ?? null,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to load share status",
      },
      { status: 500 },
    );
  }
}
