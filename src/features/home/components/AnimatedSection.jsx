import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * AnimatedSection - Scroll-triggered fade-in-up wrapper for landing sections.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} [props.className] - Optional className for the wrapper
 */
export function AnimatedSection({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
