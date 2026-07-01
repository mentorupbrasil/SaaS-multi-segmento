import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O GestorPro nasceu para entregar um sistema de gestão que entende cada segmento, com a linguagem e os recursos certos para cada negócio.",
};

const VALUES = [
  { icon: "Target", title: "Foco no seu segmento", text: "Em vez de um sistema genérico, entregamos uma plataforma que fala a língua do seu negócio." },
  { icon: "HeartHandshake", title: "Simplicidade", text: "Tecnologia que qualquer pessoa da equipe usa, sem treinamento complexo." },
  { icon: "ShieldCheck", title: "Confiança", text: "Seus dados isolados e protegidos, com acesso por permissão." },
];

export default function SobrePage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Sobre"
        title="A plataforma que entende o seu negócio"
        description="Acreditamos que cada segmento tem a sua própria forma de trabalhar — e o sistema deveria se adaptar a ela, não o contrário."
      />

      <section className="section py-16">
        <div className="mx-auto max-w-3xl space-y-5 text-slate-700">
          <p className="leading-relaxed">
            A maioria dos sistemas de gestão tenta servir a todos da mesma forma: menus genéricos,
            termos que não fazem sentido para o seu dia a dia e funcionalidades que você nunca vai
            usar. O resultado é uma equipe que resiste à ferramenta e um negócio que continua no
            caderno e na planilha.
          </p>
          <p className="leading-relaxed">
            O <strong className="text-slate-900">GestorPro</strong> nasceu para resolver isso. Uma
            única plataforma que se transforma conforme o seu segmento — barbearia, salão, clínica,
            oficina, petshop, academia e muito mais — com a nomenclatura, os serviços e os campos
            certos para cada negócio.
          </p>
          <p className="leading-relaxed">
            O objetivo é simples: que você abra o sistema e sinta que ele foi feito para você.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-100">
                <Icon name={v.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">
            Criar minha conta
            <Icon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
