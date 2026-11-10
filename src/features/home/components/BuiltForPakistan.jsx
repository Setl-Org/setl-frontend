import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { InstitutionLogo } from "./InstitutionLogo";
import { SetlMark } from "./SetlMark";

const LEFT = ["HBL", "Meezan Bank", "UBL", "MCB", "Bank Alfalah", "Askari Bank"];
const RIGHT = ["JazzCash", "Easypaisa", "NayaPay", "SadaPay", "Faysal Bank", "Standard Chartered"];

function Pill({ name }) {
  return (
    <span className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] py-2 pl-2 pr-5 text-[15px] font-medium text-white">
      <InstitutionLogo bankName={name} className="h-8 w-8 rounded-full" />
      {name}
    </span>
  );
}

function Column({ names, direction }) {
  return (
    <div className={direction === "up" ? "pill-drift-up" : "pill-drift-down"}>
      <div className="flex flex-col gap-3 pb-3">
        {[...names, ...names].map((n, i) => (
          <Pill key={`${n}-${i}`} name={n} />
        ))}
      </div>
    </div>
  );
}

/**
 * BuiltForPakistan - Dark band (Plaid's coverage section) with the institutions
 * Setl is built for. The pills drift only while the band is on screen.
 */
export function BuiltForPakistan() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="built-for-pakistan"
      className="on-dark relative isolate overflow-hidden bg-[#1d0b30] text-white"
    >
      <SetlMark
        strokeWidth={1}
        className="pointer-events-none absolute -left-[22%] top-1/2 -z-10 h-[900px] w-[900px] -translate-y-1/2 text-white/[0.05]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:py-28">
        <div>
          <h2 id="built-for-pakistan" className="text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
            Built for Pakistan
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
            The banks and wallets your users already have. One schema across all of them, with Raast and 1Link references
            kept when the data carries them, and data hosted in Pakistan.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
            Today account data comes from statements the customer provides. Direct bank connections open as each institution
            joins.
          </p>
          <Link
            to="/developers"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-[#141414] transition-colors hover:bg-[#F3EEF9]"
          >
            How a connection works
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className={`relative ${visible ? "" : "pills-paused"}`}>
          <ul className="sr-only">
            {[...LEFT, ...RIGHT].map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div
            aria-hidden="true"
            className="grid h-[440px] grid-cols-2 gap-3 overflow-hidden [mask-image:linear-gradient(180deg,transparent,black_14%,black_86%,transparent)]"
          >
            <Column names={LEFT} direction="up" />
            <Column names={RIGHT} direction="down" />
          </div>
        </div>
      </div>
    </section>
  );
}
