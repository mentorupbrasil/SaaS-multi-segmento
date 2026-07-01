import Link from "next/link";
import { Suspense } from "react";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { AppointmentForm } from "@/modules/scheduling/appointment-form";
import { AppointmentStatusButtons } from "@/components/appointment-status-buttons";
import { RescheduleForm } from "@/modules/scheduling/reschedule-form";
import { BlockForm } from "@/modules/scheduling/block-form";
import { StaffFilter } from "@/modules/scheduling/staff-filter";
import { DeleteBlockButton } from "@/modules/scheduling/delete-block-button";
import { DeleteButton } from "@/components/delete-button";
import { deleteAppointment } from "@/modules/scheduling/actions";
import { formatDateTime } from "@/lib/utils";
import { APPOINTMENT_STATUS_LABELS, labelFor } from "@/lib/status-labels";

const PAGE_SIZE = 20;

const STATUS_LABELS = APPOINTMENT_STATUS_LABELS;

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-muted text-muted-foreground",
};

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; staff?: string; status?: string }>;
}) {
  const raw = await searchParams;
  const params = parseListParams(raw);
  const staffFilter = raw.staff?.trim() || undefined;
  const statusFilter = raw.status?.trim() || undefined;
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const professionalLabel = term(terms, "professional");

  const where = {
    organizationId: org.id,
    ...(staffFilter ? { staffId: staffFilter } : {}),
    ...(statusFilter
      ? { status: statusFilter as "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED" | "NO_SHOW" }
      : {}),
    ...(params.q
      ? {
          OR: [
            { customer: { name: { contains: params.q, mode: "insensitive" as const } } },
            { service: { name: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [total, appointments, customers, servicesRaw, staff, blockedSlots] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      orderBy: { startAt: "asc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        customer: true,
        service: true,
        staff: { include: { user: true } },
      },
    }),
    prisma.customer.findMany({ where: { organizationId: org.id }, orderBy: { name: "asc" } }),
    prisma.service.findMany({
      where: { organizationId: org.id, active: true },
      include: { staffLinks: { select: { membershipId: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.membership.findMany({
      where: { organizationId: org.id },
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.blockedSlot.findMany({
      where: {
        organizationId: org.id,
        ...(staffFilter ? { staffId: staffFilter } : {}),
      },
      include: { staff: { include: { user: true } } },
      orderBy: { startAt: "asc" },
      take: 20,
    }),
  ]);

  const staffOptions = staff.map((m) => ({ id: m.id, label: m.user.name }));
  const services = servicesRaw.map((s) => ({
    id: s.id,
    label: s.name,
    staffIds: s.staffLinks.map((l) => l.membershipId),
  }));

  const paginationParams = {
    q: params.q || undefined,
    staff: staffFilter,
    status: statusFilter,
  };

  return (
    <div>
      <PageHeader
        title={term(terms, "appointment_plural")}
        description="Visualize e crie agendamentos."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/agenda/calendario" className="btn-secondary">
              Calendário
            </Link>
            <BlockForm staff={staffOptions} professionalLabel={professionalLabel} />
            <AppointmentForm
              appointmentLabel={term(terms, "appointment")}
              customerLabel={term(terms, "customer")}
              serviceLabel={term(terms, "service")}
              professionalLabel={professionalLabel}
              customers={customers.map((c) => ({ id: c.id, label: c.name }))}
              services={services}
              staff={staffOptions}
            />
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar
          searchValue={params.q}
          searchPlaceholder="Buscar cliente ou serviço..."
          filters={[
            {
              name: "status",
              label: "Status",
              value: statusFilter,
              options: Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
            },
          ]}
        />
        <ExportCsvLink plan={org.plan} module="agenda" searchParams={paginationParams} />
      </div>

      <Suspense fallback={null}>
        <StaffFilter staff={staffOptions} label={professionalLabel} />
      </Suspense>

      {appointments.length === 0 ? (
        <EmptyState
          icon="Calendar"
          description={
            params.q || staffFilter || statusFilter
              ? "Nenhum resultado para os filtros."
              : `Nenhum ${term(terms, "appointment").toLowerCase()} cadastrado ainda.`
          }
        />
      ) : (
        <>
          <div className="card mb-8 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Data/Hora</th>
                  <th className="px-4 py-3">{term(terms, "customer")}</th>
                  <th className="px-4 py-3">{term(terms, "service")}</th>
                  <th className="px-4 py-3">{professionalLabel}</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-muted">
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(a.startAt)}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{a.customer.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.service?.name ?? "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.staff?.user.name ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[a.status]}`}
                      >
                        {labelFor(STATUS_LABELS, a.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <AppointmentStatusButtons id={a.id} status={a.status} />
                        {a.status !== "COMPLETED" && a.status !== "CANCELED" && (
                          <RescheduleForm id={a.id} startAt={a.startAt} notes={a.notes} />
                        )}
                        <DeleteButton action={deleteAppointment.bind(null, a.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            total={total}
            page={params.page}
            pageSize={PAGE_SIZE}
            basePath="/agenda"
            searchParams={paginationParams}
          />
        </>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Horários bloqueados</h2>
        {blockedSlots.length === 0 ? (
          <div className="card p-6 text-center text-sm text-muted-foreground">Nenhum bloqueio cadastrado.</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Início</th>
                  <th className="px-4 py-3">Fim</th>
                  <th className="px-4 py-3">{professionalLabel}</th>
                  <th className="px-4 py-3">Motivo</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blockedSlots.map((b) => (
                  <tr key={b.id} className="hover:bg-muted">
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(b.startAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(b.endAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.staff?.user.name ?? "Todos"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.reason ?? "—"}</td>
                    <td className="px-4 py-3">
                      <DeleteBlockButton id={b.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
