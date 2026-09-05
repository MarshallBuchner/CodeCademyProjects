"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo, Wordmark } from "@/components/Logo";
import { useMoment } from "@/context/MomentProvider";
import { clearLocalMomentData } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AccountSettings() {
  const { cloudUser, signOut } = useMoment();
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cloudReady = isSupabaseConfigured();

  async function wipeLocalAndGoHome() {
    clearLocalMomentData();
    window.location.assign("/");
  }

  async function handleDelete() {
    if (confirm.trim().toUpperCase() !== "DELETE") {
      setError("Type DELETE to confirm.");
      return;
    }
    setBusy(true);
    setError("");

    if (!cloudUser) {
      await wipeLocalAndGoHome();
      return;
    }

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Could not delete account.");
        setBusy(false);
        return;
      }
      await wipeLocalAndGoHome();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-white/8 px-5 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={36} glow={false} />
            <Wordmark className="text-sm" />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted transition hover:text-foreground"
          >
            ← App
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-10">
        <p className="text-xs font-medium tracking-[0.28em] text-accent uppercase">
          Settings
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-wide">Account</h1>

        {!cloudUser ? (
          <div className="mt-8 rounded-[22px] border border-white/10 bg-card p-5">
            <p className="text-sm text-muted">
              You&apos;re using MOMENT as a guest on this device.
              {cloudReady
                ? " Sign in from Profile to sync across phones."
                : " Cloud sync isn’t configured on this deploy yet."}
            </p>
            <button
              type="button"
              onClick={() => void wipeLocalAndGoHome()}
              className="mt-6 w-full rounded-full border border-red-500/40 py-3 text-sm text-red-300"
            >
              Clear guest data on this device
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-[22px] border border-white/10 bg-card p-5">
              <p className="text-xs tracking-wider text-muted uppercase">
                Signed in as
              </p>
              <p className="mt-1 text-sm text-foreground">{cloudUser.email}</p>
              <p className="mt-3 text-xs text-muted">
                Moments sync to your MOMENT cloud account when signed in.
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-4 text-sm text-muted hover:text-foreground"
              >
                Sign out
              </button>
            </div>

            <div className="rounded-[22px] border border-red-500/30 bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">
                Delete account
              </h2>
              <p className="mt-2 text-sm text-muted">
                Permanently deletes your MOMENT account and cloud Moments. Local
                data on this device is cleared too. This cannot be undone.
              </p>
              <label className="mt-4 block text-xs text-muted">
                Type DELETE to confirm
                <input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="field mt-2"
                  placeholder="DELETE"
                  autoComplete="off"
                />
              </label>
              {error ? (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleDelete()}
                className="mt-4 w-full rounded-full bg-red-500/90 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4 text-xs text-muted">
          <Link href="/privacy" className="hover:text-accent">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-accent">
            Terms
          </Link>
          <Link href="/support" className="hover:text-accent">
            Support
          </Link>
        </div>
      </main>
    </div>
  );
}
