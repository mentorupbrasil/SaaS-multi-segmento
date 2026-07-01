"use client";

import { Icon } from "@/components/icon";
import { HeroSection } from "@/components/marketing/hero-section";
import { getSegmentTotal } from "@/lib/segment-vitrine";

export function HomeHero({ starterPrice }: { starterPrice?: number }) {
  const total = getSegmentTotal();
  const priceLabel =
    starterPrice != null ? `R$ ${starterPrice.toFixed(2).replace(".", ",")}` : "R$ 39,90";

  return (
    <HeroSection
      badge={
        <>
          <Icon name="Sparkles" className="h-3.5 w-3.5 text-primary" />
          Gestão sob medida para o seu ramo
        </>
      }
      headline={{
        regular: "Tudo o que o seu negócio precisa,",
        gradient: "em um só lugar",
      }}
      description={`Escolha o seu segmento e tenha agenda, clientes, serviços e financeiro com a linguagem do seu nicho. Cadastro em minutos, a partir de ${priceLabel}/mês — acesso após confirmação do pagamento.`}
      actions={[
        {
          text: (
            <>
              Assinar agora
              <Icon name="ArrowRight" className="h-4 w-4" />
            </>
          ),
          href: "/signup",
          animated: true,
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
          icon: <Icon name="Layers" className="h-3.5 w-3.5" />,
        },
        {
          value: "2 min",
          label: "para criar conta",
          icon: <Icon name="Zap" className="h-3.5 w-3.5" />,
        },
        {
          value: "100%",
          label: "suporte em português",
          icon: <Icon name="Headphones" className="h-3.5 w-3.5" />,
        },
      ]}
    />
  );
}
