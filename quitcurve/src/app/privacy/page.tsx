import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Privacy Policy — QuitCurve",
  description: "How QuitCurve handles your data and privacy.",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: September 5, 2026</p>

        <section className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <p>
            QuitCurve (&quot;we&quot;, &quot;our&quot;) helps you quit vaping through
            personalized step-down plans. We are committed to protecting your
            privacy. This policy explains what data we collect and how we use it.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            What we collect
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Account info:</strong> email
              address and first name (if you create an account)
            </li>
            <li>
              <strong className="text-foreground">Quit plan data:</strong> device
              type, usage frequency, nicotine level, weekly spend, and plan pace
            </li>
            <li>
              <strong className="text-foreground">Progress data:</strong> craving
              logs, daily check-ins, puff logs (for daily pacing), and plan
              statistics
            </li>
            <li>
              <strong className="text-foreground">Guest mode:</strong> if you skip
              account creation, data is stored only in your browser (localStorage)
            </li>
            <li>
              <strong className="text-foreground">Reminders (optional):</strong>{" "}
              if you opt in, we store your reminder preferences, time zone, and
              (for SMS) phone number, plus consent timestamps
            </li>
            <li>
              <strong className="text-foreground">Product analytics:</strong>{" "}
              anonymous usage metrics via Vercel Analytics and Speed Insights
              (page views / performance — not your quit-plan content)
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">
            How we use your data
          </h2>
          <p>
            We use your data solely to provide and improve the QuitCurve service:
            calculating your personalized reduction curve, tracking progress and
            daily puff pacing, syncing across devices when you sign in, and
            sending optional daily check-in reminders you have consented to. We
            do not sell your personal data to third parties.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Data storage
          </h2>
          <p>
            When you create an account, your data is stored securely via Supabase
            (hosted PostgreSQL with encryption in transit and at rest). Guest-mode
            data remains on your device only and is not transmitted to our servers.
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Third-party services
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Supabase</strong> — authentication
              and database (see supabase.com/privacy)
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> — app hosting,
              Analytics, and Speed Insights (see vercel.com/legal/privacy-policy)
            </li>
            <li>
              <strong className="text-foreground">Resend</strong> — transactional
              email delivery for magic links and optional check-in reminders
              (see resend.com/legal/privacy-policy)
            </li>
            <li>
              <strong className="text-foreground">Twilio</strong> — optional SMS
              reminders if you enable them (see twilio.com/legal/privacy)
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">
            Medical disclaimer
          </h2>
          <p>
            QuitCurve is a behaviour-change support tool. It does not provide
            medical advice, diagnosis, or treatment. Always consult a healthcare
            professional before making changes to nicotine use, especially if you
            have underlying health conditions.
          </p>

          <h2 className="text-lg font-semibold text-foreground">Your rights</h2>
          <p>
            You may access, correct, or delete your data at any time. Signed-in
            users can delete their account in-app from{" "}
            <Link href="/account" className="text-accent">
              Account settings
            </Link>
            . You can also email{" "}
            <a href="mailto:privacy@quitcurve.app" className="text-accent">
              privacy@quitcurve.app
            </a>
            .
          </p>

          <h2 className="text-lg font-semibold text-foreground">
            Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time. Continued use of QuitCurve
            after changes constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p>
            Questions? Email{" "}
            <a href="mailto:hello@quitcurve.app" className="text-accent">
              hello@quitcurve.app
            </a>{" "}
            or visit{" "}
            <Link href="/support" className="text-accent">
              Support
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
