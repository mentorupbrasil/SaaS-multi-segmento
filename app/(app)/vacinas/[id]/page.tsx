import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { deleteVaccination } from "@/modules/vaccinations/actions";
import { formatDate } from "@/lib/utils";

export default async function VacinaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const vaccination = await prisma.vaccination.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      pet: { include: { customer: { select: { id: true, name: true } } } },
    },
  });

  if (!vaccination) notFound();

  const overdue = vaccination.nextDueAt && vaccination.nextDueAt < new Date();

  return (
    <div>
      <PageHeader title={vaccination.vaccine} description="Registro de vacinação" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/vacinas" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <DeleteButton
          action={deleteVaccination.bind(null, vaccination.id)}
          redirectTo="/vacinas"
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Pet</p>
          <Link href={`/pets/${vaccination.pet.id}`} className="font-medium hover:text-brand-600">
            {vaccination.pet.name}
          </Link>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Tutor</p>
          <Link
            href={`/clientes/${vaccination.pet.customer.id}`}
            className="font-medium hover:text-brand-600"
          >
            {vaccination.pet.customer.name}
          </Link>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Aplicada em</p>
          <p className="font-medium">{formatDate(vaccination.appliedAt)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Próxima dose</p>
          <p className={`font-medium ${overdue ? "text-red-600" : ""}`}>
            {vaccination.nextDueAt ? formatDate(vaccination.nextDueAt) : "—"}
          </p>
        </div>
      </div>

      {overdue && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Próxima dose vencida. Agende uma nova aplicação.
        </div>
      )}

      {vaccination.notes && (
        <div className="card mb-6 p-4">
          <p className="text-xs text-slate-500">Observações</p>
          <p className="text-sm">{vaccination.notes}</p>
        </div>
      )}

      <p className="text-xs text-slate-400">Registrado em {formatDate(vaccination.createdAt)}</p>
    </div>
  );
}
