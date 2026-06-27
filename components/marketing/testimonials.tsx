import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rafael Mendes",
    role: "Dono de barbearia",
    initials: "RM",
    text: "Reduzi as faltas pela metade com os lembretes e finalmente sei quanto entra de verdade no caixa. Simples de usar.",
  },
  {
    name: "Dra. Carla Lima",
    role: "Clinica de estetica",
    initials: "CL",
    text: "A agenda e o prontuario por cliente mudaram minha rotina. Tudo organizado em um lugar so, sem papelada.",
  },
  {
    name: "Joao Oliveira",
    role: "Oficina mecanica",
    initials: "JO",
    text: "As ordens de servico ficaram profissionais e o controle de pecas evita prejuizo. Meus clientes elogiam.",
  },
];

export function Testimonials() {
  return (
    <section className="section py-20">
      <div className="text-center">
        <span className="eyebrow">Depoimentos</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Negocios que ja se organizaram
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="card flex flex-col p-6">
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {t.initials}
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">{t.name}</span>
                <span className="block text-xs text-slate-500">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
