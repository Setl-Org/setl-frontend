import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * EmptyState - Centered icon disc, title, one sentence, optional action.
 * tone="error" renders as an alert for sections that failed to load.
 */
export function EmptyState({ icon: Icon, title, description, action, tone = "neutral", compact = false, className }) {
  const isError = tone === "error";
  const Glyph = Icon ?? (isError ? AlertTriangle : null);
  return (
    <div
      role={isError ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        compact ? "py-10" : "py-16",
        className
      )}
    >
      {Glyph && (
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full shadow-[0_0_0_6px_var(--color-sunken)]",
            isError ? "bg-negative-soft text-negative" : "bg-lilac text-violet-ink"
          )}
        >
          <Glyph className="h-5 w-5" aria-hidden />
        </span>
      )}
      <p className="mt-5 text-[15px] font-semibold text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-md text-[13px] leading-5 text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}
