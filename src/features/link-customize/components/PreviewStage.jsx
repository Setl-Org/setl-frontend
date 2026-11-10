import { useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { SCOPES, SCREENS } from "../constants";
import { isDark } from "../color";
import { LinkPreview } from "./LinkPreview";

const CARD_W = 340;
const CARD_H = 600;
const GAP = 56;

/** Scale that fits the 600px card into the carousel area, never above 1. */
function useFitScale(ref) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const h = el.clientHeight;
      const w = el.clientWidth;
      const next = Math.min(1, (h - 24) / CARD_H, (w - 24) / CARD_W);
      setScale(Number.isFinite(next) && next > 0.4 ? next : 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

/**
 * PreviewStage - Plaid's grey stage: the current screen in the middle with its
 * neighbours peeking in from the sides. Clicking a neighbour moves to it.
 */
export function PreviewStage({ settings, screenIndex, onSelectScreen, context, scopes, onToggleScope, toolbar }) {
  const areaRef = useRef(null);
  const scale = useFitScale(areaRef);
  const dark = isDark(settings.appearance.background);
  const current = SCREENS[screenIndex];

  function goIndex(i) {
    const next = (i + SCREENS.length) % SCREENS.length;
    onSelectScreen(SCREENS[next].id);
  }

  return (
    <section
      aria-label="Link preview"
      className="relative flex h-full min-h-[720px] flex-col overflow-hidden transition-colors duration-300 lg:min-h-0"
      style={{ background: settings.appearance.background }}
    >
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-2 px-4 pt-5">{toolbar}</div>

      <div ref={areaRef} className="relative min-h-0 flex-1" onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "ArrowLeft") goIndex(screenIndex - 1);
        if (e.key === "ArrowRight") goIndex(screenIndex + 1);
      }}>
        {SCREENS.map((screen, i) => {
          const offset = i - screenIndex;
          if (Math.abs(offset) > 2) return null;
          const isCurrent = offset === 0;
          const x = offset * (CARD_W + GAP) * scale;
          return (
            <div
              key={screen.id}
              className={cn(
                "absolute left-1/2 top-1/2 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none",
                Math.abs(offset) === 2 && "opacity-0",
                Math.abs(offset) === 1 && "hidden opacity-70 sm:block"
              )}
              style={{
                transform: `translate(calc(-50% + ${x}px), -50%) scale(${isCurrent ? scale : scale * 0.94})`,
                zIndex: isCurrent ? 10 : 5,
              }}
            >
              <div inert={isCurrent ? undefined : ""} aria-hidden={isCurrent ? undefined : true}>
                <LinkPreview
                  screenId={screen.id}
                  settings={settings}
                  interactive={isCurrent}
                  context={context}
                  onBack={() => goIndex(screenIndex - 1)}
                  onClose={() => onSelectScreen("exit")}
                />
              </div>
              {Math.abs(offset) === 1 && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`Show ${screen.label}`}
                  onClick={() => onSelectScreen(screen.id)}
                  className="absolute inset-0 cursor-pointer rounded-[22px] transition-colors hover:bg-white/10"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="relative z-20 flex flex-col gap-3 px-4 pb-5 pt-2 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goIndex(screenIndex - 1)}
            aria-label="Previous screen"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-card ring-1 ring-ink/5 hover:bg-sunken focus-ring"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goIndex(screenIndex + 1)}
            aria-label="Next screen"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-card ring-1 ring-ink/5 hover:bg-sunken focus-ring"
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className={cn("ml-1 text-[13px] font-medium", dark ? "text-white" : "text-ink")} aria-live="polite">
            <span className="tabular-nums">
              {screenIndex + 1} of {SCREENS.length}
            </span>
            <span className={dark ? "text-white/70" : "text-ink-muted"}> · {current.label}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Preview scopes">
          <span className={cn("mr-1 text-[12.5px] font-medium", dark ? "text-white/80" : "text-ink-muted")}>Preview scopes</span>
          {SCOPES.map((sc) => {
            const on = scopes.includes(sc.id);
            const last = on && scopes.length === 1;
            return (
              <button
                key={sc.id}
                type="button"
                aria-pressed={on}
                onClick={() => !last && onToggleScope(sc.id)}
                title={last ? "Keep at least one scope" : sc.scope}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium shadow-card ring-1 transition-colors focus-ring",
                  on ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-ink/10 hover:bg-sunken",
                  last && "cursor-not-allowed"
                )}
              >
                {on && <Check className="h-3.5 w-3.5" aria-hidden />}
                {sc.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
