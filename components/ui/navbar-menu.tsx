"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function MenuTrigger({
  item,
  active,
  setActive,
}: {
  item: string;
  active: string | null;
  setActive: (item: string) => void;
}) {
  const isOpen = active === item;

  return (
    <button
      type="button"
      onMouseEnter={() => setActive(item)}
      aria-expanded={isOpen}
      className={cn(
        "flex items-center gap-0.5 text-sm font-normal transition-colors",
        isOpen ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {item}
      <ChevronDown
        className={cn("h-3.5 w-3.5 opacity-70 transition-transform duration-200", isOpen && "rotate-180")}
        aria-hidden
      />
    </button>
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
        "text-sm font-normal text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
