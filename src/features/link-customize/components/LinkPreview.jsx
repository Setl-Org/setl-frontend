import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { PreviewScreen } from "./PreviewScreens";

/**
 * LinkPreview - The Setl Link modal as an end user sees it. A pure render of the
 * draft settings and the screen id, so the stage can show it three times
 * (previous, current, next). Only the current one is interactive.
 */
export function LinkPreview({ screenId, settings, interactive, context, onBack, onClose }) {
  const coBranded = settings.consent.header === "co";
  const client = settings.consent.clientName?.trim() || "This app";
  const accent = settings.appearance.accent;

  return (
    <div
      className={cn(
        "flex h-[600px] w-[340px] flex-col overflow-hidden rounded-[22px] bg-white text-left shadow-[0_24px_60px_-24px_rgb(20_20_20/0.35),0_2px_8px_-2px_rgb(20_20_20/0.08)]",
        !interactive && "pointer-events-none select-none"
      )}
    >
      <div className="relative flex h-14 shrink-0 items-center justify-center px-4">
        {screenId !== "consent" && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            tabIndex={interactive ? 0 : -1}
            className="absolute left-3 flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-sunken focus-ring"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
        )}
        <span className="flex items-center gap-2">
          {coBranded && (
            <>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold"
                style={{ background: accent, color: accent.toLowerCase() === "#ffffff" ? "#141414" : "#ffffff" }}
                aria-hidden
              >
                {client.slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-[110px] truncate text-[13px] font-semibold text-ink">{client}</span>
              <span className="text-[12px] text-ink-subtle" aria-hidden>
                ×
              </span>
            </>
          )}
          <img src="/logo-mark.svg" alt="" className="h-5 w-5" />
          <span className="text-[13px] font-bold tracking-[0.08em] text-ink">SETL</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          tabIndex={interactive ? 0 : -1}
          className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-sunken focus-ring"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <PreviewScreen id={screenId} settings={settings} interactive={interactive} {...context} />
    </div>
  );
}
