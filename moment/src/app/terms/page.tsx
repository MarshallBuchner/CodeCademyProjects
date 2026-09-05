import Link from "next/link";
import { LegalShell } from "@/components/LegalShell";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/brand";

export const metadata = {
  title: "Terms of Service — MOMENT",
  description: "Terms of use for MOMENT.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <p className="mt-2 text-sm text-muted">Last updated: September 5, 2026</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <h2 className="text-lg font-semibold text-foreground">Agreement</h2>
        <p>
          By using MOMENT (the &quot;Service&quot;), you agree to these Terms of
          Service. If you do not agree, do not use the Service.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          Who can use MOMENT
        </h2>
        <p>
          MOMENT is intended for adults (18+) who want to leave private,
          location-locked memories for themselves or people they choose. You must
          be legally able to enter this agreement in your jurisdiction.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Your account</h2>
        <p>
          You are responsible for the email and devices you use to access MOMENT.
          Keep magic-link emails private. You may delete your account anytime
          from{" "}
          <Link href="/account" className="text-accent">
            Account settings
          </Link>{" "}
          or by emailing{" "}
          <a href={SUPPORT_MAILTO} className="text-accent">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          Content &amp; acceptable use
        </h2>
        <p>
          You own the Moments you create. Do not use MOMENT to harass, stalk,
          defame, or share illegal content. Do not attempt to break security,
          scrape, or spam. We may suspend access if we reasonably believe these
          Terms are violated.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Availability</h2>
        <p>
          We aim for reliable uptime but do not guarantee uninterrupted access.
          Features may change as we improve the product. Map data depends on
          third-party tile and geocoding services.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          Limitation of liability
        </h2>
        <p>
          To the fullest extent permitted by law, MOMENT and its operators are
          not liable for indirect, incidental, or consequential damages arising
          from your use of the Service, including lost Moments or location
          inaccuracy. Use MOMENT at your own risk.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Privacy</h2>
        <p>
          How we handle data is described in our{" "}
          <Link href="/privacy" className="text-accent">
            Privacy Policy
          </Link>
          .
        </p>

        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href={SUPPORT_MAILTO} className="text-accent">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </section>
    </LegalShell>
  );
}
