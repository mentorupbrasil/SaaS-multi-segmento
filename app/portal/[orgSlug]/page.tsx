import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { getOrganizationByPortalSlug } from "@/lib/public-booking";

export default async function PortalLandingPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const org = await getOrganizationByPortalSlug(orgSlug);
  if (!org) notFound();

  const bookingSlug = org.publicBookingSlug ?? org.slug;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-violet-50">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-8 py-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <Icon name="Building2" className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">{org.name}</h1>
            <p className="mt-1 text-sm text-slate-500">Portal do cliente</p>
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Icon name="Clock" className="h-4 w-4" />
              Ver meus agendamentos
            </Link>

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition hover:border-brand-200 hover:text-brand-700"
            >
              <Icon name="LogIn" className="h-4 w-4" />
              Entrar na área do negócio
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Powered by GestorPro
        </p>
      </div>
    </div>
  );
}
