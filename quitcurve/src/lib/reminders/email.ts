import { getReminderFromEmail, getSiteUrl } from "./config";

type SendEmailArgs = {
  to: string;
  name: string;
};

export async function sendCheckInReminderEmail({
  to,
  name,
}: SendEmailArgs): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const firstName = name.split(" ")[0] || "there";
  const siteUrl = getSiteUrl();
  const dashboardUrl = `${siteUrl}/dashboard`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#0a0f0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f0d;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:480px;background:#121a17;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#5ee9b5;">QuitCurve</p>
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#f4f7f5;">Hey ${escapeHtml(firstName)} — quick check-in?</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#9aaba3;">
                A one-tap check-in keeps your curve honest. No judgment if today was hard — progress still counts.
              </p>
              <a href="${dashboardUrl}"
                 style="display:inline-block;background:#5ee9b5;color:#0a0f0d;text-decoration:none;font-weight:600;font-size:14px;padding:14px 28px;border-radius:999px;">
                Complete today's check-in
              </a>
              <p style="margin:28px 0 0;font-size:12px;line-height:1.5;color:#6b7c74;">
                You're getting this because you turned on daily reminders in QuitCurve.
                <a href="${siteUrl}/reminders" style="color:#5ee9b5;">Manage reminders</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hey ${firstName} — quick QuitCurve check-in?\n\nComplete today's check-in: ${dashboardUrl}\n\nManage reminders: ${siteUrl}/reminders`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getReminderFromEmail(),
      to: [to],
      subject: "Your QuitCurve check-in is waiting",
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${body}` };
  }

  return { ok: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
