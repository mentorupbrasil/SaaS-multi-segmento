import type { FaqGroup, FaqItem } from "@/components/marketing/faq";
import { PLATFORM_EMAIL } from "@/lib/platform-contact";
import { filterModulesByPlan } from "@/lib/plan-enforcement";
import { MODULES } from "@/modules";
import { PLANS } from "@/lib/plans";
import { resolveSegmentModules } from "@/lib/segment-modules";
import { getSegmentTotal } from "@/lib/segment-vitrine";
import { formatCurrency } from "@/lib/utils";
import type { SegmentTemplate } from "@/segments/types";
import type { ModuleId } from "@/modules/types";

const segmentTotal = getSegmentTotal();
const starter = PLANS.find((p) => p.id === "starter")!;
const pro = PLANS.find((p) => p.id === "pro")!;

function isBillingConfigured(): boolean {
  return Boolean(process.env.ASAAS_API_KEY?.trim());
}

function moduleNames(ids: ModuleId[]): string {
  if (ids.length === 0) return "nenhum módulo extra neste nível";
  return ids.map((id) => MODULES[id]?.name ?? id).join(", ");
}

/** Resposta sobre módulos do segmento em cada plano. */
export function getSegmentPlanFaqAnswer(seg: SegmentTemplate): string {
  const segmentModules = resolveSegmentModules(seg.id);
  const inicial = filterModulesByPlan(segmentModules, "starter");
  const profissional = filterModulesByPlan(segmentModules, "pro");

  return [
    `No plano Inicial (${formatCurrency(starter.priceMonthly!)}): ${moduleNames(inicial)} — inclui WhatsApp, Google Agenda, pagamentos, relatórios, exportação e agendamento online.`,
    `No Profissional (${formatCurrency(pro.priceMonthly!)}): ${moduleNames(profissional)} — com estoque, ordens de serviço, filiais e usuários ilimitados quando aplicável ao segmento.`,
  ].join(" ");
}

/** FAQ focada em planos e cobrança (/precos). */
export function getPricingFaqItems(): FaqItem[] {
  const billing = isBillingConfigured();
  return [
    {
      q: "Qual a diferença entre Inicial e Profissional?",
      a: `O ${starter.name} (${formatCurrency(starter.priceMonthly!)}/mês) inclui todos os módulos do seu segmento, WhatsApp, Google Agenda, pagamentos (PIX/Mercado Pago), relatórios avançados, exportação CSV/Excel, link de agendamento online e até 8 usuários em 1 unidade. O ${pro.name} (${formatCurrency(pro.priceMonthly!)}/mês) adiciona estoque, ordens de serviço, usuários ilimitados, múltiplas filiais e relatórios consolidados.`,
    },
    {
      q: "O plano Inicial inclui todos os módulos do meu segmento?",
      a: "Sim. No Inicial você já tem PDV, pets, turmas, orçamentos e demais módulos do seu nicho — além de integrações, relatórios e exportação. Estoque e ordens de serviço ficam no Profissional.",
    },
    {
      q: "Posso trocar de plano depois?",
      a: "Sim. Em Assinatura, escolha outro plano e conclua o pagamento. Ao subir de plano, novos módulos e limites liberam na hora. Se descer, o que já foi criado permanece, mas você não poderá adicionar usuários ou filiais acima do novo limite até fazer upgrade de novo.",
    },
    {
      q: "Tem fidelidade ou multa de cancelamento?",
      a: "Não. A cobrança é mensal e você cancela ou troca de plano quando quiser, sem multa. O acesso permanece até o fim do período já pago.",
    },
    {
      q: "Como funciona o pagamento?",
      a: billing
        ? "Após o cadastro você é direcionado para pagar via Asaas (PIX, boleto ou cartão). O painel libera quando o pagamento é confirmado — em geral em instantes com PIX ou cartão. A cobrança renova automaticamente todo mês."
        : "O pagamento é feito após o cadastro, na área Assinatura, via Asaas (PIX, boleto ou cartão). O acesso libera na confirmação do pagamento.",
    },
    {
      q: "Quantos usuários e filiais posso ter?",
      a: "Inicial: até 8 usuários e 1 unidade. Profissional e Enterprise: usuários e filiais ilimitados (Enterprise inclui gestão de rede sob contrato).",
    },
    {
      q: "WhatsApp e agendamento online estão em qual plano?",
      a: "Lembretes por WhatsApp, Google Agenda, pagamentos e o link público para o cliente agendar sozinho (/agendar/seu-slug) estão no plano Inicial.",
    },
    {
      q: "Consigo exportar relatórios e listas?",
      a: "Exportação CSV e Excel está incluída no plano Inicial — clientes, financeiro, agenda e outros módulos ativos.",
    },
    {
      q: "Como funciona o plano Enterprise?",
      a: "Enterprise é sob consulta para redes, franquias e operações que precisam de contrato, integrações personalizadas, SLA e gerente de conta. Fale com vendas em /suporte.",
    },
  ];
}

/** FAQ da home e suporte — agrupada por tema. */
export function getHomeFaqGroups(): FaqGroup[] {
  const billing = isBillingConfigured();
  return [
    {
      id: "comecando",
      label: "Primeiros passos",
      items: [
        {
          q: "O que muda quando escolho meu segmento?",
          a: `No cadastro você define o segmento (barbearia, restaurante, oficina, salão, clínica, escola etc.). A partir daí menus, nomenclatura — “cliente” vs “aluno”, “serviço” vs “procedimento” — campos extras e módulos sugeridos se ajustam automaticamente. São ${segmentTotal} segmentos prontos; se o seu não estiver listado, a base com clientes, agenda, serviços e financeiro continua funcionando.`,
        },
        {
          q: "Como crio a conta e quanto tempo leva?",
          a: billing
            ? "Clique em Assinar, escolha segmento e plano, preencha os dados e pague via Asaas. O painel libera assim que o pagamento confirmar — geralmente em instantes com PIX ou cartão."
            : "Escolha segmento e plano no cadastro, conclua os dados e finalize o pagamento na área Assinatura. O acesso libera na confirmação.",
        },
        {
          q: "Preciso instalar aplicativo?",
          a: "Não. O GestorPro é 100% online e responsivo: use no navegador do celular, tablet ou computador. Não há instalação nem atualização manual.",
        },
      ],
    },
    {
      id: "planos",
      label: "Planos e cobrança",
      items: [
        {
          q: "Quanto custa e qual plano escolher?",
          a: `Comece pelo ${starter.name} (${formatCurrency(starter.priceMonthly!)}/mês) — já inclui todos os módulos do segmento, integrações e relatórios. Vá de ${pro.name} (${formatCurrency(pro.priceMonthly!)}/mês) quando precisar de estoque, ordens de serviço e várias unidades. Compare em /precos.`,
        },
        {
          q: "Tem fidelidade ou multa para cancelar?",
          a: "Não. Assinatura mensal: cancele ou troque de plano quando quiser. O acesso segue até o fim do período já pago.",
        },
        {
          q: "Como pago e quando o acesso libera?",
          a: "Cobrança recorrente mensal via Asaas (PIX, boleto ou cartão). Sem pagamento confirmado o painel fica em Assinatura; após confirmar, o status fica Ativo e os módulos do plano liberam.",
        },
      ],
    },
    {
      id: "recursos",
      label: "Recursos e limites por plano",
      items: [
        {
          q: "O que cada plano libera na prática?",
          a: `Inicial: todos os módulos do segmento + WhatsApp + Google Agenda + pagamentos + relatórios + exportação (8 usuários, 1 unidade). Profissional: + estoque, ordens de serviço, filiais e usuários ilimitados, relatórios consolidados. IA e Conexões: Inicial ou superior.`,
        },
        {
          q: "Posso ter mais de uma filial?",
          a: "Múltiplas filiais no Profissional ou Enterprise. O Inicial opera com 1 unidade. Cadastre filiais em Configurações → Filiais.",
        },
        {
          q: "IA, portal do cliente e integrações funcionam?",
          a: "IA (/ia) e Integrações (/conexoes) estão no plano Inicial (e flags de ambiente quando aplicável). O portal do cliente permite acompanhar OS, orçamentos e área do responsável em educação.",
        },
        {
          q: "Consigo exportar meus dados?",
          a: "Sim — CSV e Excel no plano Inicial, em clientes, financeiro, agenda e outros módulos ativos.",
        },
      ],
    },
    {
      id: "dados",
      label: "Dados, equipe e suporte",
      items: [
        {
          q: "Meus dados ficam isolados de outros clientes?",
          a: "Sim. Cada negócio é uma organização separada no banco: clientes, financeiro e agenda não se misturam. Dentro da equipe há papéis Dono, Administrador e Membro.",
        },
        {
          q: "Como convido minha equipe?",
          a: "Em Equipe, convide por e-mail respeitando o limite do plano (8 no Inicial, ilimitado no Profissional). Ao atingir o limite, o sistema pede upgrade.",
        },
        {
          q: "Como falo com o suporte?",
          a: `Inicial e Profissional: suporte prioritário (${PLATFORM_EMAIL}). Enterprise: gerente dedicado. Canais em /suporte.`,
        },
      ],
    },
  ];
}

export function getHomeFaqItems(): FaqItem[] {
  return getHomeFaqGroups().flatMap((g) => g.items);
}

/** FAQ de conta — usada em /suporte. */
export function getAccountFaqGroup(): FaqGroup {
  return {
    id: "conta",
    label: "Conta e acesso",
    items: [
      {
        q: "Como crio a minha conta?",
        a: "Em Assinar agora, escolha segmento e plano, informe CPF/CNPJ do negócio e conclua o pagamento. Você entra direto em Assinatura se ainda não pagou; após confirmar, o painel completo libera conforme o plano.",
      },
      {
        q: "Esqueci a senha. E agora?",
        a: `Na tela de login use “Esqueci minha senha”. Se não receber o e-mail, confira spam ou fale com ${PLATFORM_EMAIL}.`,
      },
      {
        q: "Como troco de plano?",
        a: "Menu Assinatura → escolha o novo plano → Pagar e assinar. O Asaas gera a cobrança do valor mensal; os módulos e limites atualizam após confirmação.",
      },
      {
        q: "Paguei mas o painel ainda está bloqueado.",
        a: "Aguarde alguns minutos — PIX e boleto podem levar mais que cartão. Confira em Assinatura o status. Se continuar em “Aguardando pagamento”, use Rodar diagnóstico em Assinatura ou fale com o suporte.",
      },
      {
        q: "Vocês ajudam na configuração inicial?",
        a: "Inicial e Profissional incluem onboarding assistido. Enterprise tem treinamento dedicado.",
      },
    ],
  };
}

export function getSupportFaqGroups(): FaqGroup[] {
  return [getAccountFaqGroup(), ...getHomeFaqGroups()];
}

/** FAQ extra nas landing pages de segmento (além do faq do nicho). */
export function getSegmentLandingFaq(seg: SegmentTemplate): FaqItem[] {
  return [
    ...(seg.faq ?? []),
    {
      q: `Quais módulos de ${seg.label} vêm em cada plano?`,
      a: getSegmentPlanFaqAnswer(seg),
    },
    {
      q: "Preciso instalar algo?",
      a: "Não. Funciona no navegador do celular e do computador. Seus dados ficam na nuvem com login e senha.",
    },
    {
      q: "Como começo a usar para o meu negócio?",
      a: `No cadastro escolha "${seg.label}" como segmento e o plano desejado. O sistema já abre com menus e termos do nicho — ${seg.tagline.toLowerCase()}`,
    },
    {
      q: "Posso mudar de plano depois?",
      a: "Sim, sem fidelidade. Comece pelo Inicial (completo para a maioria dos negócios) e suba para Profissional quando precisar de estoque, OS e multi-unidade.",
    },
    {
      q: "Tem fidelidade ou multa?",
      a: "Não. Cobrança mensal via Asaas. Cancele ou troque quando quiser; o acesso segue até o fim do período pago.",
    },
  ];
}
