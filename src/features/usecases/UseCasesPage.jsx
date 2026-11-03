import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Landmark,
  Wallet,
  Calculator,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  ReceiptText,
  ArrowLeftRight,
  ArrowRight,
  Check,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BUTTON_SECONDARY_CLASS, BUTTON_TERTIARY_CLASS } from "@/lib/styles";
import { LandingNav, Footer, AnimatedSection } from "@/features/home/components";
import { UseCaseRequestForm } from "./components/UseCaseRequestForm";
import { USE_CASES } from "./constants";

const USE_CASE_ICONS = {
  Landmark,
  Wallet,
  Calculator,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  ReceiptText,
  ArrowLeftRight,
};

const STAGGER = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const FADE_IN_UP = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

/**
 * UseCasesPage - Standalone page presenting the workflows teams build on Setl.
 * Reuses the landing nav and footer; the body is a hero, a grid of use cases,
 * and a closing CTA. Mirrors the home feature's section/card design language.
 */
export function UseCasesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-primary">
      <LandingNav
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-primary pt-28 pb-16 section-pattern-grid sm:pt-32 sm:pb-24 lg:pb-28">
        <AnimatedSection className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-tertiary/30 bg-tertiary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-tertiary">
            Use cases
          </span>
          <h1 className="section-title mt-5">
            One bank API. Every financial workflow.
          </h1>
          <p className="section-subtitle mt-4">
            Lending, budgeting, accounting, and reconciliation all read
            consented Pakistani bank accounts through one Setl API.
          </p>
        </AnimatedSection>
      </section>

      {/* Use cases grid */}
      <section className="bg-muted/30 py-16 section-pattern-dots sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={STAGGER}
            className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {USE_CASES.map(({ slug, iconKey, title, summary, points }) => {
              const Icon = USE_CASE_ICONS[iconKey];
              return (
                <motion.div
                  key={title}
                  id={slug}
                  variants={FADE_IN_UP}
                  className="card-hover flex scroll-mt-24 flex-col rounded-2xl border border-border/80 bg-primary p-6 text-left"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-tertiary/40 bg-tertiary/5 text-tertiary">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-secondary">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {summary}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-border/60 pt-4">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-secondary/80"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-tertiary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Request a use case form */}
      <UseCaseRequestForm />

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border bg-primary py-16 section-pattern-cta sm:py-24 lg:py-28">
        <div className="cta-section-bg absolute inset-0 -z-10" />
        <AnimatedSection className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="section-title">Don&apos;t see your use case?</h2>
          <p className="section-subtitle mt-2 sm:mt-4">
            If it needs consented account data, Setl can power it. Get API
            access and tell us which institutions you need.
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
                Get API keys
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.a
              href="#request"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                BUTTON_SECONDARY_CLASS,
                "inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto sm:px-8"
              )}
            >
              <Mail className="h-4 w-4" />
              Request a use case
            </motion.a>
            <Link
              to="/"
              className="inline-flex min-h-[48px] w-full items-center justify-center text-base font-medium text-secondary underline-offset-4 hover:underline sm:w-auto"
            >
              Back to home
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
