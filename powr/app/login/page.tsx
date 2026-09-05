"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "@/app/components/AppHeader";
import { usePowrAuth } from "@/lib/PowrAuthProvider";

export default function LoginPage() {
  const { requestMagicLink, cloudEnabled, user } = usePowrAuth();
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
    <div>
      <AppHeader />
      <main className="app-shell" style={{ maxWidth: 520, margin: "0 auto" }}>
        <p className="eyebrow">ACCOUNT</p>
        <h1>Save your POWR progress</h1>
        <p>
          Magic-link sign-in keeps assessments, scores, and progress synced across
          devices — so players can come back and see improvement over time.
        </p>

        {!cloudEnabled ? (
          <p
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(255, 196, 92, 0.35)",
              background: "rgba(255, 196, 92, 0.08)",
            }}
          >
            Cloud accounts are not configured yet. Add{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, run{" "}
            <code>supabase/schema.sql</code>, then redeploy. Guest saves still work
            on-device.
          </p>
        ) : user ? (
          <p style={{ marginTop: 20 }}>
            Signed in as {user.email}.{" "}
            <Link href="/dashboard" style={{ color: "#6dffae" }}>
              Go to history →
            </Link>
          </p>
        ) : sent ? (
          <p
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(109, 255, 174, 0.3)",
              background: "rgba(109, 255, 174, 0.08)",
            }}
          >
            Check <strong>{email}</strong> for your sign-in link.
          </p>
        ) : (
          <form
            onSubmit={(e) => void onSubmit(e)}
            style={{ display: "grid", gap: 12, marginTop: 24 }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                color: "inherit",
                padding: "14px 16px",
              }}
            />
            {error ? (
              <p style={{ color: "#ff8f8f", margin: 0, fontSize: 14 }}>{error}</p>
            ) : null}
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Sending…" : "Email me a magic link"}
            </button>
          </form>
        )}

        <Link href="/" style={{ display: "inline-block", marginTop: 28, opacity: 0.7 }}>
          ← Back to POWR
        </Link>
      </main>
    </div>
  );
}
