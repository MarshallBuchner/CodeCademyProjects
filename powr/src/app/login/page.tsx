"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { usePowr } from "@/context/PowrProvider";

export default function LoginPage() {
  const { requestMagicLink, cloudEnabled, user } = usePowr();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth") {
      setError("Sign-in link expired or invalid. Try again.");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await requestMagicLink(email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-12">
      <Logo />
      <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Save your POWR progress
      </h1>
      <p className="mt-3 text-sm text-white/65">
        Magic-link sign-in keeps assessments, scores, and progress synced across
        devices.
      </p>

      {!cloudEnabled ? (
        <p className="mt-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
          Cloud accounts are not configured yet. Add{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, run{" "}
          <code>supabase/schema.sql</code>, then redeploy.
        </p>
      ) : user ? (
        <p className="mt-6 text-sm text-white/75">
          Signed in as {user.email}.{" "}
          <Link href="/dashboard" className="text-[#7dffb3]">
            Go to history →
          </Link>
        </p>
      ) : sent ? (
        <p className="mt-6 rounded-2xl border border-[#7dffb3]/25 bg-[#7dffb3]/10 p-4 text-sm text-white/80">
          Check <strong>{email}</strong> for your sign-in link.
        </p>
      ) : (
        <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#7dffb3]/50"
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#7dffb3] py-3 text-sm font-semibold text-[#041016] disabled:opacity-60"
          >
            {loading ? "Sending…" : "Email me a magic link"}
          </button>
        </form>
      )}

      <Link href="/" className="mt-8 text-sm text-white/55 hover:text-white">
        ← Back to POWR
      </Link>
    </div>
  );
}
