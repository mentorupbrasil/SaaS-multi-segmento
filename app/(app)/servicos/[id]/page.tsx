import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { ServiceEditForm } from "@/modules/services/service-edit-form";
import { DeleteButton } from "@/components/delete-button";
import { deleteService } from "@/modules/services/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ServicoDetailPage({
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
  const serviceLabel = term(terms, "service");

  const service = await prisma.service.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      staffLinks: { include: { membership: { include: { user: true } } } },
      _count: { select: { appointments: true } },
    },
  });

  if (!service) notFound();

  return (
    <div>
      <PageHeader title={service.name} description={serviceLabel} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/servicos" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <ServiceEditForm
            id={service.id}
            serviceLabel={serviceLabel}
            defaultValues={{
              name: service.name,
              price: service.price,
              durationMin: service.durationMin,
            }}
          />
          <DeleteButton action={deleteService.bind(null, service.id)} redirectTo="/servicos" />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Preço</p>
          <p className="font-medium">{formatCurrency(service.price)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Duração</p>
          <p className="font-medium">{service.durationMin} min</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p className="font-medium">{service.active ? "Ativo" : "Inativo"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Agendamentos</p>
          <p className="font-medium">{service._count.appointments}</p>
        </div>
      </div>

      {service.staffLinks.length > 0 && (
        <div className="card p-4">
          <p className="mb-2 text-xs text-slate-500">{term(terms, "professional_plural")}</p>
          <ul className="flex flex-wrap gap-2">
            {service.staffLinks.map((link) => (
              <li
                key={link.membershipId}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                {link.membership.user.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">Cadastrado em {formatDate(service.createdAt)}</p>
    </div>
  );
}
