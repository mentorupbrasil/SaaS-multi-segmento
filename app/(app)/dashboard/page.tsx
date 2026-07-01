import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { isSubscriptionActive } from "@/lib/subscription";
import { prisma } from "@/lib/db";
import { getSegment } from "@/segments";
import { resolveTerms, term } from "@/lib/terms";
import { buildNav } from "@/lib/nav";
import { resolveSegmentModules } from "@/lib/segment-modules";
import { markOverdueEntries } from "@/lib/finance-utils";
import { Icon } from "@/components/icon";
import { formatCurrency } from "@/lib/utils";
import { StatCard, ModuleCard } from "@/components/stat-card";
import { FadeIn } from "@/components/motion/fade-in";
import type { ModuleId } from "@/modules/types";

export default async function DashboardPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;

  if (!ctx.isPlatformAdmin && !isSubscriptionActive(org)) {
    redirect("/assinatura");
  }

  const segmentId = ctx.effectiveSegmentId;
  const segment = getSegment(segmentId);
  const terms = resolveTerms(segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const nav = buildNav(org);
  const modules = new Set(resolveSegmentModules(segmentId));
  const category = segment?.category;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  await markOverdueEntries(org.id);

  const [
    customerCount,
    serviceCount,
    todayAppointments,
    monthIncome,
    openWorkOrders,
    overdueCount,
    openCashShift,
    inventoryItems,
    activeReservations,
    totalRooms,
    classCount,
    enrollmentCount,
    openKitchenOrders,
  ] = await Promise.all([
    prisma.customer.count({ where: { organizationId: org.id } }),
    prisma.service.count({ where: { organizationId: org.id, active: true } }),
    modules.has("scheduling")
      ? prisma.appointment.count({
          where: { organizationId: org.id, startAt: { gte: startOfDay, lte: endOfDay } },
        })
      : Promise.resolve(0),
    prisma.financialEntry.aggregate({
      where: {
        organizationId: org.id,
        type: "INCOME",
        status: "PAID",
        paidAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
    modules.has("work_orders")
      ? prisma.workOrder.count({
          where: {
            organizationId: org.id,
            status: { in: ["OPEN", "IN_PROGRESS"] },
          },
        })
      : Promise.resolve(0),
    modules.has("financial")
      ? prisma.financialEntry.count({
          where: { organizationId: org.id, status: "OVERDUE" },
        })
      : Promise.resolve(0),
    modules.has("financial")
      ? prisma.cashShift.count({
          where: { organizationId: org.id, closedAt: null },
        })
      : Promise.resolve(0),
    modules.has("inventory")
      ? prisma.inventoryItem.findMany({
          where: { organizationId: org.id, minQuantity: { gt: 0 } },
          select: { quantity: true, minQuantity: true },
        })
      : Promise.resolve([]),
    category === "hotelaria" && modules.has("reservations")
      ? prisma.reservation.count({
          where: {
            organizationId: org.id,
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
            checkIn: { lte: endOfDay },
            checkOut: { gt: startOfDay },
          },
        })
      : Promise.resolve(0),
    category === "hotelaria" && modules.has("rooms")
      ? prisma.room.count({ where: { organizationId: org.id } })
      : Promise.resolve(0),
    category === "educacao" && modules.has("education")
      ? prisma.schoolClass.count({ where: { organizationId: org.id, active: true } })
      : Promise.resolve(0),
    category === "educacao" && modules.has("education")
      ? prisma.enrollment.count({
          where: { organizationId: org.id, status: "ACTIVE" },
        })
      : Promise.resolve(0),
    category === "alimentacao" && modules.has("kitchen")
      ? prisma.kitchenOrder.count({
          where: {
            organizationId: org.id,
            status: { in: ["PENDING", "PREPARING"] },
          },
        })
      : Promise.resolve(0),
  ]);

  const lowStock = inventoryItems.filter((i) => i.quantity <= i.minQuantity).length;

  type Stat = { label: string; value: string | number; icon: string; href: string; module: ModuleId };

  const stats: Stat[] = [
    { label: term(terms, "customer_plural"), value: customerCount, icon: "Users", href: "/clientes", module: "clients" },
    {
      label: term(terms, "appointment_plural") + " hoje",
      value: todayAppointments,
      icon: "Calendar",
      href: "/agenda",
      module: "scheduling",
    },
    { label: term(terms, "service_plural"), value: serviceCount, icon: "Tag", href: "/servicos", module: "services" },
    {
      label: "Receita do mês",
      value: formatCurrency(monthIncome._sum.amount ?? 0),
      icon: "Wallet",
      href: "/financeiro",
      module: "financial",
    },
    {
      label: "OS em aberto",
      value: openWorkOrders,
      icon: "ClipboardList",
      href: "/ordens-de-servico",
      module: "work_orders",
    },
    {
      label: "Estoque baixo",
      value: lowStock,
      icon: "Package",
      href: "/estoque",
      module: "inventory",
    },
    {
      label: "Financeiro vencido",
      value: overdueCount,
      icon: "Bell",
      href: "/financeiro",
      module: "financial",
    },
    {
      label: "Caixa aberto",
      value: openCashShift > 0 ? "Sim" : "Não",
      icon: "CreditCard",
      href: "/caixa",
      module: "financial",
    },
    {
      label: "Ocupação hoje",
      value:
        totalRooms > 0
          ? `${Math.round((activeReservations / totalRooms) * 100)}%`
          : activeReservations > 0
            ? `${activeReservations} reservas`
            : "—",
      icon: "Bed",
      href: "/reservas",
      module: "reservations",
    },
    {
      label: "Turmas ativas",
      value: classCount,
      icon: "GraduationCap",
      href: "/turmas",
      module: "education",
    },
    {
      label: "Matrículas ativas",
      value: enrollmentCount,
      icon: "ClipboardList",
      href: "/matriculas",
      module: "education",
    },
    {
      label: "Pedidos na cozinha",
      value: openKitchenOrders,
      icon: "ChefHat",
      href: "/cozinha",
      module: "kitchen",
    },
  ];

  const visibleStats = stats.filter((s) => modules.has(s.module));

  return (
    <div>
      <FadeIn className="mb-8 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-sm">
          <Icon name={segment?.icon ?? "Building2"} className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Bem-vindo à {org.name}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Painel do seu sistema de {segment?.label.toLowerCase() ?? "negócio"}.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleStats.map((s) => (
          <StatCard key={s.label} href={s.href} label={s.label} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Módulos do seu segmento
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {nav.map((item) => (
            <ModuleCard
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              comingSoon={item.comingSoon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
