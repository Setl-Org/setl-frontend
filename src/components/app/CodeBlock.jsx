import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

/** CodeBlock - Ink panel with a title bar and copy button. Scrolls horizontally, keyboard focusable. */
export function CodeBlock({ title, code, className }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      toast.error("Couldn't copy the snippet. Select it and copy manually.");
    }
  }

  return (
    <figure className={cn("overflow-hidden rounded-xl border border-ink/90 bg-ink", className)}>
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="font-mono text-[12px] text-white/60">{title}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${title ?? "code"}`}
          className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-ring"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#7ee2b0]" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre
        tabIndex={0}
        aria-label={title}
        className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.7] text-[#ece8f6] focus-ring"
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
