import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { PetEditForm } from "@/modules/pets/pet-edit-form";
import { DeleteButton } from "@/components/delete-button";
import { deletePet } from "@/modules/pets/actions";
import { formatDate } from "@/lib/utils";

export default async function PetDetailPage({
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
  const customerLabel = term(terms, "customer");

  const [pet, customers] = await Promise.all([
    prisma.pet.findFirst({
      where: { id, organizationId: ctx.orgId },
      include: { customer: true },
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!pet) notFound();

  return (
    <div>
      <PageHeader title={pet.name} description={term(terms, "pet")} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/pets" className="text-sm text-primary hover:underline">
          ← Voltar
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <PetEditForm
            id={pet.id}
            customerLabel={customerLabel}
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            defaultValues={{
              customerId: pet.customerId,
              name: pet.name,
              species: pet.species,
              breed: pet.breed,
              sex: pet.sex,
              weight: pet.weight,
              allergies: pet.allergies,
              notes: pet.notes,
            }}
          />
          <DeleteButton action={deletePet.bind(null, pet.id)} redirectTo="/pets" />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">{customerLabel}</p>
          <p className="font-medium">
            <Link href={`/clientes/${pet.customer.id}`} className="hover:text-primary">
              {pet.customer.name}
            </Link>
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Espécie / Raça</p>
          <p className="font-medium">{[pet.species, pet.breed].filter(Boolean).join(" · ") || "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Sexo / Peso</p>
          <p className="font-medium">
            {[pet.sex === "M" ? "Macho" : pet.sex === "F" ? "Fêmea" : null, pet.weight != null ? `${pet.weight} kg` : null]
              .filter(Boolean)
              .join(" · ") || "—"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Cadastro</p>
          <p className="font-medium">{formatDate(pet.createdAt)}</p>
        </div>
      </div>

      {pet.allergies && (
        <div className="card mb-4 p-4">
          <p className="text-xs text-muted-foreground">Alergias</p>
          <p className="text-sm">{pet.allergies}</p>
        </div>
      )}

      {pet.notes && (
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Observações</p>
          <p className="text-sm">{pet.notes}</p>
        </div>
      )}
    </div>
  );
}
