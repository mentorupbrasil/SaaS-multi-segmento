"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScrollProgress({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const scrollYProgress = useMotionValue(0);
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    setMounted(true);

    if (reduceMotion) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollYProgress.set(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduceMotion, scrollYProgress]);

  if (!mounted || reduceMotion) return null;

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500",
        className,
      )}
      style={{ scaleX }}
      aria-hidden
    />
  );
}
