"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useQuitCurve } from "@/context/QuitCurveProvider";

function LoginForm() {
  const router = useRouter();
  const { login, cloudEnabled } = useQuitCurve();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth") {
      setError("Sign-in link expired. Please try again.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.mode === "magic_link") {
      setMagicLinkSent(true);
      return;
    }

    if (result.user) {
      router.push("/dashboard");
    } else {
      setError("No account found. Complete onboarding to create one.");
    }
  };

  return (
    <>
      {magicLinkSent ? (
        <div className="mt-6 max-w-sm text-center">
          <p className="text-sm text-muted">
            We sent a magic link to <strong>{email}</strong>. Tap it in your
            email to sign in and sync your progress.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block text-sm text-accent"
          >
            Continue to dashboard →
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">
            {cloudEnabled
              ? "We'll email you a sign-in link"
              : "Sign in with your email"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm outline-none focus:border-accent/50"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-4 text-sm font-semibold text-background disabled:opacity-50"
            >
              {loading ? "Sending..." : cloudEnabled ? "Send magic link" : "Sign in"}
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <Logo />
      <h1 className="mt-8 text-2xl font-bold">Welcome back</h1>
      <Suspense fallback={<p className="mt-4 text-sm text-muted">Loading...</p>}>
        <LoginForm />
      </Suspense>
      <Link href="/" className="mt-6 text-sm text-muted">
        Back to home
      </Link>
    </div>
  );
}
