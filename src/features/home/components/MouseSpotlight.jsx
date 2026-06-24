import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * MouseSpotlight - Decorative mouse-follow gradient behind the hero.
 * Two layered orbs with different spring configs trail the cursor for a
 * soft, animated parallax glow. Rendered inside a .mouse-spotlight wrapper
 * in CSS for mobile opacity.
 */
export function MouseSpotlight() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  // Large soft glow trails slowly; the brighter core follows more tightly,
  // so the two layers separate slightly as the cursor moves.
  const glowX = useSpring(mouseX, { damping: 30, stiffness: 120 });
  const glowY = useSpring(mouseY, { damping: 30, stiffness: 120 });
  const coreX = useSpring(mouseX, { damping: 22, stiffness: 260 });
  const coreY = useSpring(mouseY, { damping: 22, stiffness: 260 });

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
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
        }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          x: coreX,
          y: coreY,
          background:
            "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 60%)",
        }}
      />
    </>
  );
}
