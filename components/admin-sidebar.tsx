"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { Icon } from "@/components/icon";
import { signOutAction } from "@/app/(app)/actions";
import { OrgSwitcher, type OrgOption } from "@/components/org-switcher";
import { SegmentSwitcher, type SegmentOption } from "@/components/segment-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buildAllModulesNav, resolveActiveNavHref } from "@/lib/nav";
import { cn } from "@/lib/utils";

const PLATFORM_NAV = [
  { href: "/admin", label: "Visão geral", icon: "LayoutDashboard", exact: true },
  { href: "/admin/organizacoes", label: "Organizações", icon: "Building2" },
  { href: "/admin/usuarios", label: "Usuários", icon: "Users" },
  { href: "/admin/faturamento", label: "Faturamento", icon: "Wallet" },
  { href: "/admin/segmentos", label: "Segmentos", icon: "Layers" },
  { href: "/admin/chamados", label: "Chamados", icon: "LifeBuoy" },
  { href: "/admin/audit", label: "Auditoria", icon: "ScrollText" },
];

interface AdminSidebarProps {
  userName: string;
  organizations: OrgOption[];
  activeOrgId: string;
  segments: SegmentOption[];
  activeSegmentId: string;
}

export function AdminSidebar({
  userName,
  organizations,
  activeOrgId,
  segments,
  activeSegmentId,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const operationalNav = buildAllModulesNav(activeSegmentId);
  const initials = userName.slice(0, 2).toUpperCase();

  const platformHrefs = PLATFORM_NAV.map((item) => item.href);
  const activePlatformHref = resolveActiveNavHref(pathname, platformHrefs);
  const operationalHrefs = operationalNav.map((item) => item.href);
  const activeOperationalHref = resolveActiveNavHref(pathname, operationalHrefs);

  const renderItem = (item: {
    href: string;
    label: string;
    icon: string;
    exact?: boolean;
    comingSoon?: boolean;
  }, activeHref: string | null) => {
    const active = activeHref === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          active
            ? "bg-foreground text-background shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <Icon name={item.icon} className={cn("h-4 w-4 shrink-0", active ? "text-background" : "text-muted-foreground")} />
        <span className="truncate">{item.label}</span>
        {item.comingSoon && (
          <span className="ml-auto rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
            em breve
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white dark:from-slate-600 dark:to-slate-950">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">GestorPro</p>
            <p className="text-xs text-muted-foreground">Super admin</p>
          </div>
        </Link>
        <ThemeToggle compact className="shrink-0" />
      </div>

      <div className="border-b border-border py-3">
        <SegmentSwitcher segments={segments} activeSegmentId={activeSegmentId} />
        <OrgSwitcher organizations={organizations} activeOrgId={activeOrgId} />
      </div>

      <ScrollArea className="flex-1 p-3">
        <nav className="space-y-1">
          <p className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Plataforma
          </p>
          {PLATFORM_NAV.map((item) => renderItem(item, activePlatformHref))}
          <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Operação (todos os módulos)
          </p>
          {operationalNav.map((item) => renderItem(item, activeOperationalHref))}
        </nav>
      </ScrollArea>

      <div className="space-y-1 border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 pb-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <p className="truncate text-sm font-medium text-foreground">{userName}</p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon name="LogOut" className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
