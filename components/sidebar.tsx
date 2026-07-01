"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/icon";
import { signOutAction } from "@/app/(app)/actions";
import { cn } from "@/lib/utils";
import { OrgSwitcher, type OrgOption } from "@/components/org-switcher";
import { SegmentSwitcher, type SegmentOption } from "@/components/segment-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import type { NavItem } from "@/lib/nav";

export interface SidebarProps {
  orgName: string;
  segmentLabel: string;
  segmentIcon: string;
  userName: string;
  navItems: NavItem[];
  subscriptionActive?: boolean;
  isPlatformAdmin?: boolean;
  organizations?: OrgOption[];
  activeOrgId?: string;
  segments?: SegmentOption[];
  activeSegmentId?: string;
  onNavigate?: () => void;
  className?: string;
}

export function SidebarContent({
  orgName,
  segmentLabel,
  segmentIcon,
  userName,
  navItems,
  subscriptionActive = true,
  isPlatformAdmin = false,
  organizations = [],
  activeOrgId = "",
  segments = [],
  activeSegmentId = "",
  onNavigate,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const baseItems: NavItem[] = isPlatformAdmin
    ? [{ href: "/admin", label: "Centro de comando", icon: "LayoutDashboard" }]
    : subscriptionActive
      ? [{ href: "/dashboard", label: "Painel", icon: "LayoutDashboard" }]
      : [];
  const bottomItems: NavItem[] = [
    { href: "/assinatura", label: "Assinatura", icon: "CreditCard" },
    { href: "/configuracoes", label: "Configurações", icon: "Settings" },
  ];

  const renderItem = (item: NavItem, index: number) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    const content = (
      <>
        <Icon
          name={item.icon}
          className={cn("h-4 w-4 shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")}
        />
        <span className="truncate">{item.label}</span>
        {item.comingSoon && (
          <span
            className={cn(
              "ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
              active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
            )}
          >
            em breve
          </span>
        )}
      </>
    );

    const linkClass = cn(
      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
      active
        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    );

    if (reduceMotion) {
      return (
        <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass}>
          {content}
        </Link>
      );
    }

    return (
      <motion.div
        key={item.href}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02, duration: 0.25 }}
      >
        <Link href={item.href} onClick={onNavigate} className={linkClass}>
          {content}
        </Link>
      </motion.div>
    );
  };

  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <div className={cn("flex h-full flex-col bg-card", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-sm">
            <Layers className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            Gestor<span className="text-primary">Pro</span>
          </span>
        </div>
        <ThemeToggle compact className="shrink-0" />
      </div>

      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Icon name={segmentIcon} className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{orgName}</p>
          <p className="truncate text-xs text-muted-foreground">{segmentLabel}</p>
        </div>
      </div>

      {isPlatformAdmin && segments.length > 0 && (
        <div className="border-b border-border py-3">
          <SegmentSwitcher segments={segments} activeSegmentId={activeSegmentId} />
        </div>
      )}

      {isPlatformAdmin && organizations.length > 0 && (
        <div className="border-b border-border py-3">
          <OrgSwitcher organizations={organizations} activeOrgId={activeOrgId} compact />
        </div>
      )}

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {baseItems.map((item, i) => renderItem(item, i))}
          {navItems.length > 0 && (
            <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isPlatformAdmin ? "Módulos do segmento" : "Módulos"}
            </p>
          )}
          {navItems.map((item, i) => renderItem(item, i + baseItems.length))}
          <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Conta
          </p>
          {bottomItems.map((item, i) => renderItem(item, i + baseItems.length + navItems.length))}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 pb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <p className="truncate text-sm font-medium text-foreground">{userName}</p>
        </div>
        <Separator className="mb-2" />
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon name="LogOut" className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-border lg:flex">
      <SidebarContent {...props} className="w-full" />
    </aside>
  );
}
