import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { METRICS, FADE_IN_UP, STAGGER } from "../constants";

/**
 * CountUp - animates a number from 0 to `to` once it scrolls into view.
 */
function CountUp({ to, duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return <span ref={ref}>{value}</span>;
}

/**
 * MetricsSection - Credibility band of product-true metrics with count-up.
 */
export function MetricsSection() {
  return (
    <section className="border-t border-border bg-primary py-16 section-pattern-grid sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Built to be trusted from day one</h2>
          <p className="section-subtitle">
            No black boxes — just clean data, strong encryption, and full
            coverage of the banks your users actually use.
          </p>
        </AnimatedSection>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={STAGGER}
          className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 sm:mt-16 sm:gap-8 lg:mt-20 lg:grid-cols-4"
        >
          {METRICS.map(({ value, suffix, prefix, display, label }) => (
            <motion.div
              key={label}
              variants={FADE_IN_UP}
              className="flex flex-col items-center text-center"
            >
              <span className="inline-block bg-[linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b,#22c55e,#3b82f6,#7c3aed)] bg-[length:200%_auto] bg-clip-text px-1 pb-1.5 text-4xl font-extrabold leading-[1.15] tracking-tight text-transparent animate-shimmer sm:text-5xl lg:text-6xl">
                {display ? (
                  display
                ) : (
                  <>
                    {prefix}
                    <CountUp to={value} />
                    {suffix}
                  </>
                )}
              </span>
              <span className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
