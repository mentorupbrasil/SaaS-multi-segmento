"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { RetroGrid } from "@/components/marketing/retro-grid";
import { cn } from "@/lib/utils";

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface ActionProps {
  text: React.ReactNode;
  href: string;
  variant?: ButtonProps["variant"];
  className?: string;
  /** CTA primário com borda animada (estilo Farm UI) */
  animated?: boolean;
}

export interface HeroSectionProps {
  badge?: React.ReactNode;
  headline: {
    regular: React.ReactNode;
    gradient: React.ReactNode;
  };
  description: string;
  actions: ActionProps[];
  stats: StatProps[];
  preview?: React.ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

function statItemVariants() {
  return {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as const },
    },
  };
}

function HeroStats({
  stats,
  reduceMotion,
}: {
  stats: StatProps[];
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div className="mx-auto mt-10 w-full max-w-2xl" variants={reduceMotion ? undefined : itemVariants}>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card/90 via-card/70 to-muted/30 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm dark:from-card/80 dark:via-card/60 dark:to-muted/20 dark:ring-white/[0.04]">
        <motion.div
          className="grid grid-cols-3 divide-x divide-border/60"
          variants={reduceMotion ? undefined : statsContainerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? false : "visible"}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="group flex flex-col items-center gap-2 px-2 py-4 transition-colors hover:bg-primary/[0.04] sm:px-4 sm:py-5"
              variants={reduceMotion ? undefined : statItemVariants()}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-inner ring-1 ring-primary/15 transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
                {stat.icon}
              </div>
              <div className="min-w-0 text-center">
                <p className="text-base font-bold tabular-nums tracking-tight text-foreground sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground sm:text-xs">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function AnimatedPrimaryCta({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
      <span className="absolute inset-[-1000%] motion-safe:animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#6366f1_50%,#E2CBFF_100%)] motion-reduce:hidden" />
      <Link
        href={href}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card px-8 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all",
          "bg-gradient-to-tr from-muted/40 via-primary/10 to-transparent hover:from-muted/60 hover:via-primary/20 dark:from-muted/20 dark:via-primary/15",
          className,
        )}
      >
        {children}
      </Link>
    </span>
  );
}

export function HeroSection({
  badge,
  headline,
  description,
  actions,
  stats,
  preview,
  className,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden border-b border-border/50", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(100vh,900px)] bg-[radial-gradient(ellipse_24%_80%_at_50%_-20%,rgba(99,102,241,0.18),transparent)] dark:bg-[radial-gradient(ellipse_24%_80%_at_50%_-20%,rgba(99,102,241,0.28),transparent)]" />

      <section className="relative">
        <RetroGrid cellSize={56} opacity={0.35} />

        <div className="section relative z-10 pb-16 pt-16 sm:pb-24 sm:pt-20 md:pt-24">
          <motion.div
            className="mx-auto max-w-3xl space-y-6 text-center"
            variants={reduceMotion ? undefined : containerVariants}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? false : "visible"}
          >
            {badge && (
              <motion.div variants={reduceMotion ? undefined : itemVariants} className="flex justify-center">
                <span className="group inline-flex items-center gap-1 rounded-full border border-border/60 bg-gradient-to-tr from-muted/50 via-muted/30 to-transparent px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30 hover:text-foreground dark:from-muted/30 dark:via-muted/10">
                  {badge}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </motion.div>
            )}

            <motion.h1
              className="text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl md:leading-[1.08]"
              variants={reduceMotion ? undefined : itemVariants}
            >
              <span className="bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-transparent dark:from-white dark:to-white/70">
                {headline.regular}
              </span>{" "}
              <span className="gradient-text">{headline.gradient}</span>
            </motion.h1>

            <motion.p
              className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              variants={reduceMotion ? undefined : itemVariants}
            >
              {description}
            </motion.p>

            <motion.div
              className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
              variants={reduceMotion ? undefined : itemVariants}
            >
              {actions.map((action, index) => {
                if (action.animated || (index === 0 && action.variant !== "outline")) {
                  return (
                    <AnimatedPrimaryCta key={`${action.href}-${index}`} href={action.href} className={action.className}>
                      {action.text}
                    </AnimatedPrimaryCta>
                  );
                }

                return (
                  <Button
                    key={`${action.href}-${index}`}
                    asChild
                    variant={action.variant ?? "outline"}
                    size="lg"
                    className={cn("rounded-full px-8", action.className)}
                  >
                    <Link href={action.href}>{action.text}</Link>
                  </Button>
                );
              })}
            </motion.div>

            <HeroStats stats={stats} reduceMotion={reduceMotion} />
          </motion.div>

          {preview && (
            <motion.div
              className="relative mx-auto mt-16 max-w-5xl px-2 sm:mt-20 sm:px-4 md:mt-24"
              initial={reduceMotion ? false : { opacity: 0, y: 48 }}
              animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] as const }}
            >
              <div
                className="pointer-events-none absolute inset-x-[10%] -top-6 h-20 bg-gradient-to-b from-primary/25 to-transparent blur-3xl sm:-top-10 sm:h-28"
                aria-hidden
              />
              <div className="relative [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]">{preview}</div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
