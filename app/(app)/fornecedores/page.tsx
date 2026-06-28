import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { PageHeader } from "@/components/page-header";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { DeleteButton } from "@/components/delete-button";
import { SupplierForm } from "@/modules/suppliers/supplier-form";
import { SupplierEditForm } from "@/modules/suppliers/supplier-edit-form";
import { deleteSupplier } from "@/modules/suppliers/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function FornecedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();

  const where = {
    organizationId: ctx.orgId,
    ...(params.q
      ? { name: { contains: params.q, mode: "insensitive" as const } }
      : {}),
  };

  const [total, suppliers] = await Promise.all([
    prisma.supplier.count({ where }),
    prisma.supplier.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Fornecedores"
        description="Cadastro de fornecedores e parceiros comerciais."
        action={<SupplierForm />}
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar fornecedor por nome..." />
        <ExportCsvLink module="fornecedores" searchParams={{ q: params.q || undefined }} />
      </div>

      {suppliers.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          {params.q ? "Nenhum resultado para a busca." : "Nenhum fornecedor cadastrado ainda."}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Documento</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/fornecedores/${s.id}`} className="hover:text-brand-600">
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{s.email ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{s.document ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <SupplierEditForm
                          id={s.id}
                          defaultValues={{
                            name: s.name,
                            phone: s.phone,
                            email: s.email,
                            document: s.document,
                            notes: s.notes,
                          }}
                        />
                        <DeleteButton action={deleteSupplier.bind(null, s.id)} />
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
            basePath="/fornecedores"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
