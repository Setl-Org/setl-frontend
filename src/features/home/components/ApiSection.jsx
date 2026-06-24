import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { BUTTON_TERTIARY_CLASS } from "@/lib/styles";
import { AnimatedSection } from "./AnimatedSection";

const TABS = ["Request", "Response"];

/**
 * ApiSection - Developer section: REST API for parsed statement data, shown
 * as a tabbed request/response panel.
 */
export function ApiSection() {
  const [tab, setTab] = useState("Response");

  return (
    <section
      id="api"
      className="relative overflow-hidden border-t border-border bg-secondary py-16 section-pattern-dark sm:py-24 lg:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-tertiary/40 bg-tertiary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tertiary">
            For developers
          </span>
          <h2 className="section-title mt-4 text-primary">
            Skip the PDF. Get the API keys.
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-lg text-secondary-foreground/80"
            style={{ lineHeight: 1.6 }}
          >
            You build the experience. We&apos;ll handle the data — parsed
            transactions, balances, and AI-enriched categories behind one simple
            REST API.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative mx-auto mt-10 max-w-2xl overflow-hidden rounded-xl border border-white/15 bg-white/5 text-left shadow-2xl shadow-black/20 backdrop-blur-xl sm:mt-14 sm:rounded-2xl"
          >
            {/* Window chrome + tabs */}
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
              </div>
              <div className="flex gap-1">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                      tab === t
                        ? "bg-tertiary/20 text-primary"
                        : "text-primary/50 hover:text-primary/80"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <pre className="overflow-x-auto p-4 text-left font-mono text-xs leading-relaxed text-primary/90 sm:p-6 sm:text-sm">
              <code>
                {tab === "Request" ? (
                  <>
                    <span className="text-tertiary">GET</span>{" "}
                    <span className="text-primary">/transactions/get</span>
                    {"\n"}
                    <span className="text-primary/50">Authorization:</span>{" "}
                    <span className="text-success">Bearer sk_live_••••</span>
                    {"\n"}
                    <span className="text-primary/50">Accept:</span>{" "}
                    <span className="text-success">application/json</span>
                    <span className="ml-0.5 inline-block h-4 w-1 animate-cursor bg-tertiary align-middle" />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </code>
            </pre>
          </motion.div>

          <div className="mt-8 flex justify-center sm:mt-10">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/auth"
                className={cn(
                  BUTTON_TERTIARY_CLASS,
                  "group min-h-[48px] gap-2 rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9)] px-6 py-3 text-base font-semibold shadow-lg shadow-tertiary/30 ring-1 ring-inset ring-white/20 transition-all hover:shadow-xl hover:shadow-tertiary/40 hover:brightness-110 sm:px-8"
                )}
              >
                Get the API keys
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
