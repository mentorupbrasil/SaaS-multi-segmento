"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { Icon } from "@/components/icon";
import { signOutAction } from "@/app/(app)/actions";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav";

interface SidebarProps {
  orgName: string;
  segmentLabel: string;
  segmentIcon: string;
  userName: string;
  navItems: NavItem[];
}

export function Sidebar({
  orgName,
  segmentLabel,
  segmentIcon,
  userName,
  navItems,
}: SidebarProps) {
  const pathname = usePathname();

  const baseItems: NavItem[] = [
    { href: "/dashboard", label: "Painel", icon: "LayoutDashboard" },
  ];
  const bottomItems: NavItem[] = [
    { href: "/assinatura", label: "Assinatura", icon: "CreditCard" },
    { href: "/configuracoes", label: "Configurações", icon: "Settings" },
  ];

  const renderItem = (item: NavItem) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          active
            ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-sm shadow-brand-600/30"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )}
      >
        <Icon
          name={item.icon}
          className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")}
        />
        <span className="truncate">{item.label}</span>
        {item.comingSoon && (
          <span
            className={cn(
              "ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold",
              active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700",
            )}
          >
            em breve
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white">
          <Layers className="h-5 w-5" />
        </span>
        <span className="text-base font-bold tracking-tight text-slate-900">
          Gestor<span className="text-brand-600">Pro</span>
        </span>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 ring-1 ring-brand-100">
          <Icon name={segmentIcon} className="h-5 w-5 text-brand-600" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{orgName}</p>
          <p className="truncate text-xs text-slate-500">{segmentLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {baseItems.map(renderItem)}
        <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Módulos
        </div>
        {navItems.map(renderItem)}
        <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Conta
        </div>
        {bottomItems.map(renderItem)}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 px-2 pb-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            {userName.slice(0, 2).toUpperCase()}
          </span>
          <p className="truncate text-sm font-medium text-slate-700">{userName}</p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Icon name="LogOut" className="h-4 w-4 text-slate-400" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
