import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";

/**
 * ApiSection - Section showcasing REST API for parsed statement data.
 */
export function ApiSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-secondary py-16 section-pattern-dark sm:py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <h2 className="section-title text-primary">Your data, via API</h2>
          <p
            className="mt-4 text-lg text-secondary-foreground/80"
            style={{ lineHeight: 1.6 }}
          >
            Parsed transactions, balances, and AI-enriched categories from your
            uploaded statements—available through a simple REST API.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative mt-10 overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:mt-14 sm:rounded-2xl"
          >
            <div className="flex gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="h-2.5 w-2.5 rounded-full bg-error/80"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                className="h-2.5 w-2.5 rounded-full bg-warning/80"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="h-2.5 w-2.5 rounded-full bg-success/80"
              />
            </div>
            <pre className="overflow-x-auto p-4 text-left text-xs font-mono text-primary/90 sm:p-6 sm:text-sm">
              <code>
                <span className="text-tertiary">GET</span>{" "}
                <span className="text-primary">/accounts/get</span>
                {"\n"}
                <span className="text-tertiary">GET</span>{" "}
                <span className="text-primary">/transactions/get</span>
                {"\n"}
                <span className="text-primary/60">
                  {" "}
                  Your parsed transactions, auto-categorized
                </span>
                <span className="ml-0.5 inline-block h-4 w-1 animate-cursor bg-tertiary" />
              </code>
            </pre>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
