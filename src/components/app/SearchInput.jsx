import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

/** SearchInput - Plaid's rounded search field. Filters what is already on screen. */
export function SearchInput({ value, onChange, placeholder, label, className }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="h-9 w-full rounded-full border border-hairline-strong bg-canvas pl-10 pr-9 text-[14px] text-ink placeholder:text-ink-subtle transition-colors hover:border-ink/25 focus:border-violet focus:outline-none focus:ring-4 focus:ring-violet/10 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-sunken hover:text-ink focus-ring"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
