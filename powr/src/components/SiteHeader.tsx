"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { usePowr } from "@/context/PowrProvider";

export function SiteHeader() {
  const { user, signOut, cloudEnabled } = usePowr();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#041016]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Logo size="sm" />
        <nav className="flex items-center gap-4 text-sm text-white/70">
          <Link href="/#start" className="hover:text-white">
            Assess
          </Link>
          <Link href="/dashboard" className="hover:text-white">
            History
          </Link>
          <Link href="/progress" className="hover:text-white">
            Progress
          </Link>
          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-full border border-white/15 px-3 py-1.5 text-white hover:border-white/40"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[#7dffb3] px-3 py-1.5 font-semibold text-[#041016]"
            >
              {cloudEnabled ? "Save progress" : "Sign in"}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
