import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { formatDateTime } from "@/lib/utils";
import {
  getOrganizationByPortalSlug,
  listCustomerUpcomingAppointments,
} from "@/lib/public-booking";

export default async function PortalAgendaPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orgSlug } = await params;
  const { email } = await searchParams;
  const org = await getOrganizationByPortalSlug(orgSlug);
  if (!org) notFound();

  const appointments =
    email && email.includes("@")
      ? await listCustomerUpcomingAppointments(org.id, email)
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href={`/portal/${org.slug}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <Icon name="ArrowLeft" className="h-4 w-4" />
          Voltar ao portal
        </Link>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-8 py-6">
            <h1 className="text-xl font-bold text-slate-900">Meus agendamentos</h1>
            <p className="mt-1 text-sm text-slate-500">{org.name}</p>
          </div>

          <div className="p-8">
            <form method="get" className="mb-6 space-y-3">
              <div>
                <label className="label" htmlFor="email">
                  E-mail cadastrado
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="seu@email.com"
                  defaultValue={email ?? ""}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5">
                Buscar agendamentos
              </button>
            </form>

            {email && appointments.length === 0 && (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                Nenhum agendamento futuro encontrado para este e-mail.
              </p>
            )}

            {appointments.length > 0 && (
              <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                {appointments.map((appt) => (
                  <li key={appt.id} className="flex items-start gap-3 px-4 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name="Calendar" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">
                        {appt.service?.name ?? "Atendimento"}
                      </p>
                      <p className="text-sm text-slate-600">{formatDateTime(appt.startAt)}</p>
                      <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {appt.status === "CONFIRMED" ? "Confirmado" : "Agendado"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
