import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { deleteVehicle } from "@/modules/vehicles/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const WO_STATUS: Record<string, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
  CANCELED: "Cancelada",
};

const QUOTE_STATUS: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONVERTED: "Convertido",
  EXPIRED: "Expirado",
};

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const vehicle = await prisma.vehicle.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      customer: true,
      workOrders: { orderBy: { createdAt: "desc" } },
      quotes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!vehicle) notFound();

  return (
    <div>
      <PageHeader
        title={`${vehicle.plate} — ${vehicle.model}`}
        description={term(terms, "vehicle")}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/veiculos" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <DeleteButton
          onConfirm={() => deleteVehicle(vehicle.id)}
          redirectTo="/veiculos"
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">{term(terms, "customer")}</p>
          <p className="font-medium">
            <Link href={`/clientes/${vehicle.customer.id}`} className="hover:text-brand-600">
              {vehicle.customer.name}
            </Link>
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Marca / Ano</p>
          <p className="font-medium">{[vehicle.brand, vehicle.year].filter(Boolean).join(" · ") || "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Cor</p>
          <p className="font-medium">{vehicle.color ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Quilometragem</p>
          <p className="font-medium">{vehicle.mileage != null ? `${vehicle.mileage} km` : "—"}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-2 text-lg font-semibold">{term(terms, "work_order_plural")}</h2>
          {vehicle.workOrders.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma ordem de serviço.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {vehicle.workOrders.map((wo) => (
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

        <section>
          <h2 className="mb-2 text-lg font-semibold">{term(terms, "quote_plural")}</h2>
          {vehicle.quotes.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum orçamento.</p>
          ) : (
            <div className="card divide-y divide-slate-100">
              {vehicle.quotes.map((q) => (
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
      </div>
    </div>
  );
}

