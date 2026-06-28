"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { Icon } from "@/components/icon";
import { signOutAction } from "@/app/(app)/actions";
import { OrgSwitcher, type OrgOption } from "@/components/org-switcher";
import { SegmentSwitcher, type SegmentOption } from "@/components/segment-switcher";
import { cn } from "@/lib/utils";

const PLATFORM_NAV = [
  { href: "/admin", label: "Visão geral", icon: "LayoutDashboard", exact: true },
  { href: "/admin/organizacoes", label: "Organizações", icon: "Building2" },
  { href: "/admin/usuarios", label: "Usuários", icon: "Users" },
  { href: "/admin/faturamento", label: "Faturamento", icon: "Wallet" },
  { href: "/admin/segmentos", label: "Segmentos", icon: "Layers" },
  { href: "/admin/chamados", label: "Chamados", icon: "LifeBuoy" },
];

interface AdminSidebarProps {
  userName: string;
  organizations: OrgOption[];
  activeOrgId: string;
  segments: SegmentOption[];
  activeSegmentId: string;
  operationalNav: { href: string; label: string; icon: string; comingSoon?: boolean }[];
}

export function AdminSidebar({
  userName,
  organizations,
  activeOrgId,
  segments,
  activeSegmentId,
  operationalNav,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const renderItem = (item: {
    href: string;
    label: string;
    icon: string;
    exact?: boolean;
    comingSoon?: boolean;
  }) => {
    const active = item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          active
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )}
      >
        <Icon name={item.icon} className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-slate-400")} />
        <span className="truncate">{item.label}</span>
        {item.comingSoon && (
          <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
            em breve
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">GestorPro</p>
            <p className="text-xs text-slate-500">Super admin</p>
          </div>
        </Link>
      </div>

      <div className="border-b border-slate-100 py-3">
        <SegmentSwitcher segments={segments} activeSegmentId={activeSegmentId} />
        <OrgSwitcher organizations={organizations} activeOrgId={activeOrgId} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Plataforma
        </p>
        {PLATFORM_NAV.map((item) => renderItem(item))}

        <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Operação (todos os módulos)
        </p>
        {operationalNav.map((item) => renderItem(item))}
      </nav>

      <div className="space-y-1 border-t border-slate-100 p-3">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Icon name="LogOut" className="h-4 w-4 text-slate-400" />
            Sair
          </button>
        </form>
        <p className="truncate px-3 pt-1 text-xs text-slate-400">{userName}</p>
      </div>
    </aside>
  );
}
