import { AssessmentFlow } from "@/components/AssessmentFlow";
import { Logo } from "@/components/Logo";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-5xl px-5 pb-10 pt-14">
          <p className="text-xs uppercase tracking-[0.28em] text-[#7dffb3]">
            AI hockey development
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-wide text-white md:text-7xl">
            POWR
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            Upload a skating clip. Get scores, coaching cues, and drills — then
            save assessments so you can track progress over time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#start"
              className="rounded-full bg-[#7dffb3] px-5 py-3 text-sm font-semibold text-[#041016]"
            >
              Start assessment
            </a>
            <Link
              href="/login"
              className="rounded-full border border-white/20 px-5 py-3 text-sm text-white"
            >
              Create account / sign in
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-4 px-5 pb-12 md:grid-cols-3">
          {[
            ["01", "Upload", "10–30s skating clip from phone or camera."],
            ["02", "Analyze", "POWR scores the mechanics that matter."],
            ["03", "Improve", "Get drills — then retest and watch progress."],
          ].map(([n, t, d]) => (
            <article
              key={n}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-xs tracking-[0.2em] text-[#7dffb3]">{n}</p>
              <h2 className="mt-2 text-xl font-semibold">{t}</h2>
              <p className="mt-2 text-sm text-white/65">{d}</p>
            </article>
          ))}
        </section>

        <section id="start" className="mx-auto max-w-5xl px-5 pb-20">
          <AssessmentFlow />
        </section>
      </main>
      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-sm text-white/50">
          <Logo size="sm" />
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/dashboard">History</Link>
            <Link href="/progress">Progress</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
