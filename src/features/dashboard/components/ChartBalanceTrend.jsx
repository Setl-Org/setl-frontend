/**
 * Line chart: balance over time (dummy data). Shows trend with Y-axis scale.
 */
function formatBalance(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return String(value);
}

export function ChartBalanceTrend({ data }) {
  if (!data?.length) return null;

  const values = data.map((d) => d.balance);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = { top: 8, right: 8, bottom: 24, left: 36 };
  const width = 280;
  const height = 120;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (i) => padding.left + (i / Math.max(1, data.length - 1)) * chartWidth;
  const yScale = (balance) =>
    padding.top + chartHeight - ((balance - min) / range) * chartHeight;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.balance)}`)
    .join(" ");

  const yTicks = [min, min + range * 0.5, max].map((v) => ({
    value: v,
    y: yScale(v),
  }));

  return (
    <div className="rounded-xl border border-border/80 bg-primary p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold text-secondary">Balance over time</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        End-of-day balance (sample)
      </p>
      <div className="mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[120px] w-full max-w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {/* Y-axis labels */}
          {yTicks.map((t) => (
            <g key={t.value}>
              <line
                x1={padding.left}
                x2={padding.left + chartWidth}
                y1={t.y}
                y2={t.y}
                stroke="var(--color-border)"
                strokeDasharray="2 2"
                strokeOpacity={0.6}
              />
              <text
                x={padding.left - 6}
                y={t.y + 4}
                textAnchor="end"
                fill="currentColor"
                className="text-[10px] text-muted-foreground"
              >
                Rs {formatBalance(t.value)}
              </text>
            </g>
          ))}
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-tertiary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Points */}
          {data.map((d, i) => (
            <g key={d.label}>
              <circle
                cx={xScale(i)}
                cy={yScale(d.balance)}
                r="4"
                className="fill-tertiary stroke-primary"
                strokeWidth="2"
              >
                <title>{`${d.label}: Rs ${d.balance.toLocaleString()}`}</title>
              </circle>
              <text
                x={xScale(i)}
                y={height - 4}
                textAnchor="middle"
                fill="currentColor"
                className="text-[10px] text-muted-foreground"
              >
                {d.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
