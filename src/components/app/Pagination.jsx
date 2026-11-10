import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";

/** Pagination - Plaid-style first/prev/next/last with a range readout. */
export function Pagination({ page, totalPages, totalItems, pageSize, onPageChange, disabled = false, className }) {
  if (!totalItems) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  const btn = (label, Icon, target, isDisabled) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled || isDisabled}
      onClick={() => onPageChange(target)}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-sunken hover:text-ink focus-ring disabled:pointer-events-none disabled:opacity-35"
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-col items-center justify-between gap-3 sm:flex-row", className)}
    >
      <p className="text-[13px] text-ink-muted" aria-live="polite">
        <span className="font-medium tabular-nums text-ink">
          {formatCount(start)}–{formatCount(end)}
        </span>{" "}
        of <span className="font-medium tabular-nums text-ink">{formatCount(totalItems)}</span>
      </p>
      <div className="flex items-center gap-1">
        {btn("First page", ChevronsLeft, 1, atStart)}
        {btn("Previous page", ChevronLeft, page - 1, atStart)}
        <span className="min-w-[64px] px-2 text-center text-[13px] font-medium tabular-nums text-ink">
          {page} / {totalPages}
        </span>
        {btn("Next page", ChevronRight, page + 1, atEnd)}
        {btn("Last page", ChevronsRight, totalPages, atEnd)}
      </div>
    </nav>
  );
}
