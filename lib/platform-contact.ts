/** Contatos oficiais da plataforma (marketing, suporte, vendas, legal). */

export const PLATFORM_EMAIL = "contato@gestorpro.sbs";
export const PLATFORM_MAILTO = `mailto:${PLATFORM_EMAIL}`;
export const PLATFORM_SITE_URL = "https://www.gestorpro.sbs";

/** Remetente padrão para e-mails transacionais (Resend/SMTP). */
export const PLATFORM_EMAIL_FROM = `GestorPro <noreply@gestorpro.sbs>`;

/** Dígitos apenas, ex.: 5511999999999 — opcional via NEXT_PUBLIC_WHATSAPP_NUMBER. */
export function getWhatsAppNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (!raw || raw.length < 10) return null;
  return raw;
}

export function getWhatsAppUrl(): string | null {
  const number = getWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}`;
}

export interface SupportChannel {
  icon: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  external?: boolean;
}

/** Canais exibidos em /suporte e CTAs de contato. */
export function getSupportChannels(): SupportChannel[] {
  const channels: SupportChannel[] = [
    {
      icon: "Mail",
      title: "E-mail",
      text: PLATFORM_EMAIL,
      href: PLATFORM_MAILTO,
      cta: "Enviar e-mail",
    },
  ];

  const wa = getWhatsAppUrl();
  if (wa) {
    channels.push({
      icon: "MessageCircle",
      title: "WhatsApp",
      text: "Atendimento em horário comercial",
      href: wa,
      cta: "Abrir conversa",
      external: true,
    });
  }

  channels.push({
    icon: "BookOpen",
    title: "Blog",
    text: "Artigos sobre gestão e uso da plataforma",
    href: "/blog",
    cta: "Ver conteúdos",
  });

  return channels;
}
