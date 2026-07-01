import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { PublicBookingForm } from "@/components/public-booking-form";
import {
  getOrganizationByBookingSlug,
  listPublicServices,
} from "@/lib/public-booking";

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = await getOrganizationByBookingSlug(slug);

  if (!org) {
    notFound();
  }

  const services = await listPublicServices(org.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-background to-brand-100">
      <div className="mx-auto max-w-xl px-6 py-12">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Icon name="Calendar" className="h-6 w-6" />
          </span>
          <h1 className="mt-3 text-2xl font-bold text-foreground">Agendar com {org.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Escolha o serviço e o melhor horário para você.</p>
        </div>

        {services.length === 0 ? (
          <div className="card p-8 text-center text-sm text-muted-foreground">
            Nenhum serviço disponível para agendamento online no momento.
          </div>
        ) : (
          <PublicBookingForm slug={slug} orgName={org.name} services={services} />
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href={`/portal/${org.slug}`} className="hover:text-primary">
            Portal do cliente
          </Link>
          {" · "}
          Powered by GestorPro
        </p>
      </div>
    </div>
  );
}
