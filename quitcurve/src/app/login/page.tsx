"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useQuitCurve } from "@/context/QuitCurveProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useQuitCurve();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email);
    if (user) {
      router.push("/dashboard");
    } else {
      setError("No account found. Complete onboarding to create one.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <Logo />
      <h1 className="mt-8 text-2xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Sign in with your email</p>

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
          className="w-full rounded-full bg-accent py-4 text-sm font-semibold text-background"
        >
          Sign in
        </button>
      </form>

      <Link href="/" className="mt-6 text-sm text-muted">
        Back to home
      </Link>
    </div>
  );
}
