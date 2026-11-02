import { motion } from "framer-motion";
import { Landmark, Layers, ShieldCheck, Zap } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { HOW_IT_WORKS_STEPS } from "../constants";

const STEP_ICONS = {
  ShieldCheck,
  Landmark,
  Layers,
  Zap,
};

/**
 * HowItWorksSection - Four-step "How it works" product section.
 */
export function HowItWorksSection() {
  return (
    <section
      id="features"
      className="border-t border-border bg-muted/30 py-16 section-pattern-dots sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-tertiary/30 bg-tertiary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tertiary">
            How it works
          </span>
          <h2 className="section-title mt-4">
            From consent to one API in four steps
          </h2>
          <p className="section-subtitle">
            Your user consents, connects their bank, and your app reads one
            API. Connections open with partner institutions.
          </p>
        </AnimatedSection>

        <div className="mx-auto mt-12 max-w-6xl sm:mt-16 lg:mt-20">
          <div className="relative grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {/* Connector line stringing the steps together on desktop */}
            <div className="pointer-events-none absolute left-0 right-0 top-[2.75rem] -z-10 hidden h-px bg-gradient-to-r from-transparent via-tertiary/30 to-transparent lg:block" />

            {HOW_IT_WORKS_STEPS.map(({ step, label, hint, iconKey }, i) => {
              const Icon = STEP_ICONS[iconKey];
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col items-start rounded-2xl border border-border/80 bg-primary p-6 text-left shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:border-tertiary/30 hover:shadow-xl hover:shadow-tertiary/10 hover:ring-tertiary/20"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9)] text-primary shadow-md shadow-tertiary/30 transition-transform duration-300 group-hover:scale-105">
                    {Icon && <Icon className="h-6 w-6" />}
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-tertiary/20 bg-primary text-xs font-bold text-tertiary shadow-sm">
                      {step}
                    </span>
                  </div>
                  <span className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-tertiary">
                    Step {String(step).padStart(2, "0")}
                  </span>
                  <span className="mt-1 text-base font-semibold text-secondary">
                    {label}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {hint}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
