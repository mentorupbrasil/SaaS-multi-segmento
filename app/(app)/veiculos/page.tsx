import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { DeleteButton } from "@/components/delete-button";
import { VehicleForm } from "@/modules/vehicles/vehicle-form";
import { deleteVehicle } from "@/modules/vehicles/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function VeiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );
  const customerLabel = term(terms, "customer");

  const where = {
    organizationId: ctx.orgId,
    ...(params.q
      ? {
          OR: [
            { plate: { contains: params.q, mode: "insensitive" as const } },
            { model: { contains: params.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, vehicles, customers] = await Promise.all([
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where,
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Veículos"
        description={`Veículos vinculados aos ${term(terms, "customer_plural").toLowerCase()}.`}
        action={
          <VehicleForm
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            customerLabel={customerLabel}
          />
        }
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar placa ou modelo..." />
        <ExportCsvLink module="veiculos" searchParams={{ q: params.q || undefined }} />
      </div>

      {vehicles.length === 0 ? (
        <EmptyState icon="Car" description={params.q ? "Nenhum resultado." : "Nenhum veículo cadastrado ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Placa</th>
                  <th className="px-4 py-3">Modelo</th>
                  <th className="px-4 py-3">{customerLabel}</th>
                  <th className="px-4 py-3">Marca</th>
                  <th className="px-4 py-3">Ano</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/veiculos/${v.id}`} className="hover:text-brand-600">
                        {v.plate}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{v.model}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <Link href={`/clientes/${v.customer.id}`} className="hover:text-brand-600">
                        {v.customer.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{v.brand ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{v.year ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(v.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DeleteButton action={deleteVehicle.bind(null, v.id)} />
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
            basePath="/veiculos"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
