import type { Metadata } from "next";
import { LegalContent } from "@/components/marketing/legal-content";
import { PLATFORM_EMAIL } from "@/lib/platform-contact";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Termos de uso da plataforma GestorPro.",
};

export default function TermosPage() {
  return (
    <LegalContent
      eyebrow="Legal"
      title="Termos de uso"
      updatedAt="27 de junho de 2026"
      intro="Estes Termos de Uso regulam o acesso e a utilização da plataforma GestorPro. Ao criar uma conta e usar o serviço, você concorda com as condições descritas abaixo."
      sections={[
        {
          heading: "Aceitação dos termos",
          paragraphs: [
            "Ao se cadastrar e utilizar o GestorPro, você declara que leu, entendeu e concorda com estes Termos de Uso e com a nossa Política de Privacidade.",
            "Caso não concorde com qualquer condição, você não deve utilizar a plataforma.",
          ],
        },
        {
          heading: "Conta e responsabilidades",
          paragraphs: [
            "Você é responsável por manter a confidencialidade dos dados de acesso da sua conta e por todas as atividades realizadas por ela.",
            "Os dados cadastrados são de responsabilidade do titular da conta, que deve garantir a veracidade das informações inseridas.",
          ],
        },
        {
          heading: "Assinatura e pagamento",
          paragraphs: [
            "O GestorPro é oferecido mediante assinatura mensal, conforme o plano escolhido. A assinatura é renovada automaticamente a cada período.",
            "Não há fidelidade: você pode trocar de plano ou cancelar a qualquer momento, sem multa. O cancelamento encerra a renovação seguinte.",
          ],
        },
        {
          heading: "Uso aceitável",
          paragraphs: [
            "É proibido utilizar a plataforma para fins ilícitos, para violar direitos de terceiros ou de forma que comprometa a segurança e a estabilidade do serviço.",
          ],
        },
        {
          heading: "Disponibilidade do serviço",
          paragraphs: [
            "Empenhamo-nos para manter o serviço disponível de forma contínua, mas podem ocorrer interrupções para manutenção ou por fatores fora do nosso controle.",
          ],
        },
        {
          heading: "Alterações nos termos",
          paragraphs: [
            "Estes termos podem ser atualizados periodicamente. Mudanças relevantes serão comunicadas, e o uso continuado da plataforma implica concordância com a versão vigente.",
          ],
        },
        {
          heading: "Contato",
          paragraphs: [
            `Dúvidas sobre estes termos: ${PLATFORM_EMAIL}`,
          ],
        },
      ]}
    />
  );
}
