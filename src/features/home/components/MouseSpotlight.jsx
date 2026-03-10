import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * MouseSpotlight - Decorative mouse-follow gradient orb for hero.
 * Rendered inside a .mouse-spotlight wrapper in CSS for mobile opacity.
 */
export function MouseSpotlight() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springConfig = { damping: 30, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mounted, mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{
        x,
        y,
        background:
          "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 60%)",
      }}
    />
  );
}
