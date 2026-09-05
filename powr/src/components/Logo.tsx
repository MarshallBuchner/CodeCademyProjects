import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link href="/" className="inline-flex items-center gap-2 no-underline">
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(145deg,#7dffb3,#2ee6d6)] text-sm font-black text-[#041016]"
      >
        P
      </span>
      <span className={`font-[family-name:var(--font-display)] tracking-[0.18em] text-white ${text}`}>
        POWR
      </span>
    </Link>
  );
}
