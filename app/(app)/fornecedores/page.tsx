import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { SupplierForm } from "@/modules/suppliers/supplier-form";
import { deleteSupplier } from "@/modules/suppliers/actions";
import { formatDate } from "@/lib/utils";

export default async function FornecedoresPage() {
  const ctx = await getAuthContext();

  const suppliers = await prisma.supplier.findMany({
    where: { organizationId: ctx.orgId },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Fornecedores"
        description="Cadastro de fornecedores e parceiros comerciais."
        action={<SupplierForm />}
      />

      {suppliers.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum fornecedor cadastrado ainda.</div>
      ) : (
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
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{s.email ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{s.document ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3">
                    <DeleteButton onConfirm={() => deleteSupplier(s.id)} />
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
