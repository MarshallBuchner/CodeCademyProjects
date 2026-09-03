"use client";

import type { ReactNode } from "react";
import { useMoment } from "@/context/MomentProvider";
import type { AppView } from "@/lib/types";

const tabs: { id: AppView; label: string; icon: ReactNode }[] = [
  {
    id: "home",
    label: "Moments",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "map",
    label: "Map",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M9 3l-6 2v16l6-2 6 2 6-2V1l-6 2-6-2z" />
        <path d="M9 3v16M15 5v16" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const { view, setView } = useMoment();
  const active = view === "home" || view === "map" || view === "profile" ? view : "home";

  return (
    <nav className="safe-bottom sticky bottom-0 z-20 border-t border-white/8 bg-[#07080c]/92 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isOn = active === tab.id;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => setView(tab.id)}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] tracking-wide transition ${
                  isOn ? "text-accent" : "text-muted hover:text-foreground/80"
                }`}
              >
                <span className={isOn ? "drop-shadow-[0_0_10px_rgba(255,138,42,0.55)]" : ""}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
