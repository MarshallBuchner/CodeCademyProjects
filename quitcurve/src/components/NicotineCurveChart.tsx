type NicotineCurveChartProps = {
  className?: string;
  compact?: boolean;
};

const POINTS = [
  { x: 0, y: 0.95 },
  { x: 1, y: 0.88 },
  { x: 2, y: 0.82 },
  { x: 3, y: 0.72 },
  { x: 4, y: 0.65 },
  { x: 5, y: 0.55 },
  { x: 6, y: 0.48 },
  { x: 7, y: 0.38 },
];

export function NicotineCurveChart({
  className = "",
  compact = false,
}: NicotineCurveChartProps) {
  const width = compact ? 280 : 320;
  const height = compact ? 100 : 140;
  const padding = { top: 12, right: 8, bottom: 12, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const coords = POINTS.map((p, i) => ({
    x: padding.left + (i / (POINTS.length - 1)) * chartW,
    y: padding.top + p.y * chartH,
  }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${padding.top + chartH} L ${coords[0].x} ${padding.top + chartH} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      aria-label="Nicotine reduction curve over 8 weeks"
    >
      <defs>
        <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ee9b5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5ee9b5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#curveGradient)" />
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
