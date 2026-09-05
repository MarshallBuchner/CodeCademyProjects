import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Support — QuitCurve",
  description: "Get help with QuitCurve accounts, reminders, and your quit plan.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Help
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Support</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We&apos;re a small team shipping QuitCurve for people who want a calmer
          way off nicotine. Reach out anytime—we read every message.
        </p>

        <section className="mt-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">Email us</h2>
            <p className="mt-2 text-sm text-muted">
              Help, feedback, and privacy requests:{" "}
              <a href="mailto:quitcurve@gmail.com" className="text-accent">
                quitcurve@gmail.com
              </a>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-card p-5">
            <h2 className="text-base font-semibold text-foreground">
              Common fixes
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
              <li>
                <strong className="text-foreground">Magic link lands on home:</strong>{" "}
                request and open the link in the same browser (Safari↔Safari or
                Chrome↔Chrome). Prefer webmail over Apple Mail on Mac.
              </li>
              <li>
                <strong className="text-foreground">Reminders:</strong> Dashboard →
                menu → Reminders. Enable email, set your time zone + hour, save.
              </li>
              <li>
                <strong className="text-foreground">Home screen icon:</strong> delete
                the old icon, clear Safari website data for quitcurve.app, then
                Add to Home Screen again.
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

          <div className="rounded-2xl border border-white/10 bg-card p-5">
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
      </main>
    </div>
  );
}
