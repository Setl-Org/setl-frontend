import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/cn";
import { BUTTON_TERTIARY_CLASS } from "@/lib/styles";

const ROW_ITEMS = [
  { key: "connections", label: "Connections" },
  { key: "analytics", label: "Analytics" },
  { key: "api", label: "API" },
  { key: "support", label: "Support" },
];

/**
 * PricingCard - Single pricing plan card with CTA.
 *
 * @param {Object} props
 * @param {{ name: string, connections: Object, analytics: Object, api: Object, support: Object }} props.plan
 * @param {string} props.currency - Currency key (PKR | AED | SAR)
 * @param {number} props.index - Index for stagger animation
 */
export function PricingCard({ plan, currency, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getValue = (key) => {
    const v = plan[key];
    return typeof v === "string" ? v : (v && v[currency]) ?? v?.PKR ?? "—";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="card-hover rounded-xl border border-border/80 bg-primary p-6 shadow-sm hover:border-tertiary/30 sm:rounded-2xl sm:p-8"
    >
      <h3 className="text-base font-semibold text-secondary sm:text-lg">
        {plan.name}
      </h3>
      <ul className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
        {ROW_ITEMS.map(({ key, label }) => (
          <li
            key={key}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-secondary">{getValue(key)}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/"
        className={cn(
          BUTTON_TERTIARY_CLASS,
          "mt-6 inline-flex min-h-[48px] w-full items-center justify-center transition hover:scale-[1.02] sm:mt-8"
        )}
      >
        Get started
      </Link>
    </motion.div>
  );
}
