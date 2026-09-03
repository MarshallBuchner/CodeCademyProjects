"use client";

import { DropLeave, DropPlace, DropRecord } from "@/components/DropFlow";
import { Home } from "@/components/Home";
import { LockedView, UnlockedView } from "@/components/LockedUnlocked";
import { MapView, ProfileView } from "@/components/MapAndProfile";
import { TraditionsView } from "@/components/TraditionsView";
import { Welcome } from "@/components/Welcome";
import { useMoment } from "@/context/MomentProvider";

export function AppShell() {
  const { ready, view } = useMoment();

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  switch (view) {
    case "welcome":
      return <Welcome />;
    case "home":
      return <Home />;
    case "map":
      return <MapView />;
    case "traditions":
      return <TraditionsView />;
    case "profile":
      return <ProfileView />;
    case "drop-place":
      return <DropPlace />;
    case "drop-record":
      return <DropRecord />;
    case "drop-leave":
      return <DropLeave />;
    case "locked":
      return <LockedView />;
    case "unlocked":
      return <UnlockedView />;
    default:
      return <Home />;
  }
}
