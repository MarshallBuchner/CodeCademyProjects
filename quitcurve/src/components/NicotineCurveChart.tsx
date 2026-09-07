type NicotineCurveChartProps = {
  className?: string;
  compact?: boolean;
  /** Weekly nicotine index as % of baseline (100 = start, lower = less). */
  points?: number[];
};

const DEFAULT_POINTS = [100, 88, 82, 72, 65, 55, 48, 38];

export function NicotineCurveChart({
  className = "",
  compact = false,
  points = DEFAULT_POINTS,
}: NicotineCurveChartProps) {
  const width = compact ? 280 : 320;
  const height = compact ? 100 : 140;
  const padding = { top: 12, right: 8, bottom: 12, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const normalized = points.map((p) => p / 100);
  const coords = normalized.map((y, i) => ({
    x: padding.left + (i / Math.max(normalized.length - 1, 1)) * chartW,
    y: padding.top + y * chartH,
  }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${padding.top + chartH} L ${coords[0].x} ${padding.top + chartH} Z`;
  const gradientId = `curveGradient-${compact ? "c" : "f"}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      aria-label="Nicotine reduction curve"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ee9b5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5ee9b5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke="#5ee9b5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={compact ? 3 : 4}
          fill="#070b09"
          stroke="#5ee9b5"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
