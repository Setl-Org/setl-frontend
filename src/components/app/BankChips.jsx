import { useRef } from "react";
import { Layers } from "lucide-react";
import { cn } from "@/lib/cn";
import { BankLogo } from "@/components/ui/BankLogo";

/**
 * BankChips - Horizontal bank filter with each bank's logo. Radio-group semantics
 * with roving focus; the row scrolls sideways on small screens.
 *
 * banks: string[] of bank names. value: selected bank or "" for all.
 */
export function BankChips({ banks, value, onChange, label = "Filter by bank", className }) {
  const refs = useRef([]);
  const options = [{ value: "", label: "All banks" }, ...banks.map((b) => ({ value: b, label: b }))];

  function onKeyDown(e, index) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
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
      className={cn("-mx-1 flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none]", className)}
    >
      {options.map((o, i) => {
        const selected = (value ?? "") === o.value;
        return (
          <button
            key={o.value || "all"}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border pl-1.5 pr-3.5 text-[13px] font-medium transition-[background-color,border-color,color,box-shadow] duration-150 focus-ring",
              selected
                ? "border-violet/45 bg-lilac text-violet-ink shadow-[0_0_0_3px_rgb(124_58_237/0.08)]"
                : "border-hairline-strong bg-canvas text-ink hover:border-ink/20 hover:bg-sunken"
            )}
          >
            {o.value ? (
              <BankLogo bankName={o.value} className="h-6 w-6 rounded-full ring-hairline" />
            ) : (
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  selected ? "bg-violet text-white" : "bg-sunken text-ink-muted"
                )}
              >
                <Layers className="h-3.5 w-3.5" aria-hidden />
              </span>
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
