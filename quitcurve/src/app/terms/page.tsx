import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Terms of Service — QuitCurve",
  description: "Terms of use for the QuitCurve quit-vaping coach.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">Last updated: September 5, 2026</p>

        <section className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
          <h2 className="text-lg font-semibold text-foreground">Agreement</h2>
          <p>
            By using QuitCurve (the &quot;Service&quot;), you agree to these Terms
            of Service. If you do not agree, do not use the Service.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Who can use QuitCurve
          </h2>
          <p>
            QuitCurve is intended for adults (18+) who want behavioural support
            quitting or reducing nicotine vaping. You must be legally able to
            enter this agreement in your jurisdiction.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Not medical advice
          </h2>
          <p>
            QuitCurve is a behaviour-change and tracking tool. It does{" "}
            <strong className="text-foreground">not</strong> provide medical
            advice, diagnosis, or treatment, and it is not a substitute for care
            from a qualified health professional. Nicotine dependence can be
            serious—seek medical help if you need it.
          </p>

          <h2 className="text-lg font-semibold text-foreground">Your account</h2>
          <p>
            You are responsible for the email address and devices you use to
            access QuitCurve. Keep magic-link emails private. You may delete your
            account at any time from{" "}
            <Link href="/account" className="text-accent">
              Account settings
            </Link>{" "}
            or by emailing{" "}
            <a href="mailto:quitcurve@gmail.com" className="text-accent">
              quitcurve@gmail.com
            </a>
            .
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Acceptable use
          </h2>
          <p>
            Do not misuse the Service (including attempting to break security,
            scrape, spam, or use QuitCurve for anything illegal). We may suspend
            access if we reasonably believe these Terms are violated.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Availability
          </h2>
          <p>
            We aim for reliable uptime but do not guarantee uninterrupted access.
            Features may change as we improve the product.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by law, QuitCurve and its operators
            are not liable for indirect, incidental, or consequential damages
            arising from your use of the Service, including health outcomes. Use
            QuitCurve at your own risk as a self-help tool.
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
            <a href="mailto:quitcurve@gmail.com" className="text-accent">
              quitcurve@gmail.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
