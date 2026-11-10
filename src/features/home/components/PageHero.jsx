import { cn } from "@/lib/cn";
import { SetlMark } from "./SetlMark";

/**
 * PageHero - The public site's page opening: white primary ground, the pale
 * half Setl mark cropped by the right edge, an ink headline, and an optional
 * product visual on the right. Pages below the landing use it so every page
 * opens the same way.
 */
export function PageHero({ title, description, actions, aside, note, titleClassName, className }) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-white text-[#141414]", className)}>
      <SetlMark
        strokeWidth={1}
        className="pointer-events-none absolute right-0 top-1/2 -z-10 hidden aspect-square w-[min(1180px,110vw)] -translate-y-1/2 translate-x-[50%] text-[#f0eafb] md:block"
      />
      <div
        className={cn(
          "mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-32 sm:px-6 lg:pb-24 lg:pt-40",
          aside && "lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16"
        )}
      >
        <div>
          <h1
            className={cn(
              "max-w-[15ch] text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]",
              titleClassName
            )}
          >
            {title}
          </h1>
          {description && <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-[#3f3f3f] sm:text-xl">{description}</p>}
          {actions && <div className="mt-9">{actions}</div>}
          {note && <div className="mt-8 max-w-[34rem]">{note}</div>}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </div>
    </section>
  );
}
