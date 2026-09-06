"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useQuitCurve } from "@/context/QuitCurveProvider";
import {
  fetchReminderSettings,
  upsertReminderSettings,
} from "@/lib/reminders/client";
import type { ReminderSettings } from "@/lib/reminders/types";

/** Hobby cron runs 23:00 UTC ≈ 7pm Eastern in daylight time. */
const HOBBY_TIMEZONE = "America/Toronto";
const HOBBY_HOUR = 19;

export function ReminderSettingsForm() {
  const { user, cloudEnabled, loading: appLoading } = useQuitCurve();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [existing, setExisting] = useState<ReminderSettings | null>(null);

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);

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
          setEmailConsent(Boolean(settings.emailConsentAt));
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

    try {
      const next = await upsertReminderSettings(
        user.id,
        {
          emailEnabled,
          smsEnabled: false,
          phoneE164: null,
          timezone: HOBBY_TIMEZONE,
          preferredHour: HOBBY_HOUR,
          emailConsent,
          smsConsent: false,
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
          Sign in to turn on a daily check-in email reminder.
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

  return (
    <Shell>
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        Stay consistent
      </p>
      <h1 className="mt-2 text-2xl font-bold">Check-in reminders</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        During beta, we send one daily email around{" "}
        <strong className="text-foreground">7:00 PM Eastern</strong> — only if
        you haven&apos;t completed today&apos;s check-in yet. SMS and custom
        times come later.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <fieldset className="rounded-2xl border border-white/8 bg-card p-5">
          <legend className="px-1 text-sm font-semibold">Email</legend>
          <label className="mt-3 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
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

        <div className="rounded-2xl border border-white/8 bg-card p-5 text-sm">
          <p className="text-muted">Delivery window</p>
          <p className="mt-1 font-medium text-foreground">
            ~7:00 PM Eastern · email only
          </p>
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
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-foreground"
          >
            ← Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-5 py-8">{children}</main>
    </div>
  );
}
