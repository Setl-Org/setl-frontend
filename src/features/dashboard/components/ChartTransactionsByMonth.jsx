function formatAmt(val) {
  if (val === 0) return "0";
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${Math.round(val / 1_000)}k`;
  return String(Math.round(val));
}

/**
 * Grouped bar chart: credit vs debit amounts by month with Y-axis.
 *
 * @param {Object[]} props.data - [{ month: string, credits: number, debits: number }]
 */
export function ChartTransactionsByMonth({ data }) {
  if (!data?.length) return null;

  const maxVal = Math.max(...data.flatMap((d) => [d.credits ?? 0, d.debits ?? 0]), 1);

  const pad = { top: 12, right: 8, bottom: 28, left: 48 };
  const W = 300;
  const H = 190;
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const n = data.length;
  const groupW = chartW / n;
  const barW = Math.max(Math.floor((groupW - 10) / 2), 4);

  const yScale = (v) => pad.top + chartH - (v / maxVal) * chartH;

  const yTicks = [0, 0.5, 1].map((p) => ({
    val: maxVal * p,
    y: pad.top + chartH - p * chartH,
  }));

  return (
    <div className="rounded-xl border border-border/80 bg-primary p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold text-secondary">Transactions by month</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">Credits vs debits · last 6 months</p>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm bg-tertiary" />
          Credits
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm bg-tertiary/40" />
          Debits
        </span>
      </div>
      <div className="mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[190px] w-full max-w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {/* Y-axis gridlines and labels */}
          {yTicks.map((t) => (
            <g key={t.val}>
              <line
                x1={pad.left}
                x2={W - pad.right}
                y1={t.y}
                y2={t.y}
                stroke="var(--color-border)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
              <text
                x={pad.left - 5}
                y={t.y + 4}
                textAnchor="end"
                fill="currentColor"
                className="text-[9px] text-muted-foreground"
              >
                {formatAmt(t.val)}
              </text>
            </g>
          ))}

          {/* Grouped bars + month labels */}
          {data.map((d, i) => {
            const gx = pad.left + i * groupW + Math.floor((groupW - barW * 2 - 4) / 2);
            const creditH = Math.max(((d.credits ?? 0) / maxVal) * chartH, 0);
            const debitH = Math.max(((d.debits ?? 0) / maxVal) * chartH, 0);
            return (
              <g key={d.month}>
                {/* Credit bar */}
                <rect
                  x={gx}
                  y={yScale(d.credits ?? 0)}
                  width={barW}
                  height={creditH}
                  fill="var(--color-tertiary)"
                  opacity={0.85}
                  rx={2}
                >
                  <title>Credits: Rs {(d.credits ?? 0).toLocaleString()}</title>
                </rect>
                {/* Debit bar */}
                <rect
                  x={gx + barW + 4}
                  y={yScale(d.debits ?? 0)}
                  width={barW}
                  height={debitH}
                  fill="var(--color-tertiary)"
                  opacity={0.35}
                  rx={2}
                >
                  <title>Debits: Rs {(d.debits ?? 0).toLocaleString()}</title>
                </rect>
                {/* Month label */}
                <text
                  x={pad.left + i * groupW + groupW / 2}
                  y={H - 6}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-[9px] text-muted-foreground"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
