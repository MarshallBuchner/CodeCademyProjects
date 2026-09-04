/** ISO string for ~1 year from now (local noon for nicer defaults) */
export function oneYearFromNowIso(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

export function toDatetimeLocalValue(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
