import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How POWR handles your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-5 py-10">
      <Logo size="sm" />
      <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-white/50">Last updated: September 5, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-white/70">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <p>
            POWR helps hockey players analyze skating video and track development
            over time. This policy explains what we collect and how we use it.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">What we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Account email</strong> if you sign in
              with a magic link
            </li>
            <li>
              <strong className="text-white">Assessment data</strong> — focus area,
              scores, coaching notes, and drills from your reports
            </li>
            <li>
              <strong className="text-white">Video frames</strong> temporarily used
              to generate an assessment (not kept as a public gallery)
            </li>
            <li>
              <strong className="text-white">Guest mode</strong> stores assessments
              on-device until you create an account
            </li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">How we use data</h2>
          <p>
            We use your data to deliver assessments, save history, show progress,
            and improve POWR. We do not sell personal data.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Storage</h2>
          <p>
            Signed-in data is stored in Supabase with row-level security so only
            you can access your assessments. Guest data stays in your browser
            storage.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Your rights</h2>
          <p>
            Request access, correction, or deletion anytime at{" "}
            <a className="text-[#7dffb3]" href="mailto:privacy@powrhockey.app">
              privacy@powrhockey.app
            </a>
            .
          </p>
        </section>
      </div>

      <Link href="/" className="mt-10 inline-block text-sm text-white/55">
        ← Back to POWR
      </Link>
    </div>
  );
}
