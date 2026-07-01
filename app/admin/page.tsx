import Link from "next/link";
import { getAuthContext, listOrganizationsForSwitcher } from "@/lib/auth-context";
import { getPlatformStats } from "@/lib/admin-queries";
import { buildAllModulesNav } from "@/lib/nav";
import { getSegment, getSegmentGroups, ALL_SEGMENTS } from "@/segments";
import { Icon } from "@/components/icon";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [stats, ctx, organizations] = await Promise.all([
    getPlatformStats(),
    getAuthContext(),
    listOrganizationsForSwitcher(),
  ]);

  const segment = getSegment(ctx.organization.segmentId);
  const opsNav = buildAllModulesNav(ctx.organization.segmentId);

  const cards = [
    { label: "Organizações", value: stats.orgCount, icon: "Building2", href: "/admin/organizacoes" },
    { label: "Usuários", value: stats.userCount, icon: "Users", href: "/admin/usuarios" },
    { label: "Segmentos", value: ALL_SEGMENTS.length, icon: "Layers", href: "/admin/segmentos" },
    { label: "Assinaturas ativas", value: stats.activeSubscriptions, icon: "BadgeCheck", href: "/admin/faturamento" },
    {
      label: "MRR estimado (GestorPro)",
      value: formatCurrency(stats.estimatedPlatformMrr),
      icon: "TrendingUp",
      href: "/admin/faturamento",
    },
    {
      label: "Receita operacional tenants (mês)",
      value: formatCurrency(stats.tenantOperationalIncome),
      icon: "Wallet",
      href: "/admin/faturamento",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Super admin</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Centro de comando</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organização ativa: <strong>{ctx.organization.name}</strong>
          {segment ? ` · ${segment.label}` : ""} — troque no menu lateral para ver dados de outra conta.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                <Icon name={c.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Todos os módulos do sistema
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {opsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                <Icon name={item.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                {item.comingSoon && <p className="text-xs text-amber-600">Em breve</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Organizações ({organizations.length})
        </h2>
        <div className="card divide-y divide-border">
          {organizations.map((org) => {
            const seg = getSegment(org.segmentId);
            return (
              <Link
                key={org.id}
                href={`/admin/organizacoes/${org.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted"
              >
                <div>
                  <p className="font-medium text-foreground">{org.name}</p>
                  <p className="text-xs text-muted-foreground">{seg?.label ?? org.segmentId}</p>
                </div>
                <Icon name="ArrowRight" className="h-4 w-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
