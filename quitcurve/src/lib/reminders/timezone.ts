/** Local calendar date + hour for a timezone (no external deps). */
export function getLocalParts(
  timeZone: string,
  date = new Date(),
): { localDate: string; hour: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = Number(get("hour"));

  return {
    localDate: `${year}-${month}-${day}`,
    hour: Number.isFinite(hour) ? hour : 0,
  };
}

export function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Toronto";
  } catch {
    return "America/Toronto";
  }
}

/** Normalize to E.164-ish: digits with leading +. Returns null if too short. */
export function normalizePhoneE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/[^\d+]/g, "");
  const withPlus = digits.startsWith("+")
    ? `+${digits.slice(1).replace(/\D/g, "")}`
    : `+${digits.replace(/\D/g, "")}`;
  if (withPlus.length < 11 || withPlus.length > 16) return null;
  return withPlus;
}
