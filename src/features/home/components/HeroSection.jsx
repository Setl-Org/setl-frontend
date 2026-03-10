import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { BUTTON_SECONDARY_CLASS, BUTTON_TERTIARY_CLASS } from "@/lib/styles";
import { BANKS, FADE_IN_UP, STAGGER } from "../constants";
import { MouseSpotlight } from "./MouseSpotlight";

/**
 * HeroSection - Landing hero with headline, CTAs, and bank marquee.
 */
export function HeroSection() {
  return (
    <>
      <div className="mouse-spotlight fixed inset-0 z-0 h-screen overflow-hidden pointer-events-none">
        <MouseSpotlight />
      </div>

      <section className="relative overflow-hidden pt-14 sm:pt-16 hero-patterns">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-tertiary/4 blur-[100px] animate-float sm:bg-tertiary/10" />
          <div
            className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-tertiary/3 blur-[80px] animate-float sm:bg-tertiary/6"
            style={{ animationDelay: "-2s" }}
          />
          <div
            className="absolute -bottom-20 right-1/3 h-80 w-80 rounded-full bg-tertiary/3 blur-[90px] animate-float sm:bg-tertiary/8"
            style={{ animationDelay: "-4s" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.02),transparent_50%)] sm:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.04),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <motion.div
            initial="initial"
            animate="animate"
            variants={STAGGER}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={FADE_IN_UP}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-tertiary/25 bg-tertiary/5 px-3 py-1.5 text-sm font-medium text-tertiary sm:mb-6 sm:px-4 sm:border-tertiary/40 sm:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)]"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Built for Pakistani Fintechs
            </motion.div>
            <motion.h1
              variants={FADE_IN_UP}
              className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Statements into data.
              <span className="block bg-[linear-gradient(90deg,#7c3aed,#a78bfa,#7c3aed)] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                Without the complexity.
              </span>
            </motion.h1>
            <motion.p
              variants={FADE_IN_UP}
              className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl"
              style={{ lineHeight: 1.7 }}
            >
              Upload PDF statements by bank and month. We parse them.
              <br />
              You get <span className="font-semibold italic text-secondary">AI-categorized</span> analytics and API access.
              <br />
              SBP-compliant. Data in Pakistan.
            </motion.p>
            <motion.div
              variants={FADE_IN_UP}
              className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/auth"
                  className={cn(
                    BUTTON_TERTIARY_CLASS,
                    "inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto sm:px-8 sm:shadow-[0_0_30px_-8px_rgba(124,58,237,0.5)]"
                  )}
                >
                  Start building
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  BUTTON_SECONDARY_CLASS,
                  "inline-flex min-h-[48px] w-full items-center justify-center gap-2 px-6 py-3 text-base sm:w-auto sm:px-8"
                )}
              >
                See the flow
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative z-10 border-t border-border/60 bg-primary/80 py-6 backdrop-blur-sm sm:py-8">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Integrated with
          </p>
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee gap-16 pr-16">
              {[...BANKS, ...BANKS].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 text-base font-semibold text-muted-foreground/80 whitespace-nowrap sm:text-lg"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
