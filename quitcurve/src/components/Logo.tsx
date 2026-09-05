import Image from "next/image";

type LogoProps = {
  className?: string;
  /** Show wordmark next to the Q mark (default true). */
  showWordmark?: boolean;
  /** Icon size in pixels (default 28). */
  size?: number;
};

export function Logo({
  className = "",
  showWordmark = true,
  size = 28,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/brand/quitcurve-q.png"
        alt="QuitCurve"
        width={size}
        height={size}
        className="rounded-[22%] shadow-sm shadow-accent/20"
        priority
      />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight">QuitCurve</span>
      )}
    </div>
  );
}
