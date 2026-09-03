"use client";

import type { Coords } from "@/lib/types";

type Props = {
  mode: "pin" | "path" | "arrive";
  user?: Coords | null;
  target?: Coords | null;
  className?: string;
  label?: string;
};

/** Stylized dark city map — matches mock atmosphere without requiring a map API key */
export function MapCanvas({
  mode,
  className = "",
  label,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/8 bg-[#0a0b10] ${className}`}
    >
      <div className="map-grid absolute inset-0 opacity-70" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 360 420"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Building blocks */}
        <g fill="#14161f" stroke="#1e2230" strokeWidth="1">
          <rect x="24" y="48" width="54" height="72" rx="4" />
          <rect x="90" y="28" width="40" height="110" rx="4" />
          <rect x="148" y="64" width="70" height="90" rx="4" />
          <rect x="236" y="36" width="48" height="100" rx="4" />
          <rect x="296" y="70" width="40" height="86" rx="4" />
          <rect x="40" y="180" width="62" height="58" rx="4" />
          <rect x="120" y="200" width="90" height="70" rx="4" />
          <rect x="230" y="188" width="70" height="80" rx="4" />
          <rect x="50" y="300" width="80" height="70" rx="4" />
          <rect x="160" y="310" width="55" height="60" rx="4" />
          <rect x="240" y="290" width="78" height="80" rx="4" />
        </g>
        {/* Streets */}
        <g stroke="#252a38" strokeWidth="10" strokeLinecap="round">
          <path d="M0 160 H360" />
          <path d="M0 280 H360" />
          <path d="M110 0 V420" />
          <path d="M250 0 V420" />
        </g>
        <g stroke="#2f3548" strokeWidth="2" strokeDasharray="4 8" opacity="0.6">
          <path d="M0 160 H360" />
          <path d="M110 0 V420" />
        </g>

        {mode === "path" && (
          <path
            d="M90 340 C140 280, 170 240, 200 200 C230 160, 250 140, 280 120"
            fill="none"
            stroke="#FF8A2A"
            strokeWidth="3"
            strokeDasharray="6 10"
            strokeLinecap="round"
            className="animate-dash"
          />
        )}

        {mode === "pin" && (
          <g transform="translate(180 200)">
            <circle r="42" fill="url(#glow)" opacity="0.55" />
            <circle r="28" fill="none" stroke="#FF8A2A" strokeWidth="2" opacity="0.45" />
            <circle r="16" fill="none" stroke="#FFB067" strokeWidth="2" opacity="0.7" />
            <circle r="6" fill="#FF8A2A" />
            <path
              d="M0 -34 C10 -20 10 -8 0 0 C-10 -8 -10 -20 0 -34Z"
              fill="#FF8A2A"
              transform="translate(0 -8)"
            />
            <circle cx="0" cy="-28" r="3.5" fill="#1a1008" />
          </g>
        )}

        {mode === "path" && (
          <g transform="translate(280 120)">
            <circle r="46" fill="url(#glow)" opacity="0.5" />
            <circle r="34" fill="#12131a" stroke="#FF8A2A" strokeWidth="2.5" />
            <path
              d="M-8 -2 h10 v10 h4 v-10 h10 v-4 h-10 v-10 h-4 v10 h-10z"
              fill="none"
              transform="translate(0 2) scale(0.85)"
            />
            <rect
              x="-10"
              y="-2"
              width="20"
              height="14"
              rx="3"
              fill="none"
              stroke="#FFB067"
              strokeWidth="2"
            />
            <path
              d="M-6 -2 v-6 a6 6 0 0 1 12 0 v6"
              fill="none"
              stroke="#FFB067"
              strokeWidth="2"
            />
          </g>
        )}

        {mode === "arrive" && (
          <g transform="translate(180 200)">
            <circle r="48" fill="url(#glow)" opacity="0.45" />
            <circle r="34" fill="#12131a" stroke="#FF8A2A" strokeWidth="2.5" />
            <path
              d="M-10 0 L-3 8 L12 -10"
              fill="none"
              stroke="#FFB067"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8A2A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF8A2A" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
      {label && (
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md">
          <p className="text-sm text-foreground/90">{label}</p>
        </div>
      )}
    </div>
  );
}
