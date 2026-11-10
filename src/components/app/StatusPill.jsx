import { cn } from "@/lib/cn";

const TONES = {
  positive: "bg-positive-soft text-positive",
  negative: "bg-negative-soft text-negative",
  caution: "bg-caution-soft text-caution",
  violet: "bg-lilac text-violet-ink",
  neutral: "bg-sunken text-ink-muted",
};

const DOTS = {
  positive: "bg-positive",
  negative: "bg-negative",
  caution: "bg-caution",
  violet: "bg-violet",
  neutral: "bg-ink-subtle",
};

/** StatusPill - Status trio plus neutral and violet. Text always carries the meaning, the dot only reinforces it. */
export function StatusPill({ tone = "neutral", dot = true, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium leading-5",
        TONES[tone] ?? TONES.neutral,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", DOTS[tone] ?? DOTS.neutral)} aria-hidden />}
      {children}
    </span>
  );
}

/** Tag - Mono chip for scopes, ids and other code-ish labels. */
export function Tag({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-hairline bg-sunken px-1.5 py-0.5 font-mono text-[11.5px] leading-4 text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
