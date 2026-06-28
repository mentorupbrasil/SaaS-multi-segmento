"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { Icon } from "@/components/icon";
import { signOutAction } from "@/app/(app)/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: "LayoutDashboard", exact: true },
  { href: "/admin/organizacoes", label: "Organizações", icon: "Building2" },
  { href: "/admin/usuarios", label: "Usuários", icon: "Users" },
  { href: "/admin/faturamento", label: "Faturamento", icon: "Wallet" },
  { href: "/admin/chamados", label: "Chamados", icon: "LifeBuoy" },
];

interface AdminSidebarProps {
  userName: string;
}

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">GestorPro</p>
            <p className="text-xs text-slate-500">Admin da plataforma</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
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
              <Icon name={item.icon} className={cn("h-4 w-4", active ? "text-white" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-100 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <Icon name="ArrowRight" className="h-4 w-4 rotate-180 text-slate-400" />
          Painel do tenant
        </Link>
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
