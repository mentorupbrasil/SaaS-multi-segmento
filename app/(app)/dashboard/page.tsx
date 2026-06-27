import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getSegment } from "@/segments";
import { resolveTerms, term } from "@/lib/terms";
import { buildNav } from "@/lib/nav";
import { Icon } from "@/components/icon";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const segment = getSegment(org.segmentId);
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const nav = buildNav(org);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [customerCount, serviceCount, todayAppointments, monthIncome] = await Promise.all([
    prisma.customer.count({ where: { organizationId: org.id } }),
    prisma.service.count({ where: { organizationId: org.id, active: true } }),
    prisma.appointment.count({
      where: { organizationId: org.id, startAt: { gte: startOfDay, lte: endOfDay } },
    }),
    prisma.financialEntry.aggregate({
      where: {
        organizationId: org.id,
        type: "INCOME",
        status: "PAID",
        paidAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
  ]);

  const stats = [
    { label: term(terms, "customer_plural"), value: customerCount, icon: "Users", href: "/clientes" },
    { label: term(terms, "appointment_plural") + " hoje", value: todayAppointments, icon: "Calendar", href: "/agenda" },
    { label: term(terms, "service_plural"), value: serviceCount, icon: "Tag", href: "/servicos" },
    { label: "Receita do mes", value: formatCurrency(monthIncome._sum.amount ?? 0), icon: "Wallet", href: "/financeiro" },
  ];

  const trialDays = org.trialEndsAt
    ? Math.max(0, Math.ceil((org.trialEndsAt.getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Bem-vindo a {org.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Painel do seu sistema de {segment?.label.toLowerCase() ?? "negocio"}.
        </p>
      </div>

      {org.subscriptionStatus === "TRIALING" && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            Voce esta no periodo de teste. {trialDays} dia(s) restante(s).
          </p>
          <Link href="/assinatura" className="text-sm font-semibold text-amber-900 underline">
            Assinar agora
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{s.label}</span>
              <Icon name={s.icon} className="h-5 w-5 text-brand-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Modulos do seu segmento
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card flex items-center gap-3 p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <Icon name={item.icon} className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                {item.comingSoon && <p className="text-xs text-amber-600">Em breve</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
