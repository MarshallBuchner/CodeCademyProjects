import Link from "next/link";
import { LegalShell } from "@/components/LegalShell";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/brand";

export const metadata = {
  title: "Privacy Policy — MOMENT",
  description: "How MOMENT handles your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p className="mt-2 text-sm text-muted">Last updated: September 5, 2026</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <h2 className="text-lg font-semibold text-foreground">Overview</h2>
        <p>
          MOMENT (&quot;we&quot;, &quot;our&quot;) lets you leave location-locked
          digital Moments — photos, video, audio, and notes — to unlock later at
          a place that matters. This policy explains what we collect and how we
          use it.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          What we collect
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Account info:</strong> email
            address if you sign in with a magic link
          </li>
          <li>
            <strong className="text-foreground">Moment content:</strong> titles,
            notes, media you attach, place names, and map coordinates you choose
          </li>
          <li>
            <strong className="text-foreground">Location:</strong> your device
            GPS (with permission) to unlock Moments near the drop point — used
            on-device for distance checks
          </li>
          <li>
            <strong className="text-foreground">Guest mode:</strong> without an
            account, Moments stay in your browser storage on that device
          </li>
          <li>
            <strong className="text-foreground">Shares:</strong> recipient name /
            email and optional PIN when you send a private Moment
          </li>
          <li>
            <strong className="text-foreground">Product analytics:</strong>{" "}
            anonymous traffic via Vercel Analytics (not Moment contents)
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">
          How we use your data
        </h2>
        <p>
          We use your data to run MOMENT: store and sync Moments you create,
          unlock them at the right place, deliver private shares you send, and
          improve reliability. We do not sell your personal data.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Data storage</h2>
        <p>
          Signed-in Moments sync via Supabase (encrypted in transit and at rest).
          Guest-mode data stays on your device unless you sign in or share a
          link. Large media may remain device-local until cloud Storage is
          enabled for your project.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          Third-party services
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Supabase</strong> — auth and
            database (supabase.com/privacy)
          </li>
          <li>
            <strong className="text-foreground">Vercel</strong> — hosting and
            Analytics (vercel.com/legal/privacy-policy)
          </li>
          <li>
            <strong className="text-foreground">Resend</strong> — transactional
            email for magic links when configured
            (resend.com/legal/privacy-policy)
          </li>
          <li>
            <strong className="text-foreground">OpenStreetMap / Nominatim</strong>{" "}
            — map tiles and place search (no Moment contents sent)
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">
          Location &amp; sharing
        </h2>
        <p>
          Moments you drop are private by default. Shared Moments are only
          accessible to people you choose (secret link and/or account email).
          Recipients still need to be at the place to unlock content. Do not
          leave Moments that put anyone at risk or reveal sensitive personal
          information of others without consent.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Your rights</h2>
        <p>
          You may access, correct, or delete your data. Signed-in users can
          delete their account in{" "}
          <Link href="/account" className="text-accent">
            Account settings
          </Link>
          . You can also email{" "}
          <a href={SUPPORT_MAILTO} className="text-accent">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          Changes to this policy
        </h2>
        <p>
          We may update this policy from time to time. Continued use of MOMENT
          after changes constitutes acceptance of the updated policy.
        </p>

        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p>
          Questions? Email{" "}
          <a href={SUPPORT_MAILTO} className="text-accent">
            {SUPPORT_EMAIL}
          </a>{" "}
          or visit{" "}
          <Link href="/support" className="text-accent">
            Support
          </Link>
          .
        </p>
      </section>
    </LegalShell>
  );
}
