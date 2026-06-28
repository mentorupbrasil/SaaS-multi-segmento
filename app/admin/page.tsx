import Link from "next/link";
import { Icon } from "@/components/icon";
import { getPlatformStats } from "@/lib/admin-queries";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getPlatformStats();

  const cards = [
    { label: "Organizações", value: stats.orgCount, icon: "Building2", href: "/admin/organizacoes" },
    { label: "Usuários", value: stats.userCount, icon: "Users", href: "/admin/usuarios" },
    { label: "Clientes (tenants)", value: stats.customerCount, icon: "UsersRound", href: "/admin/organizacoes" },
    { label: "Assinaturas ativas", value: stats.activeSubscriptions, icon: "BadgeCheck", href: "/admin/faturamento" },
    { label: "Inadimplentes", value: stats.pastDueSubscriptions, icon: "Clock", href: "/admin/faturamento" },
    {
      label: "Receita paga (mês, todos tenants)",
      value: formatCurrency(stats.monthIncome),
      icon: "Wallet",
      href: "/admin/faturamento",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Plataforma</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Painel administrativo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Visão central de organizações, usuários, faturamento e suporte.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{c.label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Icon name={c.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Verificação por tenant</h2>
          <p className="mt-2 text-sm text-slate-500">
            Abra <Link href="/admin/organizacoes" className="font-medium text-brand-700 hover:underline">Organizações</Link>{" "}
            para inspecionar cada conta: segmento, plano, membros e volume de dados.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900">Chamados de suporte</h2>
          <p className="mt-2 text-sm text-slate-500">
            Módulo de tickets em construção. Enquanto isso, use a lista de organizações para validar cada sistema.
          </p>
          <Link href="/admin/chamados" className="mt-3 inline-flex text-sm font-semibold text-brand-700 hover:underline">
            Ver chamados →
          </Link>
        </div>
      </div>
    </div>
  );
}
