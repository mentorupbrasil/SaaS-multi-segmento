"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";

export function IaInsightsClient() {
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao gerar resumo.");
        return;
      }
      setSummary(data.summary);
      setSource(data.source);
    } catch {
      setError("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Insights com IA"
        description="Resumos automáticos sobre desempenho e oportunidades do negócio."
      />

      <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-6">
        <div>
          <label className="label" htmlFor="prompt">
            Pergunta ou contexto (opcional)
          </label>
          <textarea
            id="prompt"
            className="input min-h-[100px]"
            placeholder="Ex.: Quais são os principais riscos na agenda desta semana?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary px-6 py-2.5" disabled={loading}>
          {loading ? "Gerando..." : "Gerar resumo"}
        </button>
      </form>

      {error && (
        <div className="card mb-6 border-red-100 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      )}

      {summary && (
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Icon name="Sparkles" className="h-4 w-4 text-brand-600" />
            Resumo {source === "openai" ? "via OpenAI" : "simulado (dev)"}
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{summary}</p>
        </div>
      )}

      {!summary && !error && !loading && (
        <div className="card flex flex-col items-center px-8 py-12 text-center">
          <Icon name="Sparkles" className="h-10 w-10 text-brand-400" />
          <p className="mt-4 text-sm text-slate-500">
            Configure <code className="text-xs">FEATURE_IA=true</code> e opcionalmente{" "}
            <code className="text-xs">OPENAI_API_KEY</code> no ambiente.
          </p>
        </div>
      )}
    </div>
  );
}
