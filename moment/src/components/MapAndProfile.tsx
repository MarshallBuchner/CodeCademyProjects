"use client";

import { BottomNav } from "@/components/BottomNav";
import { MapCanvas } from "@/components/MapCanvas";
import { useMoment } from "@/context/MomentProvider";
import { distanceMeters, formatDistance } from "@/lib/geo";

export function MapView() {
  const { moments, userCoords, openMoment, startDrop } = useMoment();

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8 pt-8">
        <h1 className="font-display text-3xl tracking-wide">Map</h1>
        <p className="mt-1 text-sm text-muted">Your Moments on the map.</p>
        <MapCanvas mode="pin" className="mt-5 h-[340px]" />
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
  const { moments, setView, locationError, refreshLocation, userCoords } =
    useMoment();
  const unlocked = moments.filter((m) => m.unlockedAt).length;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8 pt-8">
        <h1 className="font-display text-3xl tracking-wide">Profile</h1>
        <p className="mt-1 text-sm text-muted">Private by default. Guest mode on this device.</p>

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
