"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

interface FadeInProps {
  delay?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
}

export function FadeIn({ delay = 0, duration = 0.5, className, children }: FadeInProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeInUp}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] as const }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  stagger?: number;
  className?: string;
  children?: React.ReactNode;
}

export function StaggerContainer({ stagger = 0.08, className, children }: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  className?: string;
  children?: React.ReactNode;
}

export function StaggerItem({ className, children }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={fadeInUp}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as const }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface MotionCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function MotionCard({ className, children }: MotionCardProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
