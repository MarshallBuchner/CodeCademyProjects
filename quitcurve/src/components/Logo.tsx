export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 8C10 8 14 6 18 10C22 14 24 20 24 24"
          stroke="#5ee9b5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="4" cy="8" r="2" fill="#5ee9b5" />
        <circle cx="24" cy="24" r="2" fill="#5ee9b5" />
      </svg>
      <span className="text-lg font-semibold tracking-tight">QuitCurve</span>
    </div>
  );
}
