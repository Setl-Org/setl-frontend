import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { OUTCOMES, FADE_IN_UP, STAGGER } from "../constants";

/**
 * OutcomeSection - The payoff of one bank connector: one API, one schema,
 * and no stored bank logins.
 */
export function OutcomeSection() {
  return (
    <section className="border-t border-border bg-primary py-16 section-pattern-grid sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">What you actually get back: time.</h2>
          <p className="section-subtitle">
            Hand the messy part to Setl and your team goes back to building the
            product you set out to ship.
          </p>
        </AnimatedSection>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={STAGGER}
          className="mx-auto mt-12 grid max-w-5xl gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6 lg:mt-20"
        >
          {OUTCOMES.map(({ stat, label, hint }) => (
            <motion.div
              key={label}
              variants={FADE_IN_UP}
              className="card-hover flex flex-col items-center rounded-2xl border border-border/80 bg-primary p-8 text-center"
            >
              <span className="inline-block bg-[linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b,#22c55e,#3b82f6,#7c3aed)] bg-[length:200%_auto] bg-clip-text px-1 pb-1.5 text-4xl font-extrabold leading-[1.15] tracking-tight text-transparent animate-shimmer sm:text-5xl">
                {stat}
              </span>
              <span className="mt-3 font-semibold text-secondary">{label}</span>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {hint}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
