import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * SegmentedControl - Plaid's grey track with a raised white selection.
 * Radio-group semantics with roving focus: Tab enters, arrow keys move.
 *
 * options: [{ value, label, count? }]
 */
export function SegmentedControl({ label, value, options, onChange, className }) {
  const refs = useRef([]);

  function onKeyDown(e, index) {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex max-w-full overflow-x-auto rounded-xl bg-sunken p-1 [scrollbar-width:none]", className)}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-150 focus-ring",
              selected ? "bg-canvas text-ink shadow-[0_1px_3px_rgb(20_20_20/0.12)]" : "text-ink-muted hover:text-ink"
            )}
          >
            {o.label}
            {o.count != null && (
              <span className={cn("tabular-nums", selected ? "text-ink-muted" : "text-ink-subtle")}>{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
