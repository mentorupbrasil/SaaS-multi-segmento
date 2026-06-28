import Link from "next/link";
import { Icon } from "@/components/icon";

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
    title: "Crie sua conta",
    text: "Cadastro rápido, plano flexível e conta ativa na hora. Sem cartão de crédito para começar.",
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
    <section className="border-y border-slate-100 bg-white">
      <div className="section py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Como funciona</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Do cadastro à operação em minutos
          </h2>
          <p className="mt-3 text-slate-600">
            Três passos simples — o mesmo fluxo que plataformas como Notion e ClickUp usam para
            reduzir atrito no primeiro acesso.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((item, i) => (
            <div key={item.step} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-brand-200 to-transparent md:block"
                  aria-hidden
                />
              )}
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-600">
                Passo {item.step}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup" className="btn-primary px-6 py-3">
            Começar grátis
            <Icon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
