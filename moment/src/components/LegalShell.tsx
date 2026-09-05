import Link from "next/link";
import { Logo, Wordmark } from "@/components/Logo";

export function LegalShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-white/8 px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={36} glow={false} />
            <Wordmark className="text-sm" />
          </Link>
          <Link
            href="/"
            className="text-sm text-muted transition hover:text-foreground"
          >
            ← Back
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-10">
        {eyebrow ? (
          <p className="text-xs font-medium tracking-[0.28em] text-accent uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={`font-display text-3xl tracking-wide text-foreground ${eyebrow ? "mt-2" : ""}`}
        >
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}
