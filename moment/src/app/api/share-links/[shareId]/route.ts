import { NextResponse } from "next/server";
import { createAdminClient, getServiceRoleKey } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ shareId: string }> };

/** Fetch sealed capsule for a short share link. Requires matching ?k= access key. */
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
      return NextResponse.json({ error: "Missing share id or key." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("share_links")
      .select("id, access_key, sealed, expires_at")
      .eq("id", shareId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data || data.access_key !== key) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "Link expired" }, { status: 410 });
    }

    return NextResponse.json({ sealed: data.sealed as string });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load share link" },
      { status: 500 },
    );
  }
}
