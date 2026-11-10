import { useState } from "react";

/**
 * CodeSample - Dark code panel used on the marketing site and docs.
 */
export function CodeSample({ label, code }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-[#141414] text-[#f4f4f1] shadow-[0_24px_60px_-36px_rgba(20,20,20,0.55)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <span className="truncate font-mono text-[13px] text-[#d6c7ff]">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-full px-3 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-6 text-[#f4f4f1] sm:p-5 sm:text-[13px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
