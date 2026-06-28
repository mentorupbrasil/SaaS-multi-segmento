import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getSegment } from "@/segments";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { CustomerEditForm } from "@/modules/clients/customer-edit-form";
import { DeleteButton } from "@/components/delete-button";
import { deleteCustomer } from "@/modules/clients/actions";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

const WO_STATUS: Record<string, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
  CANCELED: "Cancelada",
};

const APPT_STATUS: Record<string, string> = {
  SCHEDULED: "Agendado",
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
  NO_SHOW: "Faltou",
};

const RES_STATUS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CHECKED_IN: "Check-in",
  CHECKED_OUT: "Check-out",
  CANCELED: "Cancelada",
};

const EVENT_STATUS: Record<string, string> = {
  PLANNING: "Planejamento",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluído",
  CANCELED: "Cancelado",
};

const QUOTE_STATUS: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONVERTED: "Convertido",
  EXPIRED: "Expirado",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const segment = getSegment(org.segmentId);
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const customerFields = segment?.customerFields ?? [];

  const customer = await prisma.customer.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      appointments: {
        include: { service: true, staff: { include: { user: true } } },
        orderBy: { startAt: "desc" },
        take: 10,
      },
      workOrders: { orderBy: { createdAt: "desc" }, take: 10 },
      records: { orderBy: { createdAt: "desc" }, take: 10 },
      vehicles: { orderBy: { createdAt: "desc" } },
      pets: { orderBy: { createdAt: "desc" } },
      quotes: { orderBy: { createdAt: "desc" }, take: 10 },
      sales: { orderBy: { createdAt: "desc" }, take: 10 },
      reservations: {
        include: { room: { select: { number: true } } },
        orderBy: { checkIn: "desc" },
        take: 10,
      },
      donations: { orderBy: { receivedAt: "desc" }, take: 10 },
      businessEvents: { orderBy: { createdAt: "desc" }, take: 10 },
      sessionPackages: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!customer) notFound();

  const customFields = (customer.customFields as Record<string, string | number | null>) ?? {};

  return (
    <div>
      <PageHeader title={customer.name} description={term(terms, "customer")} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/clientes" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <CustomerEditForm
          id={customer.id}
          customerLabel={term(terms, "customer")}
          customFields={customerFields}
          defaultValues={{
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            notes: customer.notes,
            customFields,
          }}
        />
        <DeleteButton
          onConfirm={() => deleteCustomer(customer.id)}
          redirectTo="/clientes"
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Telefone</p>
          <p className="font-medium">{customer.phone ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">E-mail</p>
          <p className="font-medium">{customer.email ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Cadastro</p>
          <p className="font-medium">{formatDate(customer.createdAt)}</p>
        </div>
        {customer.notes && (
          <div className="card p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-xs text-slate-500">Observações</p>
            <p className="text-sm">{customer.notes}</p>
          </div>
        )}
      </div>

      {customerFields.length > 0 && Object.keys(customFields).length > 0 && (
        <>
          <h2 className="mb-2 text-lg font-semibold">Campos personalizados</h2>
          <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {customerFields.map((field) => {
              const value = customFields[field.key];
              if (value == null || value === "") return null;
              return (
                <div key={field.key}>
                  <p className="text-xs text-slate-500">{field.label}</p>
                  <p className="font-medium">{String(value)}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{term(terms, "appointment_plural")}</h2>
            <Link href="/agenda" className="text-sm text-brand-600 hover:underline">
              Ver agenda
            </Link>
          </div>
          {customer.appointments.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum agendamento.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.appointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{formatDateTime(a.startAt)}</p>
                    <p className="text-slate-500">
                      {a.service?.name ?? "—"}
                      {a.staff?.user.name ? ` · ${a.staff.user.name}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                    {APPT_STATUS[a.status] ?? a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{term(terms, "work_order_plural")}</h2>
            <Link href="/ordens-de-servico" className="text-sm text-brand-600 hover:underline">
              Ver todas
            </Link>
          </div>
          {customer.workOrders.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma ordem de serviço.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.workOrders.map((wo) => (
                <Link
                  key={wo.id}
                  href={`/ordens-de-servico/${wo.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{wo.title}</p>
                    <p className="text-slate-500">{formatDate(wo.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(wo.total)}</p>
                    <span className="text-xs text-slate-500">{WO_STATUS[wo.status] ?? wo.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{term(terms, "records")}</h2>
          <Link href="/prontuario" className="text-sm text-brand-600 hover:underline">
            Ver prontuário
          </Link>
        </div>
        {customer.records.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum registro.</p>
        ) : (
          <div className="space-y-3">
            {customer.records.map((r) => (
              <div key={r.id} className="card p-4">
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-slate-500">{formatDate(r.createdAt)}</p>
                {r.content && <p className="mt-2 text-sm text-slate-700">{r.content}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{term(terms, "quote_plural")}</h2>
            <Link href="/orcamentos" className="text-sm text-brand-600 hover:underline">
              Ver orçamentos
            </Link>
          </div>
          {customer.quotes.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum orçamento.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.quotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/orcamentos/${q.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{q.title}</p>
                    <p className="text-slate-500">{formatDate(q.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(q.total)}</p>
                    <span className="text-xs text-slate-500">{QUOTE_STATUS[q.status] ?? q.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Vendas (PDV)</h2>
            <Link href="/pdv" className="text-sm text-brand-600 hover:underline">
              Ver PDV
            </Link>
          </div>
          {customer.sales.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma venda.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.sales.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{s.tableLabel ?? `Venda #${s.id.slice(-6)}`}</p>
                    <p className="text-slate-500">{formatDate(s.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(s.total)}</p>
                    <span className="text-xs text-slate-500">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{term(terms, "reservation_plural")}</h2>
            <Link href="/reservas" className="text-sm text-brand-600 hover:underline">
              Ver reservas
            </Link>
          </div>
          {customer.reservations.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma reserva.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.reservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">Quarto {r.room.number}</p>
                    <p className="text-slate-500">
                      {formatDate(r.checkIn)} — {formatDate(r.checkOut)}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">{RES_STATUS[r.status] ?? r.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{term(terms, "donation_plural")}</h2>
            <Link href="/doacoes" className="text-sm text-brand-600 hover:underline">
              Ver doações
            </Link>
          </div>
          {customer.donations.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma doação.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.donations.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{d.description ?? d.donationType ?? "Doação"}</p>
                    <p className="text-slate-500">{formatDate(d.receivedAt)}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(d.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{term(terms, "event_plural")}</h2>
            <Link href="/eventos" className="text-sm text-brand-600 hover:underline">
              Ver eventos
            </Link>
          </div>
          {customer.businessEvents.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum evento.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.businessEvents.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-slate-500">{e.eventDate ? formatDate(e.eventDate) : formatDate(e.createdAt)}</p>
                  </div>
                  <span className="text-xs text-slate-500">{EVENT_STATUS[e.status] ?? e.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pacotes de sessões</h2>
            <Link href="/pacotes" className="text-sm text-brand-600 hover:underline">
              Ver pacotes
            </Link>
          </div>
          {customer.sessionPackages.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum pacote.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.sessionPackages.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-slate-500">
                      {p.usedSessions}/{p.totalSessions} sessões
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(p.price)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{term(terms, "vehicle_plural")}</h2>
            <Link href="/veiculos" className="text-sm text-brand-600 hover:underline">
              Ver veículos
            </Link>
          </div>
          {customer.vehicles.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum veículo.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.vehicles.map((v) => (
                <div key={v.id} className="px-4 py-3 text-sm">
                  <p className="font-medium">{v.plate} — {v.model}</p>
                  <p className="text-slate-500">
                    {[v.brand, v.year, v.color].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{term(terms, "pet_plural")}</h2>
            <Link href="/pets" className="text-sm text-brand-600 hover:underline">
              Ver pets
            </Link>
          </div>
          {customer.pets.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum pet.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {customer.pets.map((p) => (
                <div key={p.id} className="px-4 py-3 text-sm">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-slate-500">
                    {[p.species, p.breed].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
