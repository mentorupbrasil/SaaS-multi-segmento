import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAuthContext } from "@/lib/auth-context";

const MOCK_SUMMARY =
  "Resumo simulado: receita estável, 12 agendamentos na semana e taxa de no-show em 8%. Ative OPENAI_API_KEY para insights reais.";

async function generateOpenAiSummary(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurada");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de negócios. Responda em português do Brasil, de forma objetiva e acionável.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() ?? MOCK_SUMMARY;
}

export async function POST(request: Request) {
  if (process.env.FEATURE_IA !== "true") {
    return NextResponse.json(
      { error: "Recurso de IA não habilitado (FEATURE_IA)." },
      { status: 403 },
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: { prompt?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const ctx = await getAuthContext();
  const prompt =
    body.prompt ??
    `Gere um resumo executivo semanal para o negócio "${ctx.organization.name}" (segmento ${ctx.organization.segmentId}).`;

  try {
    const summary = process.env.OPENAI_API_KEY
      ? await generateOpenAiSummary(prompt)
      : MOCK_SUMMARY;

    return NextResponse.json({
      summary,
      source: process.env.OPENAI_API_KEY ? "openai" : "mock",
      organizationId: ctx.orgId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar resumo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
