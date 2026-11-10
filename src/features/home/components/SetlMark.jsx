import { useId } from "react";
import { cn } from "@/lib/cn";

const SECTOR = "M 13,0 L 50,0 A 50 50 0 0 0 35.355,-35.355 L 9.192,-9.192 A 13 13 0 0 1 13,0 Z";
const LINES = [3.36, 8.96, 14.56, 20.16, 25.76, 31.36, 36.96, 42.56, 48.16];

/**
 * SetlMark - The Setl mark redrawn as single-colour line art (eight hatched
 * sectors), so it can sit large behind content as texture. Same geometry as
 * public/logo-mark.svg. `assemble` plays the page's one authored motion: the
 * sectors turn into place in sequence. Decorative only.
 */
export function SetlMark({ className, strokeWidth = 1.4, assemble = false }) {
  const clipId = `setl-sector-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false" className={cn("overflow-visible", className)}>
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={SECTOR} />
        </clipPath>
      </defs>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" fill="none">
        {Array.from({ length: 8 }).map((_, k) => (
          <g key={k} transform={`rotate(${k * 45})`}>
            <g
              clipPath={`url(#${clipId})`}
              className={assemble ? "motion-safe:animate-[mark-sector_1000ms_cubic-bezier(0.16,1,0.3,1)_both]" : undefined}
              style={assemble ? { animationDelay: `${150 + k * 70}ms` } : undefined}
            >
              {LINES.map((y) => (
                <line key={y} x1="-50" y1={-y} x2="50" y2={-y} />
              ))}
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
