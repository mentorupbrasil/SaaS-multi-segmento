"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { MotionCard } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

interface StatCardProps {
  href: string;
  label: string;
  value: string | number;
  icon: string;
  className?: string;
}

export function StatCard({ href, label, value, icon, className }: StatCardProps) {
  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
      <MotionCard className={cn("card p-5 transition-shadow hover:shadow-md", className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Icon name={icon} className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      </MotionCard>
    </Link>
  );
}

interface ModuleCardProps {
  href: string;
  label: string;
  icon: string;
  comingSoon?: boolean;
}

export function ModuleCard({ href, label, icon, comingSoon }: ModuleCardProps) {
  return (
    <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
      <MotionCard className="card flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon name={icon} className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {comingSoon && <p className="text-xs text-amber-600 dark:text-amber-400">Em breve</p>}
        </div>
      </MotionCard>
    </Link>
  );
}
