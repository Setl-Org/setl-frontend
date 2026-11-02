import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { FADE_IN_UP, STAGGER } from "../constants";

/** Example raw bank descriptions and how Setl enriches them. */
const EXAMPLES = [
  { raw: "1-FOODPANDA PK KARACHI", merchant: "Foodpanda", category: "Food & Dining", amount: "-2,499" },
  { raw: "TFR CAREEM TECHNOLOGIES", merchant: "Careem", category: "Transport", amount: "-850" },
  { raw: "K-ELECTRIC BILL PYMT 0042", merchant: "K-Electric", category: "Utilities", amount: "-8,300" },
  { raw: "ATM-WDL HBL DEFENCE BR", merchant: "HBL ATM", category: "Cash Withdrawal", amount: "-20,000" },
];

/**
 * AiShowcaseSection - Makes categorization tangible: raw bank descriptions
 * on the left, clean enriched data on the right.
 */
export function AiShowcaseSection() {
  return (
    <section className="border-t border-border bg-primary py-16 section-pattern-dots sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-tertiary/30 bg-tertiary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tertiary">
            <Sparkles className="h-3.5 w-3.5" />
            AI categorization
          </span>
          <h2 className="section-title mt-4">
            From cryptic bank text to clean data
          </h2>
          <p className="section-subtitle">
            Setl reads the raw descriptions a connected account returns and
            turns them into a clear merchant and category.
          </p>
        </AnimatedSection>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={STAGGER}
          className="mx-auto mt-12 max-w-4xl space-y-3 sm:mt-16 sm:space-y-4 lg:mt-20"
        >
          {/* Column labels */}
          <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-4 px-2 sm:grid">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
              Raw bank description
            </span>
            <span />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-tertiary">
              Enriched by Setl
            </span>
          </div>

          {EXAMPLES.map(({ raw, merchant, category, amount }) => (
            <motion.div
              key={raw}
              variants={FADE_IN_UP}
              className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-border/80 bg-primary p-4 shadow-sm transition-shadow hover:shadow-md sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:p-5"
            >
              {/* Raw */}
              <code className="block truncate rounded-lg bg-muted/60 px-3 py-2.5 font-mono text-xs text-muted-foreground sm:text-sm">
                {raw}
              </code>

              {/* Arrow */}
              <div className="flex items-center justify-center text-tertiary">
                <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
              </div>

              {/* Enriched */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-tertiary/15 bg-tertiary/5 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-secondary">
                    {merchant}
                  </p>
                  <span className="mt-0.5 inline-flex items-center rounded-full bg-tertiary/15 px-2 py-0.5 text-xs font-medium text-tertiary">
                    {category}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-sm font-semibold text-secondary">
                  {amount}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
