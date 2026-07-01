import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Testimonials } from "@/components/marketing/testimonials";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { getSegmentTotal } from "@/lib/segment-vitrine";

export const metadata: Metadata = {
  title: "Clientes e casos",
  description:
    "Negócios de diversos segmentos usam o GestorPro para organizar a agenda, os clientes e o financeiro. Veja histórias e resultados.",
};

const CASES = [
  {
    icon: "Scissors",
    segment: "Barbearia",
    title: "Agenda cheia e menos faltas",
    text: "Com lembretes (plano Profissional+) e agenda online, a barbearia reduziu horários vazios e organizou o caixa do dia.",
  },
  {
    icon: "Stethoscope",
    segment: "Clínica",
    title: "Prontuário sempre à mão",
    text: "O histórico de cada paciente em um só lugar agilizou o atendimento e a rotina da recepção.",
  },
  {
    icon: "Car",
    segment: "Oficina",
    title: "Ordens de serviço sob controle",
    text: "Saíram do caderno: cada serviço com itens, status e valor no plano Premium — sem perder orçamento.",
  },
];

export default function CasosPage() {
  const total = getSegmentTotal();

  const stats = [
    { n: `${total}+`, l: "Segmentos atendidos" },
    { n: "100%", l: "Online e na nuvem" },
    { n: "R$ 39,90", l: "A partir de, por mês" },
    { n: "Sem", l: "Fidelidade ou multa" },
  ];

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Clientes"
        title="Negócios reais, organizados de verdade"
        description="De barbearias a clínicas, o GestorPro se adapta a cada segmento para resolver o que importa."
      />

      <section className="section py-12">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-slate-200 bg-white p-8 text-center sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-bold text-slate-900">{s.n}</p>
              <p className="mt-1 text-sm text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section pb-4">
        <div className="grid gap-6 md:grid-cols-3">
          {CASES.map((c) => (
            <div key={c.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-brand-600">
                {c.segment}
              </span>
              <h3 className="mt-1 font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />

      <section className="section pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 px-8 py-12 text-center text-white shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Faça parte dessa lista</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-100">
            Crie sua conta e organize o seu negócio como os nossos clientes.
          </p>
          <Link href="/signup" className="btn-white mt-6">
            Criar minha conta
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
