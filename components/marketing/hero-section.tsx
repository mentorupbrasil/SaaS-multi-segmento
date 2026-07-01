"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface ActionProps {
  text: string;
  href: string;
  variant?: ButtonProps["variant"];
  className?: string;
}

export interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  eyebrow?: React.ReactNode;
  actions: ActionProps[];
  stats: StatProps[];
  images: { src: string; alt: string }[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export function HeroSection({
  title,
  subtitle,
  eyebrow,
  actions,
  stats,
  images,
  className,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className={cn("relative w-full overflow-hidden border-b border-border bg-background", className)}>
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="section-glow pointer-events-none absolute inset-0" />

      <div className="section relative grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-10 lg:py-24">
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={reduceMotion ? undefined : containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? false : "visible"}
        >
          {eyebrow && (
            <motion.div variants={reduceMotion ? undefined : itemVariants} className="mb-5">
              {eyebrow}
            </motion.div>
          )}

          <motion.h1
            className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            variants={reduceMotion ? undefined : itemVariants}
          >
            {title}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            variants={reduceMotion ? undefined : itemVariants}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            variants={reduceMotion ? undefined : itemVariants}
          >
            {actions.map((action) => (
              <Button key={action.href + action.text} asChild variant={action.variant ?? "default"} size="lg" className={action.className}>
                <Link href={action.href}>{action.text}</Link>
              </Button>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-8 lg:justify-start"
            variants={reduceMotion ? undefined : itemVariants}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold tabular-nums text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto h-[380px] w-full max-w-lg sm:h-[480px] lg:max-w-none"
          variants={reduceMotion ? undefined : containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? false : "visible"}
        >
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute -top-2 left-1/4 h-14 w-14 rounded-full bg-brand-400/20 dark:bg-brand-600/20"
                variants={floatingVariants}
                animate="animate"
                aria-hidden
              />
              <motion.div
                className="absolute bottom-4 right-1/4 h-10 w-10 rounded-lg bg-violet-400/20 dark:bg-violet-600/20"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: "0.5s" }}
                aria-hidden
              />
              <motion.div
                className="absolute bottom-1/3 left-2 h-5 w-5 rounded-full bg-emerald-400/25 dark:bg-emerald-600/20"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: "1s" }}
                aria-hidden
              />
            </>
          )}

          {images[0] && (
            <motion.div
              className="absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/10 sm:h-60 sm:w-60"
              variants={reduceMotion ? undefined : imageVariants}
            >
              <Image src={images[0].src} alt={images[0].alt} width={240} height={240} className="h-full w-full rounded-xl object-cover" priority />
            </motion.div>
          )}

          {images[1] && (
            <motion.div
              className="absolute right-0 top-[28%] h-36 w-36 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/10 sm:h-52 sm:w-52"
              variants={reduceMotion ? undefined : imageVariants}
            >
              <Image src={images[1].src} alt={images[1].alt} width={208} height={208} className="h-full w-full rounded-xl object-cover" />
            </motion.div>
          )}

          {images[2] && (
            <motion.div
              className="absolute bottom-0 left-0 h-28 w-28 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/10 sm:h-44 sm:w-44"
              variants={reduceMotion ? undefined : imageVariants}
            >
              <Image src={images[2].src} alt={images[2].alt} width={176} height={176} className="h-full w-full rounded-xl object-cover" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
