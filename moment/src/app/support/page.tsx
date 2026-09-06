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
              the link in the same browser or app you use for MOMENT, then open
              it there. On iPhone, prefer opening Gmail in Safari (or stay
              inside the MOMENT app WebView) over the Mail app. Old links expire
              after one use — request a fresh one.
            </li>
            <li>
              <strong className="text-foreground">Unlock:</strong> allow location
              when prompted and stand near the drop pin. On your own Moments in
              the app, you can use Simulate arrival for demos.
            </li>
            <li>
              <strong className="text-foreground">Native / App Store app:</strong>{" "}
              location unlocks Moments at the drop place; camera, mic, and
              photos are only used when you attach Moment media.
            </li>
            <li>
              <strong className="text-foreground">Home screen (PWA):</strong>{" "}
              Safari → Share → Add to Home Screen. If the icon looks stale,
              remove it and add again.
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
          <h2 className="text-base font-semibold text-foreground">
            Report abuse
          </h2>
          <p className="mt-2 text-sm text-muted">
            Moments are private, but if you receive harmful content or someone
            is misusing MOMENT, email{" "}
            <a href={SUPPORT_MAILTO} className="text-accent">
              {SUPPORT_EMAIL}
            </a>{" "}
            with the share link or details. We review reports and may remove
            content or suspend access.
          </p>
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
