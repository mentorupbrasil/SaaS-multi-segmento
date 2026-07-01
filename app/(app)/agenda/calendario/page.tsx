import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { CalendarDragGrid } from "@/components/calendar-drag-grid";
import { formatDateTime } from "@/lib/utils";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week: weekParam } = await searchParams;
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);

  const weekOffset = Number(weekParam) || 0;
  const today = new Date();
  const weekStart = addDays(startOfWeek(today), weekOffset * 7);
  const weekEnd = addDays(weekStart, 7);

  const daysRaw = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId: org.id,
      startAt: { gte: weekStart, lt: weekEnd },
      status: { notIn: ["CANCELED"] },
    },
    include: {
      customer: { select: { name: true } },
      service: { select: { name: true } },
    },
    orderBy: { startAt: "asc" },
  });

  const prevWeek = weekOffset - 1;
  const nextWeek = weekOffset + 1;

  const days = daysRaw.map((day) => {
    const dayAppointments = appointments.filter((a) => sameDay(a.startAt, day));
    return {
      dateIso: toDateIso(day),
      label: WEEKDAY_LABELS[day.getDay()],
      dayNumber: `${day.getDate()}/${String(day.getMonth() + 1).padStart(2, "0")}`,
      isToday: sameDay(day, today),
      appointments: dayAppointments.map((a) => ({
        id: a.id,
        label: `${formatDateTime(a.startAt).split(",")[1]?.trim() ?? ""} — ${a.customer.name}`,
        sublabel: a.service?.name ?? undefined,
      })),
    };
  });

  return (
    <div>
      <PageHeader
        title="Calendário semanal"
        description={`Arraste agendamentos entre dias — ${term(terms, "appointment_plural").toLowerCase()}.`}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/agenda" className="text-sm text-primary hover:underline">
          ← Voltar à agenda
        </Link>
        <div className="flex gap-2">
          <Link href={`/agenda/calendario?week=${prevWeek}`} className="btn-secondary text-sm">
            Semana anterior
          </Link>
          <Link href="/agenda/calendario" className="btn-secondary text-sm">
            Semana atual
          </Link>
          <Link href={`/agenda/calendario?week=${nextWeek}`} className="btn-secondary text-sm">
            Próxima semana
          </Link>
        </div>
      </div>

      <CalendarDragGrid days={days} />
    </div>
  );
}
