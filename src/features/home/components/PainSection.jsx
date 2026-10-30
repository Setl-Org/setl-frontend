import { motion } from "framer-motion";
import { Building2, KeyRound, Unlink } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { PAIN_POINTS } from "../constants";

const PAIN_ICONS = {
  Building2,
  KeyRound,
  Unlink,
};

/**
 * PainSection - Names the cost of integrating each bank yourself.
 */
export function PainSection() {
  return (
    <section className="border-t border-border bg-muted/30 py-16 section-pattern-dots sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">
            You didn&apos;t start a fintech to integrate every bank.
          </h2>
          <p className="section-subtitle">
            Pakistan already moves money. The missing piece is a standard,
            consented way for an app to read the account behind it.
          </p>
        </AnimatedSection>

        <div className="mx-auto mt-12 max-w-5xl sm:mt-16 lg:mt-20">
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {PAIN_POINTS.map(({ label, hint, iconKey }, i) => {
              const Icon = PAIN_ICONS[iconKey];
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card-hover flex flex-col items-center rounded-2xl border border-border/80 bg-primary p-6 text-center"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-error/40 bg-error/5 text-error">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <span className="mt-4 font-semibold text-secondary">
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
