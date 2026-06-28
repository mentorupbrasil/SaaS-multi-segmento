import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { getOrganizationByPortalSlug } from "@/lib/public-booking";
import { findCustomerByEmail, listParentPortalData } from "@/lib/public-portal";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PortalResponsavelPage({
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

  if (!email?.trim()) {
    return (
      <Shell orgSlug={org.slug} orgName={org.name}>
        <h1 className="mb-2 text-2xl font-bold">Área do responsável</h1>
        <p className="mb-6 text-sm text-slate-600">
          Informe o e-mail cadastrado na escola para ver turmas, frequência e mensalidades.
        </p>
        <form method="get" className="card space-y-4 p-6">
          <div>
            <label htmlFor="email" className="label">
              E-mail
            </label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </Shell>
    );
  }

  const customer = await findCustomerByEmail(org.id, email);
  if (!customer) {
    return (
      <Shell orgSlug={org.slug} orgName={org.name}>
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          E-mail não encontrado. Verifique com a secretaria.
        </p>
        <Link href={`/portal/${org.slug}/responsavel`} className="mt-4 inline-block text-sm text-brand-600 hover:underline">
          Tentar novamente
        </Link>
      </Shell>
    );
  }

  const data = await listParentPortalData(org.id, customer.id);

  return (
    <Shell orgSlug={org.slug} orgName={org.name}>
      <h1 className="mb-1 text-2xl font-bold">{customer.name}</h1>
      <p className="mb-6 text-sm text-slate-600">Portal do responsável · {org.name}</p>

      {data.frequencyRate != null && (
        <div className="card mb-6 p-4">
          <p className="text-xs text-slate-500">Frequência recente</p>
          <p className="text-2xl font-bold text-brand-600">{data.frequencyRate}%</p>
        </div>
      )}

      <section className="mb-8">
        <h2 className="mb-3 font-semibold">Turmas matriculadas</h2>
        {data.enrollments.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhuma matrícula ativa.</p>
        ) : (
          <ul className="space-y-2">
            {data.enrollments.map((e) => (
              <li key={e.id} className="card p-4">
                <p className="font-medium">{e.class.name}</p>
                <p className="text-xs text-slate-500">
                  {[e.class.grade, e.class.shift].filter(Boolean).join(" · ") || "Turma ativa"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-semibold">Mensalidades em aberto</h2>
        {data.financialOpen.length === 0 ? (
          <p className="text-sm text-green-600">Nenhuma pendência financeira.</p>
        ) : (
          <ul className="space-y-2">
            {data.financialOpen.map((f) => (
              <li key={f.id} className="card flex justify-between p-4 text-sm">
                <span>{f.description}</span>
                <span className="font-medium text-amber-600">
                  {formatCurrency(f.amount)}
                  {f.dueDate ? ` · ${formatDate(f.dueDate)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Últimas presenças</h2>
        {data.attendance.length === 0 ? (
          <p className="text-sm text-slate-500">Sem registros de frequência.</p>
        ) : (
          <ul className="card divide-y divide-slate-100 text-sm">
            {data.attendance.slice(0, 10).map((a) => (
              <li key={a.id} className="flex justify-between px-4 py-3">
                <span>
                  {formatDate(a.date)} · {a.class.name}
                </span>
                <span className={a.present ? "text-green-600" : "text-red-600"}>
                  {a.present ? "Presente" : "Falta"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Shell>
  );
}

function Shell({
  orgSlug,
  orgName,
  children,
}: {
  orgSlug: string;
  orgName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link href={`/portal/${orgSlug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
          <Icon name="ArrowLeft" className="h-4 w-4" />
          {orgName}
        </Link>
        {children}
      </div>
    </div>
  );
}
