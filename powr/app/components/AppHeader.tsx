"use client";

import Link from "next/link";
import { usePowrAuth } from "@/lib/PowrAuthProvider";

export default function AppHeader() {
  const { user, signOut, cloudEnabled } = usePowrAuth();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(12px)",
        background: "rgba(4, 16, 14, 0.82)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <strong style={{ letterSpacing: "0.14em" }}>POWR</strong>
        </Link>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 14,
            opacity: 0.9,
          }}
        >
          <Link href="/#start-assessment" style={{ color: "inherit" }}>
            Assess
          </Link>
          <Link href="/dashboard" style={{ color: "inherit" }}>
            History
          </Link>
          <Link href="/progress" style={{ color: "inherit" }}>
            Progress
          </Link>
          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                background: "transparent",
                color: "inherit",
                borderRadius: 999,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              style={{
                background: "#6dffae",
                color: "#04140f",
                borderRadius: 999,
                padding: "6px 12px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              {cloudEnabled ? "Save progress" : "Sign in"}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
