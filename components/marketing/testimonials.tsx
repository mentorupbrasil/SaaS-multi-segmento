import Link from "next/link";
import { Star } from "lucide-react";
import { getSegmentTotal } from "@/lib/segment-vitrine";

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
    role: "Clínica de estética",
    initials: "CL",
    text: "A agenda e o prontuário por cliente mudaram minha rotina. Tudo organizado em um lugar só, sem papelada.",
  },
  {
    name: "João Oliveira",
    role: "Oficina mecânica",
    initials: "JO",
    text: "As ordens de serviço ficaram profissionais e o controle de peças evita prejuízo. Meus clientes elogiam.",
  },
];

export function Testimonials() {
  const total = getSegmentTotal();

  return (
    <section className="border-y border-slate-100 bg-slate-50/40">
      <div className="section py-16 lg:py-20">
        <div className="text-center">
          <span className="eyebrow">Depoimentos</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Negócios que já se organizaram
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Donos de barbearia, clínica, oficina e outros segmentos usando o GestorPro no dia a dia.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900">{total}+</p>
            <p className="text-xs text-slate-500">segmentos atendidos</p>
          </div>
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div>
            <p className="flex items-center justify-center gap-1 text-2xl font-bold text-slate-900">
              5.0
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </p>
            <p className="text-xs text-slate-500">avaliação média</p>
          </div>
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div>
            <p className="text-2xl font-bold text-slate-900">1 min</p>
            <p className="text-xs text-slate-500">para ativar a conta</p>
          </div>
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

        <div className="mt-10 text-center">
          <Link href="/casos" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Ver casos de uso →
          </Link>
        </div>
      </div>
    </section>
  );
}
