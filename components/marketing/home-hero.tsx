"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { HeroSection } from "@/components/marketing/hero-section";
import { getSegmentTotal } from "@/lib/segment-vitrine";

/** Imagens em alta resolução (800px) — nichos do GestorPro */
const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=90&w=800&h=800",
    alt: "Barbearia — ferramentas e ambiente profissional",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=90&w=800&h=800",
    alt: "Clínica — profissional de saúde em consultório",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=90&w=800&h=800",
    alt: "Equipe de negócio celebrando resultado",
  },
];

export function HomeHero({ starterPrice }: { starterPrice?: number }) {
  const total = getSegmentTotal();
  const priceLabel =
    starterPrice != null ? `R$ ${starterPrice.toFixed(2).replace(".", ",")}` : "R$ 39,90";

  return (
    <HeroSection
      eyebrow={
        <span className="eyebrow">
          <Icon name="Sparkles" className="h-3.5 w-3.5" />
          Gestão sob medida para o seu ramo
        </span>
      }
      title={
        <>
          Tudo o que o seu negócio precisa,{" "}
          <span className="gradient-text">em um só lugar</span>
        </>
      }
      subtitle={`Escolha o seu segmento e tenha agenda, clientes, serviços e financeiro com a linguagem do seu nicho. Cadastro em minutos, a partir de ${priceLabel}/mês — acesso após confirmação do pagamento.`}
      actions={[
        {
          text: (
            <>
              Assinar agora
              <Icon name="ArrowRight" className="h-4 w-4" />
            </>
          ),
          href: "/signup",
          className: "gap-2 shadow-md shadow-primary/20",
        },
        {
          text: (
            <>
              Ver planos
              <Icon name="ArrowRight" className="h-4 w-4" />
            </>
          ),
          href: "/precos",
          variant: "outline",
          className: "gap-2",
        },
      ]}
      stats={[
        {
          value: `${total}+`,
          label: "segmentos prontos",
          icon: <Icon name="Layers" className="h-5 w-5" />,
        },
        {
          value: "2 min",
          label: "para criar conta",
          icon: <Icon name="Zap" className="h-5 w-5" />,
        },
        {
          value: "100%",
          label: "suporte em português",
          icon: <Icon name="Headphones" className="h-5 w-5" />,
        },
      ]}
      images={HERO_IMAGES}
    />
  );
}
