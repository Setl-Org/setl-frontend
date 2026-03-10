import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { BUTTON_SECONDARY_CLASS, BUTTON_TERTIARY_CLASS } from "@/lib/styles";
import { AnimatedSection } from "./AnimatedSection";

/**
 * CtaSection - Final CTA with Get API keys and Contact sales.
 */
export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-primary py-16 section-pattern-cta sm:py-24 lg:py-32">
      <div className="cta-section-bg absolute inset-0 -z-10" />
      <AnimatedSection className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="section-title">Ready to get started?</h2>
        <p className="section-subtitle mt-2 sm:mt-4">
          Sign in, upload your statements, and get API access to your
          transaction data.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link
              to="/auth"
              className={cn(
                BUTTON_TERTIARY_CLASS,
                "inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto sm:px-8 sm:shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)]"
              )}
            >
              Sign in to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.a
            href="mailto:contact@setl.dev"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              BUTTON_SECONDARY_CLASS,
              "inline-flex min-h-[48px] w-full items-center justify-center px-6 py-3 text-base sm:w-auto sm:px-8"
            )}
          >
            Contact sales
          </motion.a>
        </div>
      </AnimatedSection>
    </section>
  );
}
