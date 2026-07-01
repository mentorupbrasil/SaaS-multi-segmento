"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function MegaMenuGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid w-[min(960px,calc(100vw-2rem))] grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_220px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MegaMenuColumn({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5 md:py-6", className)}>{children}</div>;
}

export function MegaMenuItem({
  href,
  icon,
  title,
  description,
  onNavigate,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group -mx-2 flex gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/80 bg-muted/30 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {title}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{description}</span>
      </span>
    </Link>
  );
}

export function MegaMenuSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{children}</p>
  );
}

export function MegaMenuCompactItem({
  href,
  icon,
  title,
  description,
  onNavigate,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group -mx-2 flex gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-accent/50"
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/20 text-muted-foreground transition-colors group-hover:text-primary">
        <Icon name={icon} className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground group-hover:text-primary">{title}</span>
        <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{description}</span>
      </span>
    </Link>
  );
}

export function MegaMenuSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 border-t border-border bg-muted/15 p-5 md:border-l md:border-t-0 md:py-6">
      {children}
    </div>
  );
}

export function MegaMenuStory({
  href,
  title,
  subtitle,
  onNavigate,
}: {
  href: string;
  title: string;
  subtitle: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      <Link
        href={href}
        onClick={onNavigate}
        className="mb-3 inline-flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Casos de sucesso
        <ChevronRight className="h-3 w-3" />
      </Link>
      <Link
        href={href}
        onClick={onNavigate}
        className="block rounded-lg border border-border/80 bg-card p-3 transition-colors hover:border-primary/30 hover:bg-accent/30"
      >
        <p className="text-xs font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{subtitle}</p>
      </Link>
    </div>
  );
}

export function MegaMenuLinks({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: { href: string; label: string }[];
  onNavigate?: () => void;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
