import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MOMENT handles your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh city-glow relative">
      <header className="relative z-10 border-b border-white/5 px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" aria-label="MOMENT home">
            <Logo />
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Back
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-display text-3xl text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: September 4, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>
            <p>
              MOMENT (&quot;we&quot;, &quot;our&quot;) lets you leave location-locked
              digital time capsules — photos, video, or written notes — and unlock
              them when you return. This policy explains what we collect and how we
              use it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Location:</strong> approximate
                GPS coordinates to pin Moments and unlock them within the geofence
                (used only for that purpose)
              </li>
              <li>
                <strong className="text-foreground">Moment content:</strong> titles,
                notes, photos, video, and optional voice you choose to leave
              </li>
              <li>
                <strong className="text-foreground">Account info:</strong> email if
                you sign in for cloud sync
              </li>
              <li>
                <strong className="text-foreground">Guest mode:</strong> without an
                account, Moments stay on-device (localStorage) unless you create a
                share link
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">How we use data</h2>
            <p>
              We use your data only to provide MOMENT: storing capsules, enforcing
              location unlock, powering share links, and syncing across devices when
              signed in. We do not sell personal data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Storage</h2>
            <p>
              Guest data stays on your device. Signed-in sync uses Supabase
              (encrypted in transit and at rest). Share links may embed capsule
              payload in the URL hash for cross-device unlock without an account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Third-party services
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Supabase</strong> — auth and sync
                (supabase.com/privacy)
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> — hosting
                (vercel.com/legal/privacy-policy)
              </li>
              <li>
                <strong className="text-foreground">OpenStreetMap / Nominatim</strong>{" "}
                — map tiles and place search
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Your rights</h2>
            <p>
              Request access, correction, or deletion anytime at{" "}
              <a href="mailto:privacy@moment.app" className="text-accent">
                privacy@moment.app
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p>
              Questions? Email{" "}
              <a href="mailto:privacy@moment.app" className="text-accent">
                privacy@moment.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
