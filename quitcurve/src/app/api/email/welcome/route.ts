import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/reminders/email";

export async function POST(request: Request) {
  let body: { email?: string; name?: string };
  try {
    body = (await request.json()) as { email?: string; name?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim() || "there";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const result = await sendWelcomeEmail({ to: email, name });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Failed to send welcome email" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
