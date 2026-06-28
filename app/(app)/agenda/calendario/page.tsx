import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
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

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const appointments = await prisma.appointment.findMany({
    where: {
      organizationId: org.id,
      startAt: { gte: weekStart, lt: weekEnd },
    },
    include: {
      customer: { select: { name: true } },
      service: { select: { name: true } },
      staff: { include: { user: { select: { name: true } } } },
    },
    orderBy: { startAt: "asc" },
  });

  const prevWeek = weekOffset - 1;
  const nextWeek = weekOffset + 1;

  return (
    <div>
      <PageHeader
        title="Calendário semanal"
        description={`Visão da semana — ${term(terms, "appointment_plural").toLowerCase()}.`}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/agenda" className="text-sm text-brand-600 hover:underline">
          ← Voltar à agenda
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/agenda/calendario?week=${prevWeek}`}
            className="btn-secondary text-sm"
          >
            Semana anterior
          </Link>
          <Link href="/agenda/calendario" className="btn-secondary text-sm">
            Semana atual
          </Link>
          <Link
            href={`/agenda/calendario?week=${nextWeek}`}
            className="btn-secondary text-sm"
          >
            Próxima semana
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
        {days.map((day) => {
          const dayAppointments = appointments.filter((a) => sameDay(a.startAt, day));
          const isToday = sameDay(day, today);

          return (
            <div
              key={day.toISOString()}
              className={`card min-h-[140px] p-3 ${isToday ? "ring-2 ring-brand-500" : ""}`}
            >
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                {WEEKDAY_LABELS[day.getDay()]}
              </p>
              <p className={`mb-3 text-lg font-bold ${isToday ? "text-brand-600" : "text-slate-900"}`}>
                {day.getDate()}/{String(day.getMonth() + 1).padStart(2, "0")}
              </p>

              {dayAppointments.length === 0 ? (
                <p className="text-xs text-slate-400">Sem agendamentos</p>
              ) : (
                <ul className="space-y-2">
                  {dayAppointments.map((a) => (
                    <li key={a.id}>
                      <Link
                        href="/agenda"
                        className="block rounded-lg bg-slate-50 px-2 py-1.5 text-xs hover:bg-brand-50"
                      >
                        <p className="font-medium text-slate-900">
                          {formatDateTime(a.startAt).split(",")[1]?.trim() ?? formatDateTime(a.startAt)}
                        </p>
                        <p className="truncate text-slate-600">{a.customer.name}</p>
                        <p className="truncate text-slate-500">{a.service?.name ?? "—"}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
