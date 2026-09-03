export function Logo({
  size = 56,
  glow = true,
}: {
  size?: number;
  glow?: boolean;
}) {
  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {glow && (
        <span className="absolute inset-0 rounded-full bg-accent/25 blur-xl" />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        className="relative"
      >
        <circle
          cx="40"
          cy="40"
          r="28"
          stroke="url(#moment-ring)"
          strokeWidth="2.5"
          opacity="0.9"
        />
        <circle
          cx="40"
          cy="40"
          r="18"
          stroke="url(#moment-ring)"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <circle cx="40" cy="40" r="5" fill="#FF8A2A" />
        <path
          d="M40 8 C44 14 44 20 40 22"
          stroke="#FFB067"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="moment-ring" x1="12" y1="8" x2="68" y2="72">
            <stop stopColor="#FFB067" />
            <stop offset="1" stopColor="#FF6A00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`tracking-[0.35em] font-display text-foreground ${className}`}>
      M<span className="relative inline-block">
        O
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_#FF8A2A]" />
      </span>
      MENT
    </div>
  );
}
