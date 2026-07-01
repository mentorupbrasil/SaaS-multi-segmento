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
  text: React.ReactNode;
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
    transition: { staggerChildren: 0.2 },
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

function imageVariants(delay = 0) {
  return {
    hidden: { opacity: 0, scale: 0.8, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] as const,
      },
    },
  };
}

function floatingAnimation(delay = 0) {
  return {
    y: [0, -10, 0],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  };
}

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
    <section className={cn("relative w-full overflow-hidden bg-background py-12 sm:py-24", className)}>
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      <div className="section-glow pointer-events-none absolute inset-0" />

      <div className="section relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        {/* Coluna esquerda — texto */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={reduceMotion ? undefined : containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? false : "visible"}
        >
          {eyebrow && (
            <motion.div variants={reduceMotion ? undefined : itemVariants} className="mb-4">
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
            className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground lg:max-w-xl"
            variants={reduceMotion ? undefined : itemVariants}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
            variants={reduceMotion ? undefined : itemVariants}
          >
            {actions.map((action, index) => (
              <Button
                key={`${action.href}-${index}`}
                asChild
                variant={action.variant ?? "default"}
                size="lg"
                className={action.className}
              >
                <Link href={action.href}>{action.text}</Link>
              </Button>
            ))}
          </motion.div>

          {/* Stats — linha única no desktop, como no 21st */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 lg:justify-start"
            variants={reduceMotion ? undefined : itemVariants}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold tabular-nums leading-none text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Coluna direita — collage (posições do código 21st) */}
        <motion.div
          className="relative h-[400px] w-full sm:h-[500px]"
          variants={reduceMotion ? undefined : containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? false : "visible"}
        >
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute -top-4 left-1/4 h-16 w-16 rounded-full bg-blue-200/50 dark:bg-blue-800/30"
                animate={floatingAnimation(0)}
                aria-hidden
              />
              <motion.div
                className="absolute bottom-0 right-1/4 h-12 w-12 rounded-lg bg-purple-200/50 dark:bg-purple-800/30"
                animate={floatingAnimation(0.5)}
                aria-hidden
              />
              <motion.div
                className="absolute bottom-1/4 left-4 h-6 w-6 rounded-full bg-green-200/50 dark:bg-green-800/30"
                animate={floatingAnimation(1)}
                aria-hidden
              />
            </>
          )}

          {images[0] && (
            <motion.div
              className="absolute left-1/2 top-0 z-20 h-48 w-48 rounded-2xl bg-muted p-2 shadow-lg sm:h-64 sm:w-64"
              style={{ x: "-50%", transformOrigin: "bottom center" }}
              variants={reduceMotion ? undefined : imageVariants(0.2)}
              whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={images[0].src}
                alt={images[0].alt}
                width={512}
                height={512}
                quality={90}
                priority
                sizes="(max-width: 640px) 192px, 256px"
                className="h-full w-full rounded-xl object-cover"
              />
            </motion.div>
          )}

          {images[1] && (
            <motion.div
              className="absolute right-0 top-1/3 z-30 h-40 w-40 rounded-2xl bg-muted p-2 shadow-lg sm:h-56 sm:w-56"
              style={{ transformOrigin: "left center" }}
              variants={reduceMotion ? undefined : imageVariants(0.35)}
              whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={images[1].src}
                alt={images[1].alt}
                width={448}
                height={448}
                quality={90}
                sizes="(max-width: 640px) 160px, 224px"
                className="h-full w-full rounded-xl object-cover"
              />
            </motion.div>
          )}

          {images[2] && (
            <motion.div
              className="absolute bottom-0 left-0 z-10 h-32 w-32 rounded-2xl bg-muted p-2 shadow-lg sm:h-48 sm:w-48"
              style={{ transformOrigin: "top right" }}
              variants={reduceMotion ? undefined : imageVariants(0.5)}
              whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={images[2].src}
                alt={images[2].alt}
                width={384}
                height={384}
                quality={90}
                sizes="(max-width: 640px) 128px, 192px"
                className="h-full w-full rounded-xl object-cover"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
