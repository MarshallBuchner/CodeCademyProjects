"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useQuitCurve } from "@/context/QuitCurveProvider";
import {
  fetchReminderSettings,
  upsertReminderSettings,
} from "@/lib/reminders/client";
import {
  detectBrowserTimezone,
  normalizePhoneE164,
} from "@/lib/reminders/timezone";
import {
  COMMON_TIMEZONES,
  HOUR_OPTIONS,
  type ReminderSettings,
} from "@/lib/reminders/types";

export function ReminderSettingsForm() {
  const { user, cloudEnabled, loading: appLoading } = useQuitCurve();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [existing, setExisting] = useState<ReminderSettings | null>(null);

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("America/Toronto");
  const [preferredHour, setPreferredHour] = useState(18);
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);

  useEffect(() => {
    if (appLoading) return;
    if (!user || !cloudEnabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const settings = await fetchReminderSettings(user.id);
        if (cancelled) return;
        if (settings) {
          setExisting(settings);
          setEmailEnabled(settings.emailEnabled);
          setSmsEnabled(settings.smsEnabled);
          setPhone(settings.phoneE164 ?? "");
          setTimezone(settings.timezone);
          setPreferredHour(settings.preferredHour);
          setEmailConsent(Boolean(settings.emailConsentAt));
          setSmsConsent(Boolean(settings.smsConsentAt));
        } else {
          setTimezone(detectBrowserTimezone());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load settings");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, cloudEnabled, appLoading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    setSaved(false);

    if (emailEnabled && !emailConsent) {
      setError("Please confirm email reminder consent.");
      setSaving(false);
      return;
    }

    if (smsEnabled && !smsConsent) {
      setError("Please confirm SMS reminder consent.");
      setSaving(false);
      return;
    }

    let phoneE164: string | null = null;
    if (smsEnabled) {
      phoneE164 = normalizePhoneE164(phone);
      if (!phoneE164) {
        setError("Enter a valid phone number with country code (e.g. +14165551234).");
        setSaving(false);
        return;
      }
    }

    try {
      const next = await upsertReminderSettings(
        user.id,
        {
          emailEnabled,
          smsEnabled,
          phoneE164,
          timezone,
          preferredHour,
          emailConsent,
          smsConsent,
        },
        existing,
      );
      setExisting(next);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (appLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5">
        <p className="text-sm text-muted">Loading reminders…</p>
      </div>
    );
  }

  if (!cloudEnabled) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold">Reminders</h1>
        <p className="mt-3 text-sm text-muted">
          Cloud sync isn&apos;t configured yet, so reminders aren&apos;t available.
        </p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold">Reminders</h1>
        <p className="mt-3 text-sm text-muted">
          Sign in to turn on daily check-in reminders by email or SMS.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background"
        >
          Sign in
        </Link>
      </Shell>
    );
  }

  const timezoneOptions: { value: string; label: string }[] = [
    ...COMMON_TIMEZONES,
  ];
  if (!timezoneOptions.some((tz) => tz.value === timezone)) {
    timezoneOptions.unshift({ value: timezone, label: timezone });
  }

  return (
    <Shell>
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        Stay consistent
      </p>
      <h1 className="mt-2 text-2xl font-bold">Check-in reminders</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        We&apos;ll nudge you once a day at your chosen time — only if you
        haven&apos;t completed today&apos;s check-in yet.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <fieldset className="rounded-2xl border border-white/8 bg-card p-5">
          <legend className="px-1 text-sm font-semibold">Email</legend>
          <label className="mt-3 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => {
                setEmailEnabled(e.target.checked);
                if (e.target.checked && !emailConsent) setEmailConsent(false);
              }}
              className="mt-1"
            />
            <span>
              Send a daily email reminder to{" "}
              <strong className="text-foreground">{user.email}</strong>
            </span>
          </label>
          {emailEnabled && (
            <label className="mt-4 flex items-start gap-3 text-xs text-muted">
              <input
                type="checkbox"
                checked={emailConsent}
                onChange={(e) => setEmailConsent(e.target.checked)}
                className="mt-0.5"
                required={emailEnabled}
              />
              <span>
                I agree to receive QuitCurve check-in emails. I can turn this off
                anytime.
              </span>
            </label>
          )}
        </fieldset>

        <fieldset className="rounded-2xl border border-white/8 bg-card p-5">
          <legend className="px-1 text-sm font-semibold">SMS (optional)</legend>
          <p className="mt-2 text-xs text-muted">
            Requires Twilio to be configured on the server. Standard carrier rates
            may apply.
          </p>
          <label className="mt-3 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={smsEnabled}
              onChange={(e) => setSmsEnabled(e.target.checked)}
              className="mt-1"
            />
            <span>Also text me a short reminder</span>
          </label>
          {smsEnabled && (
            <div className="mt-4 space-y-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 416 555 1234"
                className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
                required={smsEnabled}
              />
              <label className="flex items-start gap-3 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-0.5"
                  required={smsEnabled}
                />
                <span>
                  I consent to receive QuitCurve SMS reminders at this number. Msg
                  frequency: up to 1/day. Reply options managed in this app.
                </span>
              </label>
            </div>
          )}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-2 block text-muted">Time zone</span>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm outline-none focus:border-accent/50"
            >
              {timezoneOptions.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-muted">Remind me at</span>
            <select
              value={preferredHour}
              onChange={(e) => setPreferredHour(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm outline-none focus:border-accent/50"
            >
              {HOUR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && (
          <p className="text-sm text-accent">Saved. You&apos;re all set.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-accent py-4 text-sm font-semibold text-background disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save reminder settings"}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
            ← Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-5 py-8">{children}</main>
    </div>
  );
}
