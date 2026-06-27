// Solucoes orientadas a problema (pagina /solucoes e menu "Solucoes").
// A ideia e vender a solucao do problema, nao o "sistema".

export interface Solution {
  slug: string;
  title: string;
  icon: string;
  pain: string; // o problema, na voz do cliente
  headline: string;
  description: string;
  bullets: string[];
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "organizar-financeiro",
    title: "Organizar o financeiro",
    icon: "Wallet",
    pain: "“Não sei quanto realmente sobra no fim do mês.”",
    headline: "Saiba exatamente quanto entra e quanto sai",
    description:
      "Centralize entradas e saídas, controle o caixa e veja o faturamento em tempo real, sem planilhas.",
    bullets: [
      "Contas a pagar e a receber em um só lugar",
      "Fluxo de caixa diário, semanal e mensal",
      "Relatórios de faturamento por período",
      "Visão clara do que sobra no fim do mês",
    ],
  },
  {
    slug: "controlar-clientes",
    title: "Controlar meus clientes",
    icon: "Users",
    pain: "“Perco o histórico e esqueço de dar retorno aos clientes.”",
    headline: "Toda a relação com o cliente em um lugar",
    description:
      "Histórico de atendimentos, preferências e contatos sempre à mão para atender melhor e fidelizar.",
    bullets: [
      "Cadastro completo com histórico de atendimentos",
      "Campos específicos do seu segmento",
      "Busca rápida por nome, telefone ou serviço",
      "Base pronta para campanhas e retorno",
    ],
  },
  {
    slug: "vender-mais",
    title: "Vender mais e lotar a agenda",
    icon: "TrendingUp",
    pain: "“Tenho horários vazios e clientes que somem.”",
    headline: "Encha a agenda e reduza faltas",
    description:
      "Link de agendamento, lembretes automáticos e acompanhamento de clientes para vender com previsibilidade.",
    bullets: [
      "Link público para o cliente agendar sozinho",
      "Lembretes automáticos que reduzem faltas",
      "Acompanhamento de clientes inativos",
      "Mais horários ocupados, menos buracos na agenda",
    ],
  },
  {
    slug: "reduzir-trabalho-manual",
    title: "Reduzir trabalho manual",
    icon: "Zap",
    pain: "“Perco horas com WhatsApp, papel e planilha.”",
    headline: "Menos tarefa repetitiva, mais tempo para atender",
    description:
      "Automatize confirmações, lembretes e registros para a sua equipe focar no que importa.",
    bullets: [
      "Confirmações e lembretes automáticos",
      "Registros que substituem o caderno e a planilha",
      "Tudo integrado: agenda, clientes e caixa",
      "Menos retrabalho e menos erro",
    ],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
