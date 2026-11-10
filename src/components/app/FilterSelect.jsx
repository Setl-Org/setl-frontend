import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * FilterSelect - Plaid filter chip backed by a native <select>, so keyboard, screen
 * readers and phones get the platform picker. An active filter turns lilac and
 * gains a clear button.
 *
 * options: [{ value, label }]. value "" means no filter.
 */
export function FilterSelect({ label, value, options, onChange, className }) {
  const active = value !== "" && value != null;
  const current = options.find((o) => String(o.value) === String(value));

  return (
    <div className={cn("inline-flex items-center", className)}>
      <div
        className={cn(
          "relative inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors",
          "has-[select:focus-visible]:outline-2 has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-violet",
          active
            ? "rounded-r-none border-violet/40 bg-lilac text-violet-ink"
            : "border-hairline-strong bg-canvas text-ink hover:bg-sunken"
        )}
      >
        <span className={cn(active && "text-violet-ink/80")}>{label}</span>
        {active && <span className="max-w-[160px] truncate font-semibold">{current?.label ?? value}</span>}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
        <select
          aria-label={label}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer appearance-none opacity-0"
        >
          <option value="">All</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {active && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={`Clear ${label.toLowerCase()} filter`}
          className="flex h-9 w-8 items-center justify-center rounded-r-lg border border-l-0 border-violet/40 bg-lilac text-violet-ink transition-colors hover:bg-lilac-strong focus-ring"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
