"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MomentsOverviewMap } from "@/components/Maps";
import { useMoment } from "@/context/MomentProvider";
import { distanceMeters, formatDistance } from "@/lib/geo";
import { loadOutbox, type OutboundShare } from "@/lib/share";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function MapView() {
  const { moments, userCoords, openMoment, startDrop, refreshLocation } =
    useMoment();

  useEffect(() => {
    void refreshLocation();
  }, [refreshLocation]);

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8 pt-8">
        <h1 className="font-display text-3xl tracking-wide">Map</h1>
        <p className="mt-1 text-sm text-muted">
          Your Moments on a live map — tap a pin to open.
        </p>
        <MomentsOverviewMap
          user={userCoords}
          points={moments.map((m) => ({
            id: m.id,
            coords: m.coords,
            unlocked: Boolean(m.unlockedAt),
          }))}
          className="mt-5 h-[340px]"
          onSelect={openMoment}
        />
        <ul className="mt-5 flex flex-col gap-2">
          {moments.map((m) => {
            const dist =
              userCoords != null ? distanceMeters(userCoords, m.coords) : null;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => openMoment(m.id)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-card px-4 py-3 text-left"
                >
                  <span>
                    <span className="block text-sm font-medium">{m.title}</span>
                    <span className="text-xs text-muted">{m.placeName}</span>
                  </span>
                  <span className="text-xs text-accent">
                    {m.unlockedAt
                      ? "Unlocked"
                      : dist != null
                        ? formatDistance(dist)
                        : "Locked"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="btn-primary mt-6" onClick={startDrop}>
          + Drop a Moment
        </button>
      </main>
      <BottomNav />
    </div>
  );
}

export function ProfileView() {
  const {
    moments,
    setView,
    locationError,
    refreshLocation,
    userCoords,
    cloudUser,
    cloudStatus,
    signInWithEmail,
    signOut,
    syncNow,
  } = useMoment();
  const unlocked = moments.filter((m) => m.unlockedAt).length;
  const [outbox, setOutbox] = useState<OutboundShare[]>([]);
  const [email, setEmail] = useState("");
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cloudReady = isSupabaseConfigured();

  useEffect(() => {
    setOutbox(loadOutbox());
  }, []);

  async function onSignIn() {
    setBusy(true);
    setAuthMsg(null);
    try {
      await signInWithEmail(email);
      setAuthMsg("Check your email for a magic link.");
    } catch (e) {
      setAuthMsg(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8 pt-8">
        <h1 className="font-display text-3xl tracking-wide">Profile</h1>
        <p className="mt-1 text-sm text-muted">
          {cloudUser
            ? `Signed in · ${cloudUser.email}`
            : "Guest mode on this device — enable cloud sync below."}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-white/8 bg-card p-4">
            <p className="text-2xl font-semibold text-accent">{moments.length}</p>
            <p className="mt-1 text-xs text-muted">Moments dropped</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-card p-4">
            <p className="text-2xl font-semibold text-accent">{unlocked}</p>
            <p className="mt-1 text-xs text-muted">Unlocked</p>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-white/8 bg-card p-4">
          <p className="text-sm font-medium">Cloud sync</p>
          {!cloudReady ? (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Add Supabase keys to <code className="text-accent">.env.local</code>{" "}
              (see SETUP.md). Until then everything stays on this phone — maps
              still work fully.
            </p>
          ) : cloudUser ? (
            <>
              <p className="mt-2 text-xs text-muted">
                Status: {cloudStatus}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="btn-ghost flex-1 text-sm"
                  onClick={() => void syncNow()}
                >
                  Sync now
                </button>
                <button
                  type="button"
                  className="btn-ghost flex-1 text-sm"
                  onClick={() => void signOut()}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-xs text-muted">
                Magic-link sign-in syncs Moments across devices.
              </p>
              <input
                className="field mt-3"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
              <button
                type="button"
                className="btn-primary mt-3 w-full"
                disabled={busy || !email.trim()}
                onClick={() => void onSignIn()}
              >
                {busy ? "Sending…" : "Email me a magic link"}
              </button>
              {authMsg && <p className="mt-2 text-xs text-accent">{authMsg}</p>}
            </>
          )}
        </div>

        <div className="mt-5 rounded-[22px] border border-white/8 bg-card p-4">
          <p className="text-sm font-medium">Location</p>
          <p className="mt-1 text-xs text-muted">
            {userCoords
              ? `${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)}`
              : locationError ?? "Waiting for GPS…"}
          </p>
          <button
            type="button"
            className="btn-ghost mt-3 w-full text-sm"
            onClick={() => void refreshLocation()}
          >
            Refresh location
          </button>
        </div>

        <div className="mt-5 rounded-[22px] border border-white/8 bg-card p-4">
          <p className="text-sm font-medium">Sent privately</p>
          <p className="mt-1 text-xs text-muted">
            Secret links only work for people you send them to (plus optional PIN).
          </p>
          {outbox.length === 0 ? (
            <p className="mt-3 text-xs text-muted">No shared Moments yet.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {outbox.map((s) => (
                <li
                  key={s.shareId}
                  className="rounded-xl border border-white/8 bg-black/25 px-3 py-2"
                >
                  <p className="text-sm">{s.title}</p>
                  <p className="text-xs text-muted">
                    For {s.recipientName} · {s.placeName}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          className="btn-ghost mt-4"
          onClick={() => setView("welcome")}
        >
          Back to welcome
        </button>
      </main>
      <BottomNav />
    </div>
  );
}
