"use client";

import { Component, type ReactNode } from "react";

/** Catch Leaflet crashes so Safari doesn't kill the whole tab. */
export class MapSafeBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        this.props.fallback ?? (
          <div className="grid h-full min-h-[200px] place-items-center rounded-[28px] border border-white/8 bg-[#0a0b10] px-4 text-center text-sm text-muted">
            Map couldn&apos;t load on this device. You can still use search and lists.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
