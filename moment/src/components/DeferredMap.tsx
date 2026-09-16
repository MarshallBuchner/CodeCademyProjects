"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MapSafeBoundary } from "@/components/MapSafeBoundary";

/**
 * Delay Leaflet mount so Welcome→Home / Drop transitions don't spike Safari
 * memory alongside GPS + localStorage hydrate.
 */
export function DeferredMap({
  children,
  className = "",
  delayMs = 350,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);

  if (!show) {
    return (
      <div
        className={`grid place-items-center rounded-[28px] border border-white/8 bg-[#0a0b10] text-sm text-muted ${className}`}
      >
        Loading map…
      </div>
    );
  }

  return <MapSafeBoundary>{children}</MapSafeBoundary>;
}
