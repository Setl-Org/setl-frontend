import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { PricingCard } from "./PricingCard";
import { PRICING_PLANS } from "../constants";

/**
 * PricingSection - Transparent pricing plans grid.
 *
 * @param {Object} props
 * @param {string} [props.currency='PKR'] - Selected currency key (PKR | AED | SAR)
 */
export function PricingSection({ currency = "PKR" }) {
  return (
    <section
      id="pricing"
      className="border-t border-border bg-primary py-16 section-pattern-grid sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Transparent pricing</h2>
          <p className="section-subtitle mt-2 sm:mt-4">
            Upload statements, get analytics, and use the API. No direct bank connection.
          </p>
        </AnimatedSection>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8">
          {PRICING_PLANS.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} currency={currency} index={i} />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          Pricing subject to change. Contact sales for enterprise.
        </motion.p>
      </div>
    </section>
  );
}
