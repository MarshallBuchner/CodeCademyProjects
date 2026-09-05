import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "@/app/components/AppHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | POWR",
  description: "How POWR handles player data, assessments, and privacy.",
};

export default function PrivacyPage() {
  return (
    <div>
      <AppHeader />
      <main className="app-shell" style={{ maxWidth: 720, margin: "0 auto" }}>
        <p className="eyebrow">LEGAL</p>
        <h1>Privacy Policy</h1>
        <p style={{ opacity: 0.6 }}>Last updated: September 5, 2026</p>

        <div style={{ display: "grid", gap: 18, marginTop: 28, lineHeight: 1.6 }}>
          <section>
            <h2>Overview</h2>
            <p>
              POWR analyzes skating video and helps players track development over
              time. This policy explains what we collect and how we use it.
            </p>
          </section>
          <section>
            <h2>What we collect</h2>
            <ul>
              <li>Email address if you sign in with a magic link</li>
              <li>
                Assessment data (focus area, scores, coaching notes, drills)
              </li>
              <li>
                Temporary video frames used to generate an assessment
              </li>
              <li>Guest-mode assessments stored on your device until you sign in</li>
            </ul>
          </section>
          <section>
            <h2>How we use data</h2>
            <p>
              We use your data to deliver assessments, save history, show progress,
              and improve POWR. We do not sell personal data.
            </p>
          </section>
          <section>
            <h2>Storage</h2>
            <p>
              Signed-in assessments are stored in Supabase with row-level security.
              Guest assessments stay in browser storage on your device.
            </p>
          </section>
          <section>
            <h2>Contact</h2>
            <p>
              Questions or deletion requests:{" "}
              <a href="mailto:privacy@powrhockey.app" style={{ color: "#6dffae" }}>
                privacy@powrhockey.app
              </a>
            </p>
          </section>
        </div>

        <Link href="/" style={{ display: "inline-block", marginTop: 32, opacity: 0.7 }}>
          ← Back to POWR
        </Link>
      </main>
    </div>
  );
}
