"use client";

import { Icon } from "@/components/icon";
import { HeroSection } from "@/components/marketing/hero-section";
import { getSegmentTotal } from "@/lib/segment-vitrine";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=480&h=480",
    alt: "Profissional atendendo cliente em barbearia",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=480&h=480",
    alt: "Equipe de clínica utilizando sistema de gestão",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=480&h=480",
    alt: "Empreendedor gerenciando negócio no notebook",
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
          text: "Assinar agora",
          href: "/signup",
          className: "gap-2",
        },
        {
          text: "Ver planos",
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
