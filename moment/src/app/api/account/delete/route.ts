import { NextResponse } from "next/server";
import { SUPPORT_EMAIL } from "@/lib/brand";
import { createAdminClient, getServiceRoleKey } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Permanently deletes the authenticated Supabase Auth user.
 * Profile + moments cascade via FK on delete.
 */
export async function POST() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Cloud accounts are not configured." },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    if (!getServiceRoleKey()) {
      return NextResponse.json(
        {
          error: `Account deletion is not configured yet. Email ${SUPPORT_EMAIL} and we will delete your data.`,
        },
        { status: 503 },
      );
    }

    const admin = createAdminClient();
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 },
      );
    }

    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 },
    );
  }
}
