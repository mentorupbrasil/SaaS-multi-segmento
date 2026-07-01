import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { getOrganizationByPortalSlug } from "@/lib/public-booking";
import {
  findCustomerByEmail,
  listCustomerQuotes,
  listCustomerWorkOrders,
} from "@/lib/public-portal";
import { portalQuoteUrl, portalWorkOrderUrl } from "@/lib/portal-token";
import { checkPortalLookupRateLimit } from "@/lib/portal-rate-limit";
import { formatCurrency, formatDate } from "@/lib/utils";

const WO_STATUS: Record<string, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
  CANCELED: "Cancelada",
};

const QUOTE_STATUS: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONVERTED: "Convertido",
};

export default async function PortalOsLookupPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orgSlug } = await params;
  const { email } = await searchParams;
  const org = await getOrganizationByPortalSlug(orgSlug);
  if (!org) notFound();

  if (email?.trim()) {
    const rl = checkPortalLookupRateLimit(`${orgSlug}:${email}`);
    if (!rl.ok) {
      return (
        <PortalShell orgName={org.name} orgSlug={org.slug} title="Acompanhar serviços">
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Muitas tentativas. Aguarde alguns minutos e tente novamente.
          </p>
        </PortalShell>
      );
    }
  }

  if (!email?.trim()) {
    return (
      <PortalShell orgName={org.name} orgSlug={org.slug} title="Acompanhar serviços">
        <form method="get" className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              E-mail cadastrado
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="seu@email.com"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Buscar
          </button>
        </form>
      </PortalShell>
    );
  }

  const customer = await findCustomerByEmail(org.id, email);
  if (!customer) {
    return (
      <PortalShell orgName={org.name} orgSlug={org.slug} title="Acompanhar serviços">
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Nenhum cadastro encontrado com este e-mail.
        </p>
        <Link href={`/portal/${org.slug}/os`} className="mt-4 inline-block text-sm text-primary hover:underline">
          Tentar outro e-mail
        </Link>
      </PortalShell>
    );
  }

  const [workOrders, quotes] = await Promise.all([
    listCustomerWorkOrders(org.id, customer.id),
    listCustomerQuotes(org.id, customer.id),
  ]);

  return (
    <PortalShell orgName={org.name} orgSlug={org.slug} title={`Olá, ${customer.name}`}>
      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-foreground">Ordens de serviço</h2>
        {workOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma OS encontrada.</p>
        ) : (
          <ul className="space-y-2">
            {workOrders.map((wo) => (
              <li key={wo.id}>
                <Link
                  href={portalWorkOrderUrl(org.slug, wo.id, org.id)}
                  className="card flex items-center justify-between p-4 hover:ring-2 hover:ring-brand-200"
                >
                  <div>
                    <p className="font-medium">{wo.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(wo.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(wo.total)}</p>
                    <p className="text-xs text-muted-foreground">{WO_STATUS[wo.status] ?? wo.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-foreground">Orçamentos</h2>
        {quotes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum orçamento encontrado.</p>
        ) : (
          <ul className="space-y-2">
            {quotes.map((q) => (
              <li key={q.id}>
                <Link
                  href={portalQuoteUrl(org.slug, q.id, org.id)}
                  className="card flex items-center justify-between p-4 hover:ring-2 hover:ring-brand-200"
                >
                  <div>
                    <p className="font-medium">{q.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(q.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(q.total)}</p>
                    <p className="text-xs text-muted-foreground">{QUOTE_STATUS[q.status] ?? q.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PortalShell>
  );
}

function PortalShell({
  orgName,
  orgSlug,
  title,
  children,
}: {
  orgName: string;
  orgSlug: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link href={`/portal/${orgSlug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <Icon name="ArrowLeft" className="h-4 w-4" />
          {orgName}
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-foreground">{title}</h1>
        {children}
      </div>
    </div>
  );
}
