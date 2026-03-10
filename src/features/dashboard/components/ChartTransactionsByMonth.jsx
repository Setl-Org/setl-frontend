/**
 * Simple bar chart: transactions by month (dummy data).
 */
export function ChartTransactionsByMonth({ data }) {
  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="rounded-xl border border-border/80 bg-primary p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold text-secondary">Transactions by month</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">Last 6 months</p>
      <div className="mt-4 flex items-end gap-2 sm:gap-3" style={{ minHeight: 160 }}>
        {data.map((d) => (
          <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-tertiary/80 transition hover:bg-tertiary"
              style={{
                height: max > 0 ? `${(d.count / max) * 120}px` : 0,
                minHeight: d.count > 0 ? 8 : 0,
              }}
              title={`${d.count} transactions`}
            />
            <span className="text-xs font-medium text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
