import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatRs } from "@/lib/format";
import { Card, CardHeader, CardBody } from "@/components/app/Card";

/**
 * Insights charts. Series colours were run through the dataviz validator against
 * white: credits violet #7c3aed, debits magenta #c44fa3 (CVD ΔE 13.2, normal 19.3,
 * both ≥3:1). Green and red stay reserved for status. Every chart has a legend,
 * hover/focus tooltips, and a screen-reader table.
 */
const CREDIT = "#7c3aed";
const DEBIT = "#c44fa3";

function Legend() {
  return (
    <div className="flex items-center gap-4 text-[12.5px] text-ink-muted">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: CREDIT }} aria-hidden />
        Credits
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: DEBIT }} aria-hidden />
        Debits
      </span>
    </div>
  );
}

function niceMax(v) {
  if (v <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}

/** Rounded top, square base, so bars sit on the baseline. */
function barPath(x, y, w, h, r = 4) {
  if (h <= 0) return "";
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

export function MonthlyFlowChart({ data }) {
  const [hover, setHover] = useState(null);
  const rows = data ?? [];
  const max = niceMax(Math.max(1, ...rows.flatMap((d) => [d.credits ?? 0, d.debits ?? 0])));

  const W = 640;
  const H = 260;
  const pad = { top: 16, right: 8, bottom: 30, left: 52 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const n = Math.max(rows.length, 1);
  const group = cw / n;
  const barW = Math.min(28, Math.max(8, (group - 18) / 2));
  const y = (v) => pad.top + ch - (v / max) * ch;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => max * p);

  return (
    <Card>
      <CardHeader
        title="Money in and out by month"
        description="Credits and debits from your parsed statements"
        action={<Legend />}
      />
      <CardBody>
        {rows.length === 0 ? (
          <p className="py-12 text-center text-[13px] text-ink-muted">
            No monthly totals have come back for your statements yet.
          </p>
        ) : (
          <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-hidden>
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="var(--color-hairline)" strokeWidth={t === 0 ? 1 : 1} strokeDasharray={t === 0 ? "" : "3 4"} />
                  <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-subtle text-[11px] tabular-nums">
                    {formatRs(t, { compact: true }).replace("Rs ", "")}
                  </text>
                </g>
              ))}
              {rows.map((d, i) => {
                const gx = pad.left + i * group;
                const x0 = gx + (group - (barW * 2 + 2)) / 2;
                const cH = ((d.credits ?? 0) / max) * ch;
                const dH = ((d.debits ?? 0) / max) * ch;
                const dim = hover != null && hover !== i;
                return (
                  <g key={d.month} opacity={dim ? 0.35 : 1} style={{ transition: "opacity 150ms" }}>
                    {hover === i && <rect x={gx + 2} y={pad.top} width={group - 4} height={ch} rx={6} fill="var(--color-sunken)" />}
                    <path d={barPath(x0, pad.top + ch - cH, barW, cH)} fill={CREDIT} />
                    <path d={barPath(x0 + barW + 2, pad.top + ch - dH, barW, dH)} fill={DEBIT} />
                    <text x={gx + group / 2} y={H - 8} textAnchor="middle" className="fill-ink-muted text-[11.5px]">
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* Hit targets: one per month, bigger than the bars, keyboard reachable. */}
            <div className="absolute inset-0 flex" style={{ paddingLeft: `${(pad.left / W) * 100}%`, paddingRight: `${(pad.right / W) * 100}%` }}>
              {rows.map((d, i) => (
                <button
                  key={d.month}
                  type="button"
                  aria-label={`${d.month}: credits ${formatRs(d.credits ?? 0)}, debits ${formatRs(d.debits ?? 0)}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="relative h-full flex-1 rounded-md focus-ring"
                >
                  {hover === i && (
                    <span
                      role="tooltip"
                      className={cn(
                        "pointer-events-none absolute top-1 z-10 w-44 rounded-lg border border-hairline bg-canvas p-3 text-left shadow-popover",
                        i > rows.length / 2 ? "right-1/2" : "left-1/2"
                      )}
                    >
                      <span className="block text-[12px] font-semibold text-ink">{d.month}</span>
                      <span className="mt-1.5 flex items-center justify-between gap-2 text-[12px] text-ink-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-[2px]" style={{ background: CREDIT }} />
                          Credits
                        </span>
                        <span className="font-medium tabular-nums text-ink">{formatRs(d.credits ?? 0)}</span>
                      </span>
                      <span className="mt-1 flex items-center justify-between gap-2 text-[12px] text-ink-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-[2px]" style={{ background: DEBIT }} />
                          Debits
                        </span>
                        <span className="font-medium tabular-nums text-ink">{formatRs(d.debits ?? 0)}</span>
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
            <table className="sr-only">
              <caption>Credits and debits by month</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Credits</th>
                  <th scope="col">Debits</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.month}>
                    <th scope="row">{d.month}</th>
                    <td>{formatRs(d.credits ?? 0)}</td>
                    <td>{formatRs(d.debits ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/** Two totals don't need a chart: one split bar with direct labels. */
export function CreditDebitSplit({ credits, debits }) {
  const total = (credits ?? 0) + (debits ?? 0);
  const cPct = total > 0 ? (credits / total) * 100 : 50;
  return (
    <Card>
      <CardHeader title="Credits and debits" description="Share of all money moved" />
      <CardBody>
        {total === 0 ? (
          <p className="py-6 text-center text-[13px] text-ink-muted">Nothing parsed yet.</p>
        ) : (
          <>
            <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label={`Credits ${Math.round(cPct)}%, debits ${Math.round(100 - cPct)}%`}>
              <span className="h-full rounded-l-full" style={{ width: `${cPct}%`, background: CREDIT }} />
              <span className="h-full flex-1 rounded-r-full" style={{ background: DEBIT }} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <dt className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: CREDIT }} aria-hidden />
                  Credits · {Math.round(cPct)}%
                </dt>
                <dd className="mt-1 text-[20px] font-semibold tabular-nums tracking-[-0.01em] text-ink">{formatRs(credits)}</dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: DEBIT }} aria-hidden />
                  Debits · {Math.round(100 - cPct)}%
                </dt>
                <dd className="mt-1 text-[20px] font-semibold tabular-nums tracking-[-0.01em] text-ink">{formatRs(debits)}</dd>
              </div>
            </dl>
          </>
        )}
      </CardBody>
    </Card>
  );
}

/** Balance trend; with fewer than two points it shows the number instead of a one-dot line. */
export function BalanceTrend({ data }) {
  const [hover, setHover] = useState(null);
  const rows = data ?? [];

  if (rows.length < 2) {
    const only = rows[0];
    return (
      <Card>
        <CardHeader title="Balance over time" description="End-of-month balance across accounts" />
        <CardBody>
          {only ? (
            <>
              <p className="text-[12.5px] text-ink-muted">{only.label}</p>
              <p className={cn("mt-1 text-[26px] font-semibold tabular-nums tracking-[-0.02em]", only.balance < 0 ? "text-negative" : "text-ink")}>
                {formatRs(only.balance)}
              </p>
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-sunken px-3 py-2.5 text-[12.5px] text-ink-muted">
                <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                The trend line appears once statements cover two or more months.
              </p>
            </>
          ) : (
            <p className="py-6 text-center text-[13px] text-ink-muted">No balance history yet.</p>
          )}
        </CardBody>
      </Card>
    );
  }

  const W = 640;
  const H = 220;
  const pad = { top: 16, right: 16, bottom: 30, left: 56 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const vals = rows.map((d) => d.balance);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || Math.abs(hi) || 1;
  const min = lo - span * 0.1;
  const max = hi + span * 0.1;
  const x = (i) => pad.left + (i / (rows.length - 1)) * cw;
  const y = (v) => pad.top + ch - ((v - min) / (max - min)) * ch;
  const line = rows.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.balance)}`).join(" ");
  const ticks = [min, (min + max) / 2, max];

  return (
    <Card>
      <CardHeader title="Balance over time" description="End-of-month balance across accounts" />
      <CardBody>
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
            {ticks.map((t, i) => (
              <g key={`t-${i}`}>
                <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="var(--color-hairline)" strokeDasharray="3 4" />
                <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-subtle text-[11px] tabular-nums">
                  {formatRs(t, { compact: true }).replace("Rs ", "")}
                </text>
              </g>
            ))}
            <path d={`${line} L${x(rows.length - 1)},${pad.top + ch} L${x(0)},${pad.top + ch} Z`} fill={CREDIT} opacity={0.08} />
            <path d={line} fill="none" stroke={CREDIT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {hover != null && (
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + ch} stroke="var(--color-ink-subtle)" strokeDasharray="2 3" />
            )}
            {rows.map((d, i) => (
              <g key={`p-${i}`}>
                <circle cx={x(i)} cy={y(d.balance)} r={hover === i ? 5 : 4} fill={CREDIT} stroke="#fff" strokeWidth={2} />
                <text x={x(i)} y={H - 8} textAnchor="middle" className="fill-ink-muted text-[11.5px]">
                  {d.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="absolute inset-0 flex" style={{ paddingLeft: `${((pad.left - cw / (rows.length - 1) / 2) / W) * 100}%`, paddingRight: `${((pad.right - cw / (rows.length - 1) / 2) / W) * 100}%` }}>
            {rows.map((d, i) => (
              <button
                key={`h-${i}`}
                type="button"
                aria-label={`${d.label}: ${formatRs(d.balance)}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="relative h-full flex-1 rounded-md focus-ring"
              >
                {hover === i && (
                  <span role="tooltip" className="pointer-events-none absolute left-1/2 top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-hairline bg-canvas px-3 py-2 text-left shadow-popover">
                    <span className="block text-[12px] text-ink-muted">{d.label}</span>
                    <span className="block text-[13px] font-semibold tabular-nums text-ink">{formatRs(d.balance)}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
          <table className="sr-only">
            <caption>Balance over time</caption>
            <tbody>
              {rows.map((d, i) => (
                <tr key={`r-${i}`}>
                  <th scope="row">{d.label}</th>
                  <td>{formatRs(d.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
