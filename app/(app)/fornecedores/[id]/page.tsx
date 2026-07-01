import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { SupplierEditForm } from "@/modules/suppliers/supplier-edit-form";
import { DeleteButton } from "@/components/delete-button";
import { deleteSupplier } from "@/modules/suppliers/actions";
import { formatDate } from "@/lib/utils";

export default async function FornecedorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const supplier = await prisma.supplier.findFirst({
    where: { id, organizationId: ctx.orgId },
  });

  if (!supplier) notFound();

  return (
    <div>
      <PageHeader title={supplier.name} description="Fornecedor" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/fornecedores" className="text-sm text-primary hover:underline">
          ← Voltar
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <SupplierEditForm
            id={supplier.id}
            defaultValues={{
              name: supplier.name,
              phone: supplier.phone,
              email: supplier.email,
              document: supplier.document,
              notes: supplier.notes,
            }}
          />
          <DeleteButton action={deleteSupplier.bind(null, supplier.id)} redirectTo="/fornecedores" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Telefone</p>
          <p className="font-medium">{supplier.phone ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">E-mail</p>
          <p className="font-medium">{supplier.email ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">CNPJ / Documento</p>
          <p className="font-medium">{supplier.document ?? "—"}</p>
        </div>
      </div>

      {supplier.notes && (
        <div className="card mt-4 p-4">
          <p className="text-xs text-muted-foreground">Observações</p>
          <p className="text-sm">{supplier.notes}</p>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">Cadastrado em {formatDate(supplier.createdAt)}</p>
    </div>
  );
}
