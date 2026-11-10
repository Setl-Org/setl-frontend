import { cn } from "@/lib/cn";
import { SkeletonBlock } from "./SkeletonBlock";

/** KpiTile - One number with its label and one line of context. Numbers are tabular. */
export function KpiTile({ label, value, sub, icon: Icon, tone = "ink", loading = false, className }) {
  const valueTone = {
    ink: "text-ink",
    positive: "text-positive",
    negative: "text-negative",
  }[tone];

  return (
    <div className={cn("rounded-xl border border-hairline bg-canvas p-5 shadow-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-ink-muted">{label}</p>
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-muted">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
      {loading ? (
        <>
          <SkeletonBlock className="mt-3 h-7 w-24" />
          <SkeletonBlock className="mt-2.5 h-3 w-32" />
        </>
      ) : (
        <>
          <p className={cn("mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] tabular-nums", valueTone)}>
            {value}
          </p>
          {sub && <p className="mt-1 text-[12.5px] text-ink-muted">{sub}</p>}
        </>
      )}
    </div>
  );
}
