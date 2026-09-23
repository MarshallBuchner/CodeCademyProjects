"use client";

import { useEffect } from "react";
import { DropLeave, DropPlace, DropRecord } from "@/components/DropFlow";
import { Home } from "@/components/Home";
import { LockedView, UnlockedView } from "@/components/LockedUnlocked";
import { MapView, ProfileView } from "@/components/MapAndProfile";
import { TraditionsView } from "@/components/TraditionsView";
import { Welcome } from "@/components/Welcome";
import { useMoment } from "@/context/MomentProvider";

export function AppShell() {
  const { ready, view, setView } = useMoment();

  // Magic-link callback lands on /?signedIn=1 or /?view=profile
  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const wantsProfile =
      params.get("view") === "profile" ||
      params.get("signedIn") === "1" ||
      params.has("authError");
    if (!wantsProfile) return;
    setView("profile");
    // Clean the URL so refresh doesn't keep re-triggering
    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    url.searchParams.delete("signedIn");
    url.searchParams.delete("authError");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  }, [ready, setView]);

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
