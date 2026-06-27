import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Faq } from "@/components/marketing/faq";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Suporte",
  description:
    "Precisa de ajuda com o GestorPro? Fale com o nosso time por e-mail ou WhatsApp e consulte as perguntas frequentes.",
};

const CHANNELS = [
  { icon: "Mail", title: "E-mail", text: "suporte@gestorpro.com.br", href: "mailto:suporte@gestorpro.com.br", cta: "Enviar e-mail" },
  { icon: "MessageCircle", title: "WhatsApp", text: "Atendimento em horário comercial", href: "https://wa.me/5500000000000", cta: "Abrir conversa" },
  { icon: "BookOpen", title: "Central de ajuda", text: "Artigos e tutoriais (em breve)", href: "/blog", cta: "Ver conteúdos" },
];

const SUPPORT_FAQ = [
  { q: "Como crio a minha conta?", a: "Clique em “Assinar agora”, escolha o seu segmento e o plano, preencha os dados e pronto: a conta já fica ativa." },
  { q: "Esqueci a minha senha, e agora?", a: "Na tela de login você pode redefinir a senha. Em caso de dúvida, fale com o suporte por e-mail." },
  { q: "Como troco de plano?", a: "Dentro do sistema, acesse Assinatura e escolha o novo plano. A mudança é imediata." },
  { q: "Vocês ajudam na configuração inicial?", a: "Sim. Nos planos Profissional e acima, oferecemos onboarding assistido para você começar com tudo pronto." },
];

export default function SuportePage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Suporte"
        title="Estamos aqui para ajudar"
        description="Fale com a gente pelo canal que preferir. Atendimento em português, de verdade."
      />

      <section className="section py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {CHANNELS.map((c) => (
            <div key={c.title} className="card flex flex-col p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600">{c.text}</p>
              <Link href={c.href} className="btn-secondary mt-4">
                {c.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-slate-100 bg-slate-50/60">
        <Faq items={SUPPORT_FAQ} title="Perguntas frequentes" />
      </div>
    </MarketingShell>
  );
}
