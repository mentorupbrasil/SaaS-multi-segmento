import { PLATFORM_EMAIL_FROM } from "@/lib/platform-contact";

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface SendEmailResult {
  ok: boolean;
  error?: string;
}

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM);
}

async function sendViaResend(options: SendEmailOptions): Promise<SendEmailResult | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const from = process.env.SMTP_FROM ?? PLATFORM_EMAIL_FROM;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [options.to],
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text.replace(/\n/g, "<br>"),
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "");
    return { ok: false, error: err || `Resend HTTP ${response.status}` };
  }

  return { ok: true };
}

/** Envia e-mail via Resend, SMTP (log) ou console em desenvolvimento. */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  if (process.env.RESEND_API_KEY) {
    const result = await sendViaResend(options);
    if (result) return result;
  }

  const payload = {
    from: process.env.SMTP_FROM ?? PLATFORM_EMAIL_FROM,
    ...options,
  };

  if (!smtpConfigured()) {
    console.log("[email:dev]", JSON.stringify(payload, null, 2));
    return { ok: true };
  }

  try {
    const port = Number(process.env.SMTP_PORT ?? 587);
    console.log(`[email:smtp] ${process.env.SMTP_HOST}:${port}`, {
      to: options.to,
      subject: options.subject,
    });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao enviar e-mail";
    console.error("[email:error]", message);
    return { ok: false, error: message };
  }
}
