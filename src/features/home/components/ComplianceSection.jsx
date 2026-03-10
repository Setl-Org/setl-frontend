import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { COMPLIANCE_ITEMS, FADE_IN_UP, STAGGER } from "../constants";

/**
 * ComplianceSection - Pills for compliance/security points.
 */
export function ComplianceSection() {
  return (
    <section className="border-t border-border bg-muted/30 py-12 section-pattern-dots sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={STAGGER}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {COMPLIANCE_ITEMS.map((item) => (
            <motion.div
              key={item}
              variants={FADE_IN_UP}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border/80 bg-primary/60 px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm sm:px-4 sm:py-2.5"
            >
              <Check className="h-4 w-4 shrink-0 text-tertiary" />
              {item}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
