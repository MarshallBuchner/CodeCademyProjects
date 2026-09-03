"use client";

type DayPacingChartProps = {
  today: number[];
  baseline: number[];
  maxY?: number;
};

export function DayPacingChart({ today, baseline, maxY }: DayPacingChartProps) {
  const width = 320;
  const height = 140;
  const pad = { top: 10, right: 10, bottom: 22, left: 28 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const peak = Math.max(
    maxY ?? 0,
    ...today,
    ...baseline,
    1,
  );

  const toCoord = (values: number[]) =>
    values.map((v, i) => ({
      x: pad.left + (i / Math.max(values.length - 1, 1)) * chartW,
      y: pad.top + (1 - v / peak) * chartH,
    }));

  const todayCoords = toCoord(today);
  const baselineCoords = toCoord(baseline);
  const zeroY = pad.top + chartH;

  const line = (coords: { x: number; y: number }[]) =>
    coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");

  const labels = [
    { i: 0, text: "12a" },
    { i: 6, text: "6a" },
    { i: 12, text: "12p" },
    { i: 18, text: "6p" },
    { i: 23, text: "12a" },
  ];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      aria-label="Today's puff curve versus baseline"
    >
      {/* Zero line */}
      <line
        x1={pad.left}
        y1={zeroY}
        x2={pad.left + chartW}
        y2={zeroY}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      {/* Baseline */}
      <path
        d={line(baselineCoords)}
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      {/* Today */}
      <path
        d={line(todayCoords)}
        fill="none"
        stroke="#5ee9b5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {todayCoords
        .filter((_, i) => i % 3 === 0 || i === todayCoords.length - 1)
        .map((c, idx) => (
          <circle
            key={idx}
            cx={c.x}
            cy={c.y}
            r={3}
            fill="#070b09"
            stroke="#5ee9b5"
            strokeWidth="1.5"
          />
        ))}
      {labels.map((l) => (
        <text
          key={l.text + l.i}
          x={pad.left + (l.i / 23) * chartW}
          y={height - 4}
          textAnchor="middle"
          className="fill-white/30"
          fontSize="9"
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}
