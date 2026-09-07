import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, getServiceRoleKey } from "@/lib/reminders/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Permanently deletes the authenticated user's Supabase Auth user.
 * Profile + related rows cascade via FK on delete.
 */
export async function POST() {
  try {
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
          error:
            "Account deletion is not configured yet. Email privacy@quitcurve.app and we will delete your data.",
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
