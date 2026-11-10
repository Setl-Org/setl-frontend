import { useMemo } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { SkeletonBlock } from "@/components/app/SkeletonBlock";

/** Decorative ribbon of fine lines, drawn once. */
function Ribbon() {
  const paths = useMemo(() => {
    const out = [];
    const n = 34;
    for (let i = 0; i < n; i += 1) {
      const k = i / (n - 1);
      out.push(
        `M ${470 + k * 150} 330 C ${600 + k * 30} ${230 - k * 90}, ${650 - k * 20} ${90 + k * 110}, ${1000} ${-20 + k * 150}`
      );
    }
    for (let i = 0; i < 22; i += 1) {
      const k = i / 21;
      out.push(`M ${640 + k * 140} 340 C ${720} ${250 - k * 40}, ${820 - k * 60} ${60 + k * 40}, ${1010} ${40 + k * 90}`);
    }
    return out;
  }, []);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 320"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="setup-ribbon" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#c44fa3" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#a78bfa" stopOpacity="0.75" />
          <stop offset="1" stopColor="#f3eef9" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="url(#setup-ribbon)" strokeWidth="0.9" strokeOpacity={0.55} />
      ))}
    </svg>
  );
}

/**
 * SetupHero - Plaid's "Get full access" card for Setl: real setup progress, one
 * segment per step, and an arrow that runs the next step.
 *
 * steps: [{ id, label, done, action }]
 */
export function SetupHero({ steps, loading = false }) {
  const doneCount = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);
  const allDone = !next;

  return (
    <section
      aria-labelledby="setup-title"
      className="relative isolate overflow-hidden rounded-[22px] bg-[radial-gradient(120%_140%_at_100%_100%,#5b2a86_0%,#2b1748_38%,#141414_72%)] px-6 pb-7 pt-8 text-white shadow-raised sm:px-10 sm:pb-9 sm:pt-11"
    >
      <Ribbon />
      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h2 id="setup-title" className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
              {allDone ? "You're all set" : "Finish setting up Setl"}
            </h2>
            {loading ? (
              <SkeletonBlock className="mt-4 h-4 w-72 opacity-20" />
            ) : (
              <p className="mt-3 text-[15px] text-white/80 sm:text-[17px]">
                {allDone
                  ? "Your accounts are connected and API access is ready."
                  : `${steps.length - doneCount} of ${steps.length} steps left before your data is ready for the API.`}
              </p>
            )}
          </div>
          {!loading && (
            <button
              type="button"
              onClick={allDone ? steps[steps.length - 1]?.action : next.action}
              aria-label={allDone ? "Open API reference" : `Next step: ${next.label}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-raised transition-transform duration-200 hover:translate-x-0.5 hover:scale-105 focus-ring"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
          )}
        </div>

        <ol className="mt-10 grid grid-cols-2 gap-x-3 gap-y-5 sm:mt-12 sm:grid-cols-4">
          {steps.map((step) => {
            const current = !loading && next?.id === step.id;
            return (
              <li key={step.id}>
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-colors",
                    loading ? "bg-white/15" : step.done ? "bg-white" : current ? "bg-white/40" : "bg-white/15"
                  )}
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={step.action}
                  disabled={loading}
                  className={cn(
                    "mt-3 flex items-center gap-2 rounded-md text-left text-[14px] transition-colors focus-ring sm:text-[15px]",
                    step.done ? "text-white/75 hover:text-white" : current ? "font-semibold text-white" : "text-white/60 hover:text-white/90"
                  )}
                >
                  {step.done && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                  )}
                  {step.label}
                  <span className="sr-only">{step.done ? " (done)" : current ? " (next step)" : ""}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
