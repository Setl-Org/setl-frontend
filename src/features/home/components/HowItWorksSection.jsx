import { motion } from "framer-motion";
import { FileUp, FileSearch, LogIn, Zap } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { HOW_IT_WORKS_STEPS } from "../constants";

const STEP_ICONS = {
  LogIn,
  FileUp,
  FileSearch,
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
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">
            Sign in, upload statements by bank and month, get analytics and API access.
          </p>
        </AnimatedSection>

        <div className="mx-auto mt-12 max-w-4xl sm:mt-16 lg:mt-20">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map(({ step, label, hint, iconKey }, i) => {
              const Icon = STEP_ICONS[iconKey];
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card-hover flex flex-col items-center rounded-2xl border border-border/80 bg-primary p-6 text-center"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-tertiary bg-tertiary/5 text-sm font-bold text-tertiary">
                    {step}
                  </div>
                  {Icon && (
                    <div className="mt-3 flex h-8 w-8 items-center justify-center text-tertiary">
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <span className="mt-2 font-semibold text-secondary">
                    {label}
                  </span>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
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
