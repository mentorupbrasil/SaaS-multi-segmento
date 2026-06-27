import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { AppointmentForm } from "@/modules/scheduling/appointment-form";
import { formatDateTime } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Agendado",
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluido",
  CANCELED: "Cancelado",
  NO_SHOW: "Faltou",
};

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-slate-100 text-slate-500",
};

export default async function AgendaPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);

  const [appointments, customers, services] = await Promise.all([
    prisma.appointment.findMany({
      where: { organizationId: org.id },
      orderBy: { startAt: "asc" },
      include: { customer: true, service: true },
    }),
    prisma.customer.findMany({ where: { organizationId: org.id }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { organizationId: org.id, active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title={term(terms, "appointment_plural")}
        description="Visualize e crie agendamentos."
        action={
          <AppointmentForm
            appointmentLabel={term(terms, "appointment")}
            customerLabel={term(terms, "customer")}
            serviceLabel={term(terms, "service")}
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            services={services.map((s) => ({ id: s.id, label: s.name }))}
          />
        }
      />

      {appointments.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          Nenhum {term(terms, "appointment").toLowerCase()} cadastrado ainda.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Data/Hora</th>
                <th className="px-4 py-3">{term(terms, "customer")}</th>
                <th className="px-4 py-3">{term(terms, "service")}</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(a.startAt)}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{a.customer.name}</td>
                  <td className="px-4 py-3 text-slate-600">{a.service?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[a.status]}`}
                    >
                      {STATUS_LABELS[a.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
