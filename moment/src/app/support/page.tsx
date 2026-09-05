import Link from "next/link";
import { LegalShell } from "@/components/LegalShell";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/brand";

export const metadata = {
  title: "Support — MOMENT",
  description: "Get help with MOMENT accounts, unlocks, and sharing.",
};

export default function SupportPage() {
  return (
    <LegalShell title="Support" eyebrow="Help">
      <p className="mt-3 text-sm leading-relaxed text-muted">
        We&apos;re shipping MOMENT for people who want places to hold meaning.
        Reach out anytime — we read every message.
      </p>

      <section className="mt-10 space-y-6">
        <div className="rounded-[22px] border border-white/10 bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Email us</h2>
          <p className="mt-2 text-sm text-muted">
            Help, feedback, and privacy requests:{" "}
            <a href={SUPPORT_MAILTO} className="text-accent">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">
            Common fixes
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>
              <strong className="text-foreground">Magic link:</strong> request
              the link in Safari (or the browser you use for MOMENT), then open
              it in that same browser. Prefer Gmail in the browser over the Mail
              app. Old links expire after one use — request a fresh one.
            </li>
            <li>
              <strong className="text-foreground">Unlock:</strong> allow location
              when prompted, stand near the drop pin, or use Simulate arrival on
              desktop demos.
            </li>
            <li>
              <strong className="text-foreground">Home screen:</strong> Safari →
              Share → Add to Home Screen. If the icon looks stale, remove it and
              add again.
            </li>
            <li>
              <strong className="text-foreground">Delete account:</strong>{" "}
              <Link href="/account" className="text-accent">
                Account settings
              </Link>
              .
            </li>
          </ul>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Policies</h2>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <Link href="/privacy" className="text-accent">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-accent">
              Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </LegalShell>
  );
}
