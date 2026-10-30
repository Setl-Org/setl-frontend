import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { BUTTON_TERTIARY_CLASS } from "@/lib/styles";
import { BANK_LOGOS, FADE_IN_UP, STAGGER } from "../constants";
import { MouseSpotlight } from "./MouseSpotlight";
import { BankLogo } from "./BankLogo";

/**
 * HeroSection - Landing hero with headline, CTAs, and bank marquee.
 */
export function HeroSection() {
  const [dark, setDark] = useState(false);

  return (
    <>
      <div className="mouse-spotlight fixed inset-0 z-0 h-screen overflow-hidden pointer-events-none">
        <MouseSpotlight />
      </div>

      <section
        className={cn(
          "relative overflow-hidden pt-14 transition-colors duration-500 sm:pt-16",
          dark ? "bg-secondary" : "hero-patterns"
        )}
      >
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

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <motion.div
            initial="initial"
            animate="animate"
            variants={STAGGER}
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            {/* Left column — value proposition (Emotion) */}
            <motion.div variants={STAGGER} className="text-left">
              {/* <motion.div
                variants={FADE_IN_UP}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-tertiary/25 bg-tertiary/5 px-3 py-1.5 text-sm font-medium text-tertiary sm:mb-6 sm:px-4 sm:border-tertiary/40 sm:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)]"
              >
                <Sparkles className="h-4 w-4 animate-pulse" />
                Built for Pakistani Fintechs
              </motion.div> */}
              <motion.h1
                variants={FADE_IN_UP}
                className={cn(
                  "text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl",
                  dark ? "text-primary" : "text-secondary"
                )}
                style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}
              >
                One API for Pakistani bank accounts.
                <span className="block bg-[linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b,#22c55e,#3b82f6,#7c3aed)] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                  Your users connect. You build.
                </span>
              </motion.h1>
              <motion.p
                variants={FADE_IN_UP}
                className={cn(
                  "mt-4 max-w-xl text-sm sm:mt-6 sm:text-base lg:text-lg",
                  dark ? "text-primary/70" : "text-muted-foreground"
                )}
                style={{ lineHeight: 1.7 }}
              >
                Setl is the connector between banks and the fintechs built on
                them. A customer consents, the account connects, and your app
                gets balances and transactions through one API.
              </motion.p>
              <motion.div
                variants={FADE_IN_UP}
                className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
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
                      "group min-h-[48px] w-full gap-2 rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9)] px-6 py-3 text-base font-semibold shadow-lg shadow-tertiary/30 ring-1 ring-inset ring-white/20 transition-all hover:shadow-xl hover:shadow-tertiary/40 hover:brightness-110 sm:w-auto sm:px-8"
                    )}
                  >
                    Start building
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
                <motion.button
                  type="button"
                  onMouseEnter={() => setDark(true)}
                  onMouseLeave={() => setDark(false)}
                  onFocus={() => setDark(true)}
                  onBlur={() => setDark(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 text-base font-medium transition-colors sm:w-auto sm:px-8",
                    dark
                      ? "border-white/20 bg-white/5 text-primary hover:bg-white/10"
                      : "border-border bg-primary text-secondary hover:bg-muted"
                  )}
                >
                  Talk to the team
                </motion.button>
              </motion.div>
              <motion.p
                variants={FADE_IN_UP}
                className={cn(
                  "mt-4 text-xs sm:mt-5 sm:text-sm",
                  dark ? "text-primary/60" : "text-muted-foreground"
                )}
              >
                Connections open with partner banks. Setl never stores login credentials.
              </motion.p>
            </motion.div>

            {/* Right column — live API endpoint preview (Reward) */}
            <motion.div variants={FADE_IN_UP} className="relative w-full">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[linear-gradient(120deg,rgba(124,58,237,0.30),rgba(236,72,153,0.22),rgba(245,158,11,0.18),rgba(59,130,246,0.26))] blur-3xl" />
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-2xl shadow-tertiary/20">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                  <span className="ml-2 font-mono text-xs text-primary/40">
                    setl api
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-left font-mono text-xs leading-relaxed text-primary/90 sm:p-6 sm:text-sm">
                  <code>
                    <span className="text-tertiary">GET</span>{" "}
                    <span className="text-primary">/transactions/get</span>
                    {"\n\n"}
                    <span className="text-primary/40">{"{"}</span>
                    {"\n  "}
                    <span className="text-primary/70">&quot;transactions&quot;</span>
                    <span className="text-primary/40">: [{"{"}</span>
                    {"\n    "}
                    <span className="text-primary/70">&quot;date&quot;</span>
                    <span className="text-primary/40">: </span>
                    <span className="text-success">&quot;2026-06-18&quot;</span>
                    <span className="text-primary/40">,</span>
                    {"\n    "}
                    <span className="text-primary/70">&quot;amount&quot;</span>
                    <span className="text-primary/40">: </span>
                    <span className="text-warning">-2499</span>
                    <span className="text-primary/40">,</span>
                    {"\n    "}
                    <span className="text-primary/70">&quot;merchant&quot;</span>
                    <span className="text-primary/40">: </span>
                    <span className="text-success">&quot;Foodpanda&quot;</span>
                    <span className="text-primary/40">,</span>
                    {"\n    "}
                    <span className="text-primary/70">&quot;category&quot;</span>
                    <span className="text-primary/40">: </span>
                    <span className="text-tertiary">&quot;Food &amp; Dining&quot;</span>
                    {"\n  "}
                    <span className="text-primary/40">{"}]"}</span>
                    {"\n"}
                    <span className="text-primary/40">{"}"}</span>
                    <span className="ml-0.5 inline-block h-4 w-1 animate-cursor bg-tertiary align-middle" />
                  </code>
                </pre>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* <div
          className={cn(
            "relative z-10 border-t py-7 backdrop-blur-sm transition-colors duration-500 sm:py-9",
            dark ? "border-white/10 bg-secondary/60" : "border-border/60 bg-primary/70"
          )}
        >
          <p
            className={cn(
              "mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500",
              dark ? "text-primary/50" : "text-muted-foreground"
            )}
          >
            Supported banks &amp; wallets
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max animate-marquee items-center gap-5 pr-5 sm:gap-8 sm:pr-8">
              {[...BANK_LOGOS, ...BANK_LOGOS].map((bank, i) => (
                <div key={`${bank.slug}-${i}`} className="shrink-0">
                  <BankLogo bank={bank} />
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </section>
    </>
  );
}
