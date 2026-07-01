import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { getSupportFaqGroups } from "@/lib/platform-faq";
import {
  getSupportChannels,
  getWhatsAppUrl,
  PLATFORM_EMAIL,
  PLATFORM_MAILTO,
} from "@/lib/platform-contact";

export const metadata: Metadata = {
  title: "Suporte",
  description:
    "Precisa de ajuda com o GestorPro? Fale com o nosso time por e-mail ou WhatsApp e consulte as perguntas frequentes.",
};

export default function SuportePage() {
  const channels = getSupportChannels();
  const hasWhatsApp = Boolean(getWhatsAppUrl());

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Suporte"
        title="Estamos aqui para ajudar"
        description="Fale com a gente pelo canal que preferir. Atendimento em português, de verdade."
        primaryCta={{ href: PLATFORM_MAILTO, label: "Enviar e-mail" }}
        secondaryCta={{ href: "/precos", label: "Ver planos" }}
      />

      <section className="section py-12 lg:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {channels.map((c) => (
            <div key={c.title} className="card flex flex-col p-6 transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600">{c.text}</p>
              <Link
                href={c.href}
                className="btn-secondary mt-4"
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {c.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-slate-100 bg-slate-50/40">
        <Faq
          groups={getSupportFaqGroups()}
          title="Perguntas frequentes"
          description="O que muda por segmento, limites de cada plano, cobrança e como funciona na prática."
        />
      </div>

      <CtaBand
        title="Ainda precisa de ajuda?"
        description={
          hasWhatsApp
            ? `Nossa equipe responde em português por e-mail (${PLATFORM_EMAIL}) e WhatsApp.`
            : `Nossa equipe responde em português por e-mail em ${PLATFORM_EMAIL}.`
        }
        primaryLabel="Falar com suporte"
        primaryHref={PLATFORM_MAILTO}
        secondaryLabel="Ver planos"
        secondaryHref="/precos"
      />
    </MarketingShell>
  );
}
