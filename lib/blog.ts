// Blog estatico (conteudo de SEO orientado a segmento e problema).

export interface BlogBlock {
  type: "p" | "h2" | "list";
  text?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readMinutes: number;
  cover: string; // nome de icone
  body: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "melhor-sistema-para-salao-de-beleza",
    title: "Como escolher o melhor sistema para salão de beleza em 2026",
    excerpt:
      "Agenda lotada, comissões e clientes fiéis: veja o que um bom sistema precisa ter para o seu salão.",
    category: "Beleza & Estética",
    date: "2026-06-10",
    readMinutes: 6,
    cover: "Sparkles",
    body: [
      {
        type: "p",
        text: "Gerir um salão de beleza é equilibrar agenda, equipe, comissões e a experiência do cliente — tudo ao mesmo tempo. Um bom sistema deve tirar esse peso das suas costas, não adicionar mais trabalho.",
      },
      { type: "h2", text: "O que realmente importa em um sistema para salão" },
      {
        type: "list",
        items: [
          "Agenda por profissional, com bloqueio de horários e visão do dia inteiro.",
          "Cálculo de comissão por profissional e por serviço.",
          "Histórico de cada cliente: o que fez, com quem e quando.",
          "Lembretes automáticos para reduzir faltas.",
          "Controle financeiro simples, sem depender de planilha.",
        ],
      },
      { type: "h2", text: "Por que a linguagem do sistema faz diferença" },
      {
        type: "p",
        text: "Um sistema genérico chama tudo de “item” e “recurso”. Um sistema feito para salão fala de profissionais, serviços e comissões. Essa diferença reduz a curva de aprendizado da equipe e evita erros no dia a dia.",
      },
      {
        type: "p",
        text: "No GestorPro, ao escolher o segmento “Salão de beleza”, a plataforma já vem com os termos, os serviços e os campos certos para o seu negócio.",
      },
    ],
  },
  {
    slug: "como-organizar-a-gestao-de-uma-oficina-mecanica",
    title: "Como organizar a gestão de uma oficina mecânica",
    excerpt:
      "Ordens de serviço, peças e histórico de veículos: um passo a passo para tirar a oficina do caderno.",
    category: "Automotivo",
    date: "2026-06-03",
    readMinutes: 7,
    cover: "Car",
    body: [
      {
        type: "p",
        text: "Muitas oficinas ainda controlam ordens de serviço no caderno ou em grupos de WhatsApp. Funciona até o dia em que um orçamento se perde ou um cliente cobra um serviço que ninguém registrou.",
      },
      { type: "h2", text: "Comece pela ordem de serviço" },
      {
        type: "p",
        text: "A ordem de serviço é o coração da oficina. Ela conecta o veículo, o cliente, as peças e a mão de obra. Centralizar isso em um sistema dá previsibilidade e evita retrabalho.",
      },
      { type: "h2", text: "Os 4 pilares de uma oficina organizada" },
      {
        type: "list",
        items: [
          "Cadastro de veículos vinculado ao cliente (placa, modelo, ano).",
          "Ordens de serviço com itens, status e valor.",
          "Controle de peças e produtos usados.",
          "Financeiro com entradas, saídas e fluxo de caixa.",
        ],
      },
      {
        type: "p",
        text: "Com o GestorPro no segmento “Oficina”, esses pilares já vêm configurados, com a nomenclatura do setor.",
      },
    ],
  },
  {
    slug: "sistema-para-clinica-o-que-considerar",
    title: "Sistema para clínica: o que considerar antes de contratar",
    excerpt:
      "Prontuário, agenda de profissionais e dados de pacientes em segurança. Veja os pontos de atenção.",
    category: "Saúde & Bem-estar",
    date: "2026-05-27",
    readMinutes: 5,
    cover: "Stethoscope",
    body: [
      {
        type: "p",
        text: "Em uma clínica, organização e segurança dos dados andam juntas. O sistema precisa facilitar o atendimento sem comprometer a privacidade do paciente.",
      },
      { type: "h2", text: "Pontos de atenção" },
      {
        type: "list",
        items: [
          "Prontuário com histórico de atendimentos por paciente.",
          "Agenda por profissional e por sala.",
          "Controle de acesso: cada pessoa vê apenas o que precisa.",
          "Dados isolados por clínica, com ambiente próprio.",
        ],
      },
      {
        type: "p",
        text: "O GestorPro isola os dados de cada negócio em seu próprio ambiente e permite definir permissões por papel, o que ajuda a manter a confidencialidade do prontuário.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
