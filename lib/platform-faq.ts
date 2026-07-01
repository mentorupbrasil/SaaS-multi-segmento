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
const premium = PLANS.find((p) => p.id === "premium")!;

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
  const completo = filterModulesByPlan(segmentModules, "premium");

  return [
    `No plano Inicial (${formatCurrency(starter.priceMonthly!)}): ${moduleNames(inicial)}.`,
    `No Profissional (${formatCurrency(pro.priceMonthly!)}): ${moduleNames(profissional)} — inclui WhatsApp, agendamento online, relatórios e exportação.`,
    `No Premium (${formatCurrency(premium.priceMonthly!)}): ${moduleNames(completo)} — com estoque, ordens de serviço, filiais e usuários ilimitados quando aplicável ao segmento.`,
  ].join(" ");
}

/** FAQ focada em planos e cobrança (/precos). */
export function getPricingFaqItems(): FaqItem[] {
  const billing = isBillingConfigured();
  return [
    {
      q: "Qual a diferença entre Inicial, Profissional e Premium?",
      a: `O ${starter.name} (${formatCurrency(starter.priceMonthly!)}/mês) cobre o essencial: agenda, clientes, serviços, financeiro, caixa e equipe — até 2 usuários e 1 unidade. O ${pro.name} (${formatCurrency(pro.priceMonthly!)}/mês) libera todos os módulos do seu segmento (PDV, pets, turmas, orçamentos etc.), WhatsApp, link de agendamento, relatórios avançados e exportação CSV/Excel — até 8 usuários. O ${premium.name} (${formatCurrency(premium.priceMonthly!)}/mês) adiciona estoque, ordens de serviço, usuários ilimitados, múltiplas filiais e relatórios consolidados.`,
    },
    {
      q: "O plano Inicial inclui todos os módulos do meu segmento?",
      a: "Não. O Inicial é para começar enxuto: operação do dia a dia com agenda, clientes, serviços, financeiro e caixa. Módulos avançados do segmento — como PDV, pets, turmas, veículos ou orçamentos — liberam no Profissional. Estoque e ordens de serviço ficam no Premium.",
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
      a: "Inicial: até 2 usuários e 1 unidade. Profissional: até 8 usuários e 1 unidade. Premium e Enterprise: usuários e filiais ilimitados (Enterprise inclui gestão de rede sob contrato).",
    },
    {
      q: "WhatsApp e agendamento online estão em qual plano?",
      a: "Lembretes por WhatsApp e o link público para o cliente agendar sozinho (/agendar/seu-slug) estão no Profissional ou superior. No Inicial você opera pelo painel interno; para automação e captação online, faça upgrade.",
    },
    {
      q: "Consigo exportar relatórios e listas?",
      a: "Exportação CSV e Excel está no Profissional ou superior. No Inicial você usa o painel normalmente, mas os botões de exportação pedem upgrade — e a API também bloqueia sem o plano correto.",
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
          a: `Comece pelo ${starter.name} (${formatCurrency(starter.priceMonthly!)}/mês) se você é MEI ou dupla e quer agenda + caixa. Vá de ${pro.name} (${formatCurrency(pro.priceMonthly!)}/mês) quando precisar de todos os módulos do segmento, WhatsApp, agendamento online e exportação. O ${premium.name} (${formatCurrency(premium.priceMonthly!)}/mês) é para quem precisa de estoque, ordens de serviço e várias unidades. Compare tudo em /precos.`,
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
          a: `Inicial: agenda, clientes, serviços, financeiro, caixa, equipe (2 usuários, 1 unidade). Profissional: tudo do segmento + WhatsApp + agendamento público + relatórios + exportação (8 usuários). Premium: + estoque, ordens de serviço, filiais e usuários ilimitados, relatórios consolidados. IA e Conexões: Profissional ou superior.`,
        },
        {
          q: "Posso ter mais de uma filial?",
          a: "Múltiplas filiais no Premium ou Enterprise. Inicial e Profissional operam com 1 unidade. Cadastre filiais em Configurações → Filiais.",
        },
        {
          q: "IA, portal do cliente e integrações funcionam?",
          a: "IA (/ia) e Integrações (/conexoes) exigem plano Profissional ou superior (e flags de ambiente quando aplicável). O portal do cliente permite acompanhar OS, orçamentos e área do responsável em educação. A IA gera resumos; com chave OpenAI configurada usa modelo real.",
        },
        {
          q: "Consigo exportar meus dados?",
          a: "Sim, a partir do Profissional — CSV e Excel em clientes, financeiro, agenda e outros módulos ativos. No Inicial o painel funciona, mas exportação exige upgrade.",
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
          a: "Em Equipe, convide por e-mail respeitando o limite do plano (2 no Inicial, 8 no Profissional, ilimitado no Premium). Ao atingir o limite, o sistema pede upgrade.",
        },
        {
          q: "Como falo com o suporte?",
          a: `Inicial: e-mail (${PLATFORM_EMAIL}). Profissional e Premium: prioridade na fila. Enterprise: gerente dedicado. Canais em /suporte.`,
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
        a: "Profissional e Premium incluem onboarding assistido. Enterprise tem treinamento dedicado. No Inicial você configura pelo painel com artigos em /suporte e /blog.",
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
      a: "Sim, sem fidelidade. Comece pelo Inicial e suba para Profissional quando precisar de módulos extras do segmento, ou Premium para estoque e multi-unidade.",
    },
    {
      q: "Tem fidelidade ou multa?",
      a: "Não. Cobrança mensal via Asaas. Cancele ou troque quando quiser; o acesso segue até o fim do período pago.",
    },
  ];
}
