import { NextResponse } from "next/server";
import type { MomentRecord } from "@/lib/types";
import { createAdminClient, getServiceRoleKey } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { upsertCloudMomentsAdmin } from "@/lib/supabase/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Authenticated account share.
 * Verifies the signed-in user, then writes with the service role so RLS
 * can't block profile/moment/shared_moments inserts.
 */
export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Cloud accounts are not configured." },
        { status: 503 },
      );
    }
    if (!getServiceRoleKey()) {
      return NextResponse.json(
        {
          error:
            "Server share is not configured. Add SUPABASE_SERVICE_ROLE_KEY on Vercel.",
        },
        { status: 503 },
      );
    }

    // Prefer cookie session; fall back to Authorization Bearer from the browser client
    let user: { id: string; email?: string | null } | null = null;
    const authHeader = request.headers.get("authorization") ?? "";
    const bearer = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (bearer) {
      const admin = createAdminClient();
      const { data, error } = await admin.auth.getUser(bearer);
      if (!error && data.user) user = data.user;
    }

    if (!user) {
      const supabase = await createClient();
      const {
        data: { user: cookieUser },
        error: userError,
      } = await supabase.auth.getUser();
      if (!userError && cookieUser) user = cookieUser;
    }

    if (!user?.email) {
      return NextResponse.json(
        { error: "Sign in again, then try sending." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      moment?: MomentRecord;
      senderName?: string;
      recipientEmail?: string;
      recipientName?: string;
      passcode?: string;
    };

    const moment = body.moment;
    const recipientEmail = body.recipientEmail?.toLowerCase().trim() ?? "";
    const recipientName = body.recipientName?.trim() ?? "";
    const senderName =
      body.senderName?.trim() ||
      user.email.split("@")[0] ||
      "Someone";

    if (!moment?.id || !moment.coords) {
      return NextResponse.json(
        { error: "Moment payload is missing." },
        { status: 400 },
      );
    }
    if (!recipientName) {
      return NextResponse.json(
        { error: "Who is this Moment for?" },
        { status: 400 },
      );
    }
    if (!recipientEmail.includes("@")) {
      return NextResponse.json(
        { error: "Enter a valid email for them." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: user.id,
        email: user.email.toLowerCase(),
        name: senderName,
      },
      { onConflict: "id" },
    );
    if (profileError) {
      return NextResponse.json(
        { error: profileError.message || "Could not save your profile." },
        { status: 500 },
      );
    }

    try {
      await upsertCloudMomentsAdmin(user.id, [moment]);
    } catch (e) {
      return NextResponse.json(
        {
          error:
            e instanceof Error
              ? e.message
              : "Could not sync Moment to the cloud.",
        },
        { status: 500 },
      );
    }

    const { data, error } = await admin
      .from("shared_moments")
      .insert({
        moment_id: moment.id,
        sender_id: user.id,
        sender_name: senderName,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        passcode: body.passcode?.trim() || null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not create shared Moment." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id as string,
      recipientEmail,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to send shared Moment.",
      },
      { status: 500 },
    );
  }
}
