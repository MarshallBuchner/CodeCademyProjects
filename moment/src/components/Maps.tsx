"use client";

import dynamic from "next/dynamic";

export const PlacePickerMap = dynamic(
  () => import("./RealMap").then((m) => m.PlacePickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center rounded-[28px] border border-white/8 bg-[#0a0b10] text-sm text-muted">
        Loading map…
      </div>
    ),
  },
);

export const JourneyMap = dynamic(
  () => import("./RealMap").then((m) => m.JourneyMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center rounded-[28px] border border-white/8 bg-[#0a0b10] text-sm text-muted">
        Loading map…
      </div>
    ),
  },
);

export const MomentsOverviewMap = dynamic(
  () => import("./RealMap").then((m) => m.MomentsOverviewMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center rounded-[28px] border border-white/8 bg-[#0a0b10] text-sm text-muted">
        Loading map…
      </div>
    ),
  },
);
