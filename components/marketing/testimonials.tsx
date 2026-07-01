"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getSegmentTotal } from "@/lib/segment-vitrine";
import { cn } from "@/lib/utils";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    text: "Reduzi as faltas pela metade com os lembretes e finalmente sei quanto entra de verdade no caixa. Simples de usar no dia a dia.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Rafael Mendes",
    role: "Dono de barbearia",
  },
  {
    text: "A agenda e o prontuário por cliente mudaram minha rotina. Tudo organizado em um lugar só, sem papelada espalhada.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Dra. Carla Lima",
    role: "Clínica de estética",
  },
  {
    text: "As ordens de serviço ficaram profissionais e o controle de peças evita prejuízo. Meus clientes elogiam a organização.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "João Oliveira",
    role: "Oficina mecânica",
  },
  {
    text: "Implementação rápida e interface intuitiva. A equipe aprendeu em um dia e hoje a agenda do salão roda sozinha.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Marina Costa",
    role: "Salão de beleza",
  },
  {
    text: "O suporte em português fez diferença. Nos guiaram na configuração e hoje controlamos vacinas, pets e financeiro juntos.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Pedro Alves",
    role: "Petshop",
  },
  {
    text: "Controle de matrículas, turmas e mensalidades num só sistema. Economizamos horas toda semana na operação.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Ana Souza",
    role: "Academia",
  },
  {
    text: "Reservas, quartos e governança integrados. A recepção trabalha mais rápido e com menos erro de overbooking.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Lucas Ferreira",
    role: "Pousada",
  },
  {
    text: "O PDV e o estoque conversam entre si. Fechamos o caixa com confiança e sabemos o que precisa repor.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Patricia Rios",
    role: "Restaurante",
  },
  {
    text: "Escolhemos o segmento certo e o sistema já veio com a linguagem do nosso negócio. Foi exatamente o que precisávamos.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Marcos Teixeira",
    role: "Escola de idiomas",
  },
];

const firstColumn = TESTIMONIALS.slice(0, 3);
const secondColumn = TESTIMONIALS.slice(3, 6);
const thirdColumn = TESTIMONIALS.slice(6, 9);

function TestimonialCard({ text, image, name, role }: Testimonial) {
  return (
    <figure className="group w-full max-w-xs cursor-default select-none rounded-3xl border border-border bg-card p-8 shadow-lg shadow-black/5 transition-colors duration-300 focus-within:ring-2 focus-within:ring-ring/30 sm:p-10">
      <blockquote className="m-0">
        <p className="m-0 font-normal leading-relaxed text-muted-foreground">&ldquo;{text}&rdquo;</p>
        <figcaption className="mt-6 flex items-center gap-3">
          <Image
            width={40}
            height={40}
            src={image}
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-2 ring-border transition-all duration-300 group-hover:ring-primary/30"
          />
          <div className="flex flex-col">
            <cite className="not-italic font-semibold leading-5 tracking-tight text-foreground">{name}</cite>
            <span className="mt-0.5 text-sm leading-5 tracking-tight text-muted-foreground">{role}</span>
          </div>
        </figcaption>
      </blockquote>
    </figure>
  );
}

function TestimonialsColumn({
  className,
  items,
  duration = 10,
  animated,
}: {
  className?: string;
  items: Testimonial[];
  duration?: number;
  animated: boolean;
}) {
  if (!animated) {
    return (
      <ul className={cn("flex flex-col gap-6 list-none p-0 m-0", className)}>
        {items.map((item) => (
          <li key={item.name}>
            <TestimonialCard {...item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={className}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="m-0 flex list-none flex-col gap-6 bg-transparent p-0 pb-6"
        aria-hidden
      >
        {[0, 1].map((setIndex) => (
          <Fragment key={setIndex}>
            {items.map((item) => (
              <motion.li
                key={`${setIndex}-${item.name}`}
                aria-hidden={setIndex === 1 ? true : undefined}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                className="rounded-3xl focus-within:outline-none"
              >
                <TestimonialCard {...item} />
              </motion.li>
            ))}
          </Fragment>
        ))}
      </motion.ul>
    </div>
  );
}

export function Testimonials() {
  const reduceMotion = useReducedMotion();
  const total = getSegmentTotal();
  const animated = !reduceMotion;

  return (
    <section aria-labelledby="testimonials-heading" className="relative overflow-hidden border-y border-border bg-muted/20 py-20 lg:py-24">
      <div className="section relative z-10">
        <motion.div
          initial={animated ? { opacity: 0, y: 40 } : false}
          whileInView={animated ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto mb-12 flex max-w-[540px] flex-col items-center justify-center text-center lg:mb-16"
        >
          <span className="eyebrow">Depoimentos</span>
          <h2
            id="testimonials-heading"
            className="text-balance mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            O que nossos clientes dizem
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            Donos de barbearia, clínica, oficina e dezenas de outros segmentos organizando o negócio com o GestorPro.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-center sm:gap-8">
            <div>
              <p className="text-2xl font-bold tabular-nums text-foreground">{total}+</p>
              <p className="text-xs text-muted-foreground">segmentos atendidos</p>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div>
              <p className="text-2xl font-bold tabular-nums text-foreground">2 min</p>
              <p className="text-xs text-muted-foreground">para criar a conta</p>
            </div>
          </div>
        </motion.div>

        <div
          className={cn(
            "mt-10 flex justify-center gap-6",
            animated && "[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden",
          )}
          role="region"
          aria-label="Depoimentos de clientes"
        >
          <TestimonialsColumn items={firstColumn} duration={15} animated={animated} />
          <TestimonialsColumn items={secondColumn} className="hidden md:block" duration={19} animated={animated} />
          <TestimonialsColumn items={thirdColumn} className="hidden lg:block" duration={17} animated={animated} />
        </div>

        <p className="mt-10 text-center">
          <Link href="/casos" className="text-sm font-semibold text-primary hover:underline">
            Ver casos de uso →
          </Link>
        </p>
      </div>
    </section>
  );
}
