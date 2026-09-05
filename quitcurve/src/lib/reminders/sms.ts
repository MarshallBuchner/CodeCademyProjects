type SendSmsArgs = {
  toE164: string;
  name: string;
};

export async function sendCheckInReminderSms({
  toE164,
  name,
}: SendSmsArgs): Promise<{ ok: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    return { ok: false, error: "Twilio not configured" };
  }

  const firstName = name.split(" ")[0] || "there";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quitcurve.app";
  const body = `QuitCurve: Hey ${firstName}, time for today's check-in. ${siteUrl}/dashboard — reply STOP vibes by turning off SMS in Settings.`;

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({
    To: toE164,
    From: from,
    Body: body,
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Twilio ${res.status}: ${text}` };
  }

  return { ok: true };
}
