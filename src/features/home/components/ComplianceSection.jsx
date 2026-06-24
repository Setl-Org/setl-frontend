import { motion } from "framer-motion";
import { Check, MapPin, Lock, KeyRound } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { COMPLIANCE_GROUPS, FADE_IN_UP, STAGGER } from "../constants";

const GROUP_ICONS = {
  MapPin,
  Lock,
  KeyRound,
};

/**
 * ComplianceSection - Security/trust reframed around user control, grouped
 * into three themes (data residency, encryption, access).
 */
export function ComplianceSection() {
  return (
    <section
      id="security"
      className="border-t border-border bg-muted/30 py-16 section-pattern-dots sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-tertiary/30 bg-tertiary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tertiary">
            Security
          </span>
          <h2 className="section-title mt-4">You stay in control of your data</h2>
          <p className="section-subtitle">
            Bank data is sensitive. Setl keeps it in Pakistan, encrypts it end to
            end, and puts access entirely in your hands.
          </p>
        </AnimatedSection>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={STAGGER}
          className="mx-auto mt-12 grid max-w-5xl gap-5 sm:mt-16 sm:grid-cols-3 sm:gap-6 lg:mt-20"
        >
          {COMPLIANCE_GROUPS.map(({ title, iconKey, points }) => {
            const Icon = GROUP_ICONS[iconKey];
            return (
              <motion.div
                key={title}
                variants={FADE_IN_UP}
                className="card-hover flex flex-col items-start rounded-2xl border border-border/80 bg-primary p-6 text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9)] text-primary shadow-md shadow-tertiary/30">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className="mt-4 text-base font-semibold text-secondary">
                  {title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="h-4 w-4 shrink-0 text-tertiary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
