import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { getOrganizationByPortalSlug } from "@/lib/public-booking";
import { getSegment } from "@/segments";

export default async function PortalLandingPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const org = await getOrganizationByPortalSlug(orgSlug);
  if (!org) notFound();

  const segment = getSegment(org.segmentId);
  const isEducation = segment?.category === "educacao";
  const isAutomotiveOrServices =
    segment?.category === "automotivo" || segment?.category === "servicos";
  const bookingSlug = org.publicBookingSlug ?? org.slug;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-background to-brand-100">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
        <div className="card overflow-hidden">
          <div className="border-b border-border bg-muted/40 px-8 py-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Icon name="Building2" className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-foreground">{org.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Portal do cliente</p>
          </div>

          <div className="space-y-3 p-8">
            {org.publicBookingEnabled ? (
              <Link
                href={`/agendar/${bookingSlug}`}
                className="btn-primary flex w-full items-center justify-center gap-2 py-3"
              >
                <Icon name="Calendar" className="h-4 w-4" />
                Agendar horário
              </Link>
            ) : (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Agendamento online temporariamente indisponível.
              </p>
            )}

            <Link
              href={`/portal/${org.slug}/agenda`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <Icon name="Clock" className="h-4 w-4" />
              Ver meus agendamentos
            </Link>

            {isAutomotiveOrServices && (
              <Link
                href={`/portal/${org.slug}/os`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <Icon name="ClipboardList" className="h-4 w-4" />
                Acompanhar OS e orçamentos
              </Link>
            )}

            {isEducation && (
              <Link
                href={`/portal/${org.slug}/responsavel`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <Icon name="GraduationCap" className="h-4 w-4" />
                Área do responsável
              </Link>
            )}

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              <Icon name="LogIn" className="h-4 w-4" />
              Entrar na área do negócio
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">Powered by GestorPro</p>
      </div>
    </div>
  );
}
