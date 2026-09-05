"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  momentTitle: string;
  onDelete: () => void;
};

export function MomentOverflowMenu({ momentTitle, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function confirmDelete() {
    setOpen(false);
    const ok = window.confirm(
      `Delete “${momentTitle}”? This can’t be undone.`,
    );
    if (ok) onDelete();
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Moment options"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-white/8 hover:text-foreground"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-10 z-30 min-w-[148px] overflow-hidden rounded-2xl border border-white/12 bg-[#14181f] py-1 shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-red-300 transition hover:bg-white/6"
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete();
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
            Delete Moment
          </button>
        </div>
      ) : null}
    </div>
  );
}
