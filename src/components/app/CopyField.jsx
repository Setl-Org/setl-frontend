import { useEffect, useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

/** CopyButton - Icon-only copy for table cells. Confirms with a check and a screen-reader message. */
export function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.error(`Couldn't copy the ${label.toLowerCase()}.`);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        title={`Copy ${label.toLowerCase()}`}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-subtle transition-colors hover:bg-sunken hover:text-ink focus-ring"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-positive" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied` : ""}
      </span>
    </>
  );
}

/**
 * CopyField - Plaid's credential field: small label over a mono value, with
 * reveal (for secrets) and copy. Announces "Copied" to screen readers.
 */
export function CopyField({ label, value, secret = false, className, size = "md" }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.error(`Couldn't copy the ${label.toLowerCase()}. Select it and copy manually.`);
    }
  }

  const masked = secret && !revealed;
  const iconBtn =
    "flex h-8 w-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-sunken hover:text-ink focus-ring";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-hairline bg-canvas pl-3.5 pr-1.5",
        size === "sm" ? "py-1.5" : "py-2",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[12px] leading-4 text-ink-muted">{label}</p>
        <p
          className={cn(
            "truncate font-mono leading-6 text-ink",
            size === "sm" ? "text-[12.5px]" : "text-[13.5px]",
            masked && "tracking-[0.08em]"
          )}
          title={masked ? undefined : value}
        >
          {masked ? "•".repeat(16) : value}
        </p>
      </div>
      {secret && (
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={revealed}
          className={iconBtn}
        >
          {revealed ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      )}
      <button type="button" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`} className={iconBtn}>
        {copied ? <Check className="h-4 w-4 text-positive" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied` : ""}
      </span>
    </div>
  );
}
