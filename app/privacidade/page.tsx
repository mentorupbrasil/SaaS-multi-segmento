import type { Metadata } from "next";
import { LegalContent } from "@/components/marketing/legal-content";
import { PLATFORM_EMAIL } from "@/lib/platform-contact";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Política de privacidade da plataforma GestorPro e tratamento de dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <LegalContent
      eyebrow="Legal"
      title="Política de privacidade"
      updatedAt="27 de junho de 2026"
      intro="Esta Política de Privacidade descreve como o GestorPro coleta, usa e protege os dados pessoais e as informações do seu negócio, em conformidade com a Lei Geral de Proteção de Dados (LGPD)."
      sections={[
        {
          heading: "Dados que coletamos",
          paragraphs: [
            "Coletamos os dados fornecidos por você no cadastro (como nome, e-mail e dados do negócio) e os dados gerados pelo uso da plataforma (clientes, agendamentos e lançamentos financeiros que você registra).",
          ],
        },
        {
          heading: "Como usamos os dados",
          paragraphs: [
            "Utilizamos os dados para fornecer e melhorar o serviço, autenticar o acesso, processar a assinatura e oferecer suporte.",
            "Não vendemos os seus dados nem os de seus clientes a terceiros.",
          ],
        },
        {
          heading: "Isolamento e segurança",
          paragraphs: [
            "Cada negócio possui um ambiente isolado: os dados de uma conta não são acessíveis por outra.",
            "Adotamos medidas técnicas e organizacionais para proteger as informações contra acesso não autorizado, perda ou alteração indevida.",
          ],
        },
        {
          heading: "Compartilhamento",
          paragraphs: [
            "Podemos compartilhar dados apenas com prestadores essenciais à operação do serviço (como hospedagem em nuvem e processamento de pagamentos), sempre com obrigações de confidencialidade.",
          ],
        },
        {
          heading: "Seus direitos",
          paragraphs: [
            "Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais, bem como a portabilidade, conforme previsto na LGPD.",
            "Para exercer esses direitos, entre em contato pelo e-mail " + PLATFORM_EMAIL + ".",
          ],
        },
        {
          heading: "Retenção de dados",
          paragraphs: [
            "Mantemos os seus dados enquanto a conta estiver ativa. Após o cancelamento, os dados podem ser mantidos pelo período necessário para cumprir obrigações legais e, em seguida, eliminados.",
          ],
        },
      ]}
    />
  );
}
