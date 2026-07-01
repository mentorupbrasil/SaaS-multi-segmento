"use client";

import { motion, type Transition } from "framer-motion";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

export const menuTransition: Transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export function MenuItem({
  setActive,
  active,
  item,
  children,
  dropdownAlign = "center",
  className,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  dropdownAlign?: "center" | "start";
  className?: string;
}) {
  const isActive = active === item;

  return (
    <div onMouseEnter={() => setActive(item)} className={cn("relative", className)}>
      <motion.span
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer text-sm font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {item}
      </motion.span>

      {active !== null && isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={menuTransition}
          className={cn(
            "absolute top-[calc(100%+1rem)] z-50 pt-3",
            dropdownAlign === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
          )}
        >
          <motion.div
            layoutId="navbar-active-panel"
            transition={menuTransition}
            className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-xl shadow-black/10 backdrop-blur-xl"
          >
            <motion.div layout transition={menuTransition} className="h-full w-max max-w-[calc(100vw-2rem)] p-1">
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export function Menu({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={cn(
        "relative flex items-center justify-center gap-1 rounded-full border border-border/80 bg-card/80 px-2 py-1.5 shadow-sm backdrop-blur-md",
        className,
      )}
      aria-label="Menu principal"
    >
      {children}
    </nav>
  );
}

export function ProductItem({
  title,
  description,
  href,
  src,
  onNavigate,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
  onNavigate?: () => void;
}) {
  return (
    <Link href={href} onClick={onNavigate} className="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-accent/60">
      <Image
        src={src}
        width={140}
        height={70}
        alt=""
        className="h-[70px] w-[140px] shrink-0 rounded-lg object-cover shadow-md ring-1 ring-border transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <div className="min-w-0 py-0.5">
        <h4 className="mb-1 text-base font-semibold leading-tight text-foreground group-hover:text-primary">{title}</h4>
        <p className="max-w-[10rem] text-sm leading-snug text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export function HoveredLink({
  children,
  className,
  onClick,
  ...rest
}: LinkProps & { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <Link
      {...rest}
      onClick={onClick}
      className={cn(
        "block rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
