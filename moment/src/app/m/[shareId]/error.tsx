"use client";

import Link from "next/link";

export default function SharedMomentError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-xs tracking-[0.22em] text-accent uppercase">MOMENT</p>
      <h1 className="font-display mt-3 text-3xl tracking-wide">Couldn’t open this Moment</h1>
      <p className="mt-2 text-sm text-muted">
        Safari sometimes runs out of memory on big photos or maps. Try Reload —
        or open the link again from Safari (not inside Messenger).
      </p>
      <button type="button" className="btn-primary mt-8 w-full" onClick={reset}>
        Reload
      </button>
      <Link href="/" className="btn-ghost mt-3 w-full text-center">
        Open MOMENT home
      </Link>
    </main>
  );
}
