"use client";

import * as React from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

const processCardVariants = cva("flex shrink-0 rounded-2xl border backdrop-blur-lg", {
  variants: {
    variant: {
      indigo:
        "border-border bg-gradient-to-br from-brand-950/90 via-slate-900/80 to-brand-800/90 text-white shadow-xl shadow-brand-950/20 dark:from-slate-950/90 dark:to-brand-900/80",
      light: "border-border bg-card text-card-foreground shadow-lg shadow-black/5",
    },
    size: {
      sm: "min-w-[85vw] max-w-[85vw] sm:min-w-[40%] sm:max-w-[40%]",
      md: "min-w-[88vw] max-w-[88vw] sm:min-w-[55%] sm:max-w-[55%]",
      lg: "min-w-[92vw] max-w-[92vw] sm:min-w-[70%] sm:max-w-[70%]",
      xl: "min-w-full max-w-full",
    },
  },
  defaultVariants: {
    variant: "light",
    size: "md",
  },
});

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

interface ProcessCardProps extends HTMLMotionProps<"div">, VariantProps<typeof processCardVariants> {
  itemsLength: number;
  index: number;
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error("useContainerScrollContext must be used within a ContainerScroll component");
  }
  return context;
}

export function ContainerScroll({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div ref={scrollRef} className={cn("relative min-h-[140vh]", className)} {...props}>
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
}

export const ContainerSticky = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("sticky left-0 top-0 w-full overflow-hidden", className)} {...props} />
  ),
);
ContainerSticky.displayName = "ContainerSticky";

export const ProcessCardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pb-0", className)} {...props} />,
);
ProcessCardTitle.displayName = "ProcessCardTitle";

export const ProcessCardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4 p-6 pt-4", className)} {...props} />
  ),
);
ProcessCardBody.displayName = "ProcessCardBody";

export function ProcessCard({
  className,
  style,
  variant,
  size,
  itemsLength,
  index,
  ...props
}: ProcessCardProps) {
  const { scrollYProgress } = useContainerScrollContext();
  const [ref, { width }] = useMeasure();
  const [viewportWidth, setViewportWidth] = React.useState(0);

  React.useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const start = index / itemsLength;
  const end = start + 1 / itemsLength;

  const x = useTransform(
    scrollYProgress,
    [start, end],
    [viewportWidth, -((width ?? 0) * index) + 64 * index],
  );

  return (
    <motion.div
      ref={ref}
      style={{
        x: index > 0 && viewportWidth > 0 ? x : 0,
        ...style,
      }}
      className={cn(processCardVariants({ variant, size }), className)}
      {...props}
    />
  );
}
