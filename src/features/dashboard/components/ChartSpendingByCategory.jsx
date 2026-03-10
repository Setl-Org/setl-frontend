import { cn } from "@/lib/cn";

/**
 * Horizontal bar chart: spending by category (dummy data).
 */
export function ChartSpendingByCategory({ data }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-xl border border-border/80 bg-primary p-4 shadow-sm sm:p-5">
      <h3 className="text-sm font-semibold text-secondary">Spending by category</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">AI-categorized</p>
      <div className="mt-4 space-y-3">
        {data.map((d) => (
          <div key={d.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-secondary">{d.label}</span>
              <span className="text-muted-foreground">
                Rs {(d.value / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition", d.color)}
                style={{ width: max > 0 ? `${(d.value / max) * 100}%` : 0 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
