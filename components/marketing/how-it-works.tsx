import Link from "next/link";
import { Icon } from "@/components/icon";
import { SectionHeader } from "./section-header";

const STEPS = [
  {
    icon: "Search",
    step: "1",
    title: "Escolha o seu segmento",
    text: "Busque pelo ramo ou navegue pelas categorias. O sistema já vem com menus e termos do seu nicho.",
  },
  {
    icon: "LogIn",
    step: "2",
    title: "Assine e ative sua conta",
    text: "Escolha o plano, conclua o cadastro e pague via PIX ou cartão. Conta ativa na hora.",
  },
  {
    icon: "Rocket",
    step: "3",
    title: "Comece a operar",
    text: "Agenda, clientes, serviços e financeiro prontos. Convide a equipe e personalize conforme crescer.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative border-y border-slate-200/60 bg-white py-16 lg:py-20">
      <div className="section">
        <SectionHeader
          eyebrow="Como funciona"
          title="Do cadastro à operação em minutos"
          description="Três passos diretos — escolha o segmento, assine e comece a operar."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((item, i) => (
            <div
              key={item.step}
              className="card-elevated relative flex flex-col p-6 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="absolute right-4 top-4 text-4xl font-black text-slate-100">
                {item.step}
              </span>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/25">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-brand-600">
                Passo {item.step}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
              {i < STEPS.length - 1 && (
                <div
                  className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-brand-200 to-transparent md:block"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup" className="btn-primary px-6 py-3 shadow-md shadow-brand-600/20">
            Assinar agora
            <Icon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
