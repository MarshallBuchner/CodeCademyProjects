import { NextResponse } from "next/server";
import { isReminderCronConfigured } from "@/lib/reminders/config";
import { runDailyReminders } from "@/lib/reminders/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isReminderCronConfigured()) {
    return NextResponse.json(
      {
        error:
          "Reminders not fully configured (need SUPABASE_SERVICE_ROLE_KEY + CRON_SECRET)",
      },
      { status: 503 },
    );
  }

  try {
    const result = await runDailyReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
