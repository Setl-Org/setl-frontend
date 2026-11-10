import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { FIELD, pillClass } from "../brand";
import { SetlMark } from "./SetlMark";

/**
 * ClosingCta - Every public page ends here: the brand field, the mark mirrored
 * to the left edge, and the two paths at equal weight.
 */
export function ClosingCta({ title = "Get the keys. Build the product.", id = "cta" }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const keysHref = isAuthenticated ? "/developer" : "/auth";
  return (
    <section id={id} className="on-dark relative isolate overflow-hidden text-white" style={{ background: FIELD }}>
      <SetlMark
        strokeWidth={1.1}
        className="pointer-events-none absolute left-0 top-1/2 -z-10 aspect-square w-[min(820px,150vw)] -translate-x-1/2 -translate-y-1/2 text-white/[0.12]"
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-32">
        <h2 className="max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">{title}</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/pricing#contact" className={`${pillClass} bg-white text-[#141414] hover:bg-[#F3EEF9]`}>
            Talk to the team
          </Link>
          <Link to={keysHref} className={`${pillClass} bg-[#141414] text-white ring-1 ring-white/20 hover:bg-black`}>
            Get API keys
          </Link>
        </div>
      </div>
    </section>
  );
}
