import type { FaqGroup } from "@/components/marketing/faq";
import { getSegmentTotal } from "@/lib/segment-vitrine";
import { PLANS } from "@/lib/plans";
import { formatCurrency } from "@/lib/utils";

const segmentTotal = getSegmentTotal();
const starter = PLANS.find((p) => p.id === "starter")!;
const pro = PLANS.find((p) => p.id === "pro")!;
const premium = PLANS.find((p) => p.id === "premium")!;

/** FAQs principais da plataforma (suporte, preços, etc.). */
export function getHomeFaqGroups(): FaqGroup[] {
  return [
    {
      id: "comecando",
      label: "Primeiros passos",
      items: [
        {
          q: "O que muda quando escolho meu segmento?",
          a: `No cadastro você define o segmento (barbearia, clínica, restaurante, escola, etc.). A partir daí menus, nomenclatura — como “cliente” vs “aluno”, “serviço” vs “procedimento” — campos extras e módulos sugeridos se ajustam automaticamente. Hoje são ${segmentTotal} segmentos prontos; se o seu não estiver listado, a operação base com clientes, agenda, serviços e financeiro continua funcionando.`,
        },
        {
          q: "Quanto tempo leva para a conta ficar pronta?",
          a: "Após o cadastro, você conclui o pagamento via Asaas. O acesso ao painel é liberado assim que o pagamento for confirmado (geralmente em instantes com PIX ou cartão).",
        },
        {
          q: "Funciona no celular?",
          a: "Sim. O GestorPro é 100% online e responsivo: acesse pelo navegador do celular, tablet ou computador — agenda, clientes e caixa de qualquer lugar com internet. Não é necessário instalar nada.",
        },
      ],
    },
    {
      id: "planos",
      label: "Planos e cobrança",
      items: [
        {
          q: "Quanto custa e qual plano escolher?",
          a: `O ${starter.name} (${formatCurrency(starter.priceMonthly!)}/mês) inclui agenda, clientes, serviços, financeiro e caixa — até 2 usuários e 1 unidade. O ${pro.name} (${formatCurrency(pro.priceMonthly!)}/mês) libera todos os módulos do segmento, WhatsApp, agendamento online, relatórios e exportação — até 8 usuários. O ${premium.name} (${formatCurrency(premium.priceMonthly!)}/mês) adiciona estoque, ordens de serviço, filiais e usuários ilimitados. Enterprise é sob consulta para redes. Veja a comparação na página Preços.`,
        },
        {
          q: "Tem fidelidade ou multa para cancelar?",
          a: "Não. A assinatura é mensal e você cancela ou troca de plano quando quiser, sem multa e sem burocracia. O acesso permanece até o fim do período já pago.",
        },
        {
          q: "Como pago a assinatura?",
          a: "A cobrança recorrente mensal é feita via Asaas (PIX, boleto ou cartão). Você escolhe o plano, conclui o cadastro e o acesso é liberado assim que o pagamento for confirmado.",
        },
      ],
    },
    {
      id: "recursos",
      label: "Recursos e limites",
      items: [
        {
          q: "WhatsApp e link de agendamento vêm em qual plano?",
          a: "Lembretes por WhatsApp, link público de agendamento, relatórios avançados, exportação CSV/Excel e painel de Conexões/IA fazem parte do plano Profissional ou superior. O Inicial foca no essencial: agenda, clientes, serviços, financeiro e caixa — ideal para começar enxuto.",
        },
        {
          q: "Posso ter mais de uma unidade ou filial?",
          a: "Múltiplas filiais estão no plano Premium (e Enterprise para redes). O Inicial e o Profissional operam com 1 unidade. Limites de usuários também variam: 2 no Inicial, 8 no Profissional, ilimitados no Premium.",
        },
        {
          q: "IA e portal do cliente já funcionam?",
          a: "Sim, como recursos do produto — liberados conforme plano (Profissional+) e configuração do ambiente. O portal permite acompanhar OS, orçamentos e área do responsável (educação). A IA gera resumos do negócio; com chave OpenAI configurada as respostas usam modelo real; sem chave, exibe insights simulados para orientação.",
        },
      ],
    },
    {
      id: "dados",
      label: "Dados e suporte",
      items: [
        {
          q: "Meus dados ficam separados de outros assinantes?",
          a: "Sim. Cada negócio roda em organização isolada: sua base de clientes, financeiro e agenda não se mistura com a de outros clientes da plataforma. O acesso ao painel exige login; dentro da equipe, papéis Dono, Administrador e Membro definem quem vê e edita o quê.",
        },
        {
          q: "Consigo exportar meus dados?",
          a: "Sim — a partir do plano Profissional. Várias telas permitem exportar listas em CSV/Excel (clientes, financeiro, agenda etc.). No plano Inicial o painel continua disponível, mas a exportação exige upgrade.",
        },
        {
          q: "Como falo com o suporte?",
          a: "Planos Inicial têm suporte por e-mail. Profissional e Premium têm prioridade na fila. Enterprise inclui onboarding e gerente dedicado. Canais e horários estão na página Suporte.",
        },
      ],
    },
  ];
}

/** Lista plana (compatibilidade). */
export function getHomeFaqItems() {
  return getHomeFaqGroups().flatMap((g) => g.items);
}
