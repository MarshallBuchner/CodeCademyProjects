"use client";

import { useMemo, useState } from "react";
import { isInAppBrowser, preferredBrowserLabel } from "@/lib/browser";

type Props = {
  /** Force-show even outside known WebViews (e.g. location permission failed). */
  force?: boolean;
  className?: string;
};

export function OpenInBrowserBanner({ force = false, className = "" }: Props) {
  const inApp = useMemo(() => isInAppBrowser(), []);
  const browser = useMemo(() => preferredBrowserLabel(), []);
  const [copied, setCopied] = useState(false);

  if (!force && !inApp) return null;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select-friendly prompt
      window.prompt("Copy this link and open it in your browser:", window.location.href);
    }
  }

  return (
    <div
      className={`rounded-[18px] border border-amber-300/35 bg-amber-300/10 px-4 py-3 text-left ${className}`}
      role="status"
    >
      <p className="text-sm font-medium text-amber-100">
        Location often fails inside Messenger / Instagram
      </p>
      <p className="mt-1 text-xs leading-relaxed text-amber-100/80">
        Tap the ··· menu → <span className="font-medium">Open in {browser}</span>, or copy
        the link and paste it there. GPS needs a real browser to unlock your Moment.
      </p>
      <button
        type="button"
        className="btn-ghost mt-3 w-full text-sm"
        onClick={() => void copyLink()}
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
