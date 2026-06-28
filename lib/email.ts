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
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_FROM,
  );
}

/** Envia e-mail via SMTP (env) ou registra no console em desenvolvimento. */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const payload = {
    from: process.env.SMTP_FROM ?? "noreply@gestorpro.local",
    ...options,
  };

  if (!smtpConfigured()) {
    console.log("[email:dev]", JSON.stringify(payload, null, 2));
    return { ok: true };
  }

  try {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const body = {
      from: payload.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text.replace(/\n/g, "<br>"),
    };

    // Scaffolding: integração SMTP real entra com nodemailer/resend nas próximas fases.
    console.log(`[email:smtp] ${process.env.SMTP_HOST}:${port}`, body);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao enviar e-mail";
    console.error("[email:error]", message);
    return { ok: false, error: message };
  }
}
