import Link from "next/link";
import type { MasterDataType } from "@prisma/client";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import {
  isMasterDataType,
  MASTER_DATA_TYPES,
  masterDataTypeLabel,
} from "@/lib/master-data";
import { PageShell } from "@/components/page-shell";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { DeleteButton } from "@/components/delete-button";
import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/utils";
import { deleteMasterDataItem } from "./actions";
import { MasterDataAddForm } from "./master-data-form";

const PAGE_SIZE = 20;

export default async function CadastrosPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string; page?: string }>;
}) {
  const { type: typeParam, q = "", page: pageParam } = await searchParams;
  const activeType: MasterDataType =
    typeParam && isMasterDataType(typeParam) ? typeParam : MASTER_DATA_TYPES[0];
  const page = Math.max(1, Number(pageParam) || 1);

  const ctx = await getAuthContext();
  const query = q.trim();

  const where = {
    organizationId: ctx.orgId,
    type: activeType,
    ...(query
      ? {
          OR: [
            { label: { contains: query, mode: "insensitive" as const } },
            { value: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.masterData.count({ where }),
    prisma.masterData.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <PageShell
      breadcrumb={[
        { label: "Configurações", href: "/configuracoes" },
        { label: "Cadastros auxiliares" },
      ]}
      title="Cadastros auxiliares"
      description="Gerencie listas reutilizáveis em formulários e relatórios do sistema."
    >
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {MASTER_DATA_TYPES.map((type) => {
          const params = new URLSearchParams();
          params.set("type", type);
          if (query) params.set("q", query);

          const href = `/configuracoes/cadastros?${params.toString()}`;
          const active = type === activeType;

          return (
            <Link
              key={type}
              href={href}
              className={
                active
                  ? "rounded-t-lg border border-b-0 border-slate-200 bg-white px-3 py-2 text-sm font-medium text-brand-700"
                  : "rounded-t-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }
            >
              {masterDataTypeLabel(type)}
            </Link>
          );
        })}
      </div>

      <div className="card mb-6 p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Novo item — {masterDataTypeLabel(activeType)}
        </h2>
        <MasterDataAddForm type={activeType} />
      </div>

      <ListToolbar
        searchValue={query}
        searchPlaceholder={`Buscar em ${masterDataTypeLabel(activeType).toLowerCase()}...`}
      >
        <input type="hidden" name="type" value={activeType} />
      </ListToolbar>

      {items.length === 0 ? (
        <EmptyState
          description={
            query
              ? "Nenhum item encontrado para esta busca."
              : `Nenhum item cadastrado em ${masterDataTypeLabel(activeType).toLowerCase()} ainda.`
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Cadastro</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.label}</td>
                  <td className="px-4 py-3 text-slate-600">{item.value ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <DeleteButton
                      action={deleteMasterDataItem.bind(null, item.id)}
                      confirmMessage={`Excluir "${item.label}"? Esta ação não pode ser desfeita.`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        basePath="/configuracoes/cadastros"
        searchParams={{ type: activeType, q: query || undefined }}
      />
    </PageShell>
  );
}
