import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Palette, Upload } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { InlineConfirm } from "@/components/app/InlineConfirm";
import { cn } from "@/lib/cn";
import { PANEL_ITEMS, SCREENS } from "../constants";
import { sectionChanged } from "../useLinkCustomizations";
import { ScreenSettings } from "./ScreenSettings";

const APPEARANCE = {
  id: "appearance",
  label: "Background and button colour",
  description: "Colours Link uses on every screen.",
};

/**
 * SettingsPanel - Plaid's right-hand panel: a list of screens, each opening its
 * own settings, with Publish pinned to the bottom.
 */
export function SettingsPanel({ item, panel, onOpen, onBack, onChange, onPublish, onDiscard, dirty, preview }) {
  const headingRef = useRef(null);
  const listButtons = useRef({});
  const lastOpened = useRef(null);
  const detail = panel === "list" ? null : panel === "appearance" ? APPEARANCE : SCREENS.find((s) => s.id === panel);

  // Move focus with the view so keyboard users land on the new heading, or back on the row they opened.
  useEffect(() => {
    if (detail) {
      headingRef.current?.focus();
    } else if (lastOpened.current) {
      listButtons.current[lastOpened.current]?.focus();
      lastOpened.current = null;
    }
  }, [detail]);

  return (
    <aside
      aria-label="Link customization settings"
      className="flex min-h-0 flex-col border-hairline bg-canvas lg:h-full lg:border-l"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-6 sm:px-6 lg:pt-8">
        {detail ? (
          <div key={detail.id} className="motion-safe:animate-[page-enter_200ms_ease-out]">
            <button
              type="button"
              onClick={onBack}
              className="-ml-1.5 inline-flex h-8 items-center gap-1 rounded-lg pl-1 pr-2.5 text-[13.5px] font-medium text-ink hover:bg-sunken focus-ring"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Go back
            </button>
            <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-[20px] font-semibold tracking-[-0.01em] text-ink outline-none">
              {detail.label}
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-muted">{detail.description}</p>
            <div className="my-5 h-px bg-hairline" />
            <div className="space-y-6">
              <ScreenSettings id={detail.id} settings={item.draft} onChange={(patch) => onChange(detail.id, patch)} preview={preview} />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-[24px] font-bold leading-tight tracking-[-0.02em] text-ink">Link customization</h1>
            <p className="mt-2 text-[14px] leading-[1.55] text-ink-muted">
              Test and tailor what your users see when they connect their Pakistani bank or wallet to your app.
            </p>
            <ul className="mt-6 space-y-2">
              {PANEL_ITEMS.map((p) => {
                const changed = sectionChanged(item, p.id) && Boolean(item.published);
                return (
                  <li key={p.id}>
                    <button
                      ref={(el) => (listButtons.current[p.id] = el)}
                      type="button"
                      onClick={() => {
                        lastOpened.current = p.id;
                        onOpen(p.id);
                      }}
                      className={cn(
                        "flex h-12 w-full items-center gap-3 rounded-xl border border-hairline bg-canvas px-4 text-left text-[14px] text-ink transition-colors hover:border-hairline-strong hover:bg-sunken focus-ring",
                        p.id === "appearance" && "mb-4"
                      )}
                    >
                      {p.id === "appearance" && <Palette className="h-4 w-4 text-ink-muted" aria-hidden />}
                      <span className="flex-1 truncate">{p.label}</span>
                      {changed && (
                        <span className="rounded-full bg-caution-soft px-2 py-0.5 text-[11.5px] font-medium text-caution">
                          Edited
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-ink-subtle" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="shrink-0 space-y-2 border-t border-hairline bg-canvas px-5 py-4 sm:px-6">
        <AppButton variant="primary" className="h-11 w-full" leadingIcon={Upload} disabled={!dirty} onClick={onPublish}>
          Publish changes
        </AppButton>
        {dirty && item.published && (
          <InlineConfirm
            label="Discard changes"
            triggerVariant="ghost"
            message="Discard unpublished edits?"
            confirmLabel="Discard"
            onConfirm={onDiscard}
            className="w-full"
          />
        )}
      </div>
    </aside>
  );
}
