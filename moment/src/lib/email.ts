import { SUPPORT_EMAIL } from "@/lib/brand";

const RESEND_API = "https://api.resend.com/emails";

export function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim() || "";
}

export function getResendFrom() {
  return (
    process.env.RESEND_FROM?.trim() ||
    "MOMENT <noreply@quitcurve.app>"
  );
}

/** Fire-and-forget style email via Resend. Returns false if not configured / failed. */
export async function sendShareOpenedEmail(input: {
  to: string;
  recipientName: string;
  placeName: string;
  title?: string;
}): Promise<boolean> {
  const key = getResendApiKey();
  if (!key) return false;

  const who = input.recipientName.trim() || "Someone";
  const place = input.placeName.trim() || "the place";
  const title = input.title?.trim();
  const subject = `${who} opened your Moment`;
  const line = title
    ? `<strong>${escapeHtml(who)}</strong> unlocked <em>${escapeHtml(title)}</em> at ${escapeHtml(place)}.`
    : `<strong>${escapeHtml(who)}</strong> unlocked your Moment at ${escapeHtml(place)}.`;

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getResendFrom(),
        to: [input.to],
        reply_to: SUPPORT_EMAIL,
        subject,
        html: `
          <div style="font-family:Georgia,serif;line-height:1.5;color:#111">
            <p style="font-size:18px;margin:0 0 12px">Your Moment was opened</p>
            <p style="margin:0 0 16px">${line}</p>
            <p style="margin:0;color:#666;font-size:14px">
              Like a read receipt — they arrived and unlocked what you left.
            </p>
          </div>
        `,
        text: `${who} unlocked your Moment at ${place}.`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
