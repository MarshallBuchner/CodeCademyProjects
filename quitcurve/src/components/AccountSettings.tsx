"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useQuitCurve } from "@/context/QuitCurveProvider";

export function AccountSettings() {
  const router = useRouter();
  const { user, cloudEnabled, logout, deleteAccount } = useQuitCurve();
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (confirm.trim().toUpperCase() !== "DELETE") {
      setError('Type DELETE to confirm.');
      return;
    }
    setBusy(true);
    setError("");
    const result = await deleteAccount();
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/");
  };

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

      <main className="mx-auto max-w-lg px-5 py-10">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold">Account</h1>

        {!user ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-card p-5">
            <p className="text-sm text-muted">
              You&apos;re using QuitCurve as a guest. Sign in to sync across
              devices, or clear guest data from this browser below.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm text-accent"
            >
              Sign in →
            </Link>
            <button
              type="button"
              onClick={async () => {
                await deleteAccount();
                router.push("/");
              }}
              className="mt-6 w-full rounded-full border border-red-500/40 py-3 text-sm text-red-300"
            >
              Clear guest data on this device
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-card p-5">
              <p className="text-xs uppercase tracking-wider text-muted">
                Signed in as
              </p>
              <p className="mt-1 text-sm text-foreground">{user.email}</p>
              {user.name && (
                <p className="mt-1 text-sm text-muted">{user.name}</p>
              )}
              <p className="mt-3 text-xs text-muted">
                {cloudEnabled
                  ? "Progress syncs to your QuitCurve cloud account."
                  : "Local-only mode (cloud sync not configured)."}
              </p>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
                className="mt-4 text-sm text-muted hover:text-foreground"
              >
                Sign out
              </button>
            </div>

            <div className="rounded-2xl border border-red-500/30 bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">
                Delete account
              </h2>
              <p className="mt-2 text-sm text-muted">
                Permanently deletes your QuitCurve account, quit plan, craving
                logs, puff logs, check-ins, and reminder settings. This cannot be
                undone.
              </p>
              <label className="mt-4 block text-xs text-muted">
                Type DELETE to confirm
                <input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm outline-none focus:border-accent/50"
                  placeholder="DELETE"
                  autoComplete="off"
                />
              </label>
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              <button
                type="button"
                disabled={busy}
                onClick={handleDelete}
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
