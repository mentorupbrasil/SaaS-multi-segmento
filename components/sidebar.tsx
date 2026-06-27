"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    { href: "/configuracoes", label: "Configuracoes", icon: "Settings" },
  ];

  const renderItem = (item: NavItem) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-brand-600 text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        )}
      >
        <Icon name={item.icon} className="h-4 w-4 shrink-0" />
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
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
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
          Modulos
        </div>
        {navItems.map(renderItem)}
        <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Conta
        </div>
        {bottomItems.map(renderItem)}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <p className="px-3 pb-2 text-xs text-slate-500">{userName}</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Icon name="LogOut" className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
