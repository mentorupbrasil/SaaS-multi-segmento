"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { getSegmentGroups } from "@/segments";
import { PAYABLE_PLANS } from "@/lib/plans";
import { signupAction, type ActionState } from "../actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";
import { cn, formatCurrency } from "@/lib/utils";

const initialState: ActionState = {};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, initialState);
  const [segmentId, setSegmentId] = useState<string>("");
  const [planId, setPlanId] = useState<string>("pro");
  const [query, setQuery] = useState<string>("");

  const groups = useMemo(() => {
    const q = normalize(query.trim());
    return getSegmentGroups()
      .map((g) => ({
        ...g,
        segments: q
          ? g.segments.filter(
              (s) => normalize(s.label).includes(q) || normalize(s.tagline).includes(q),
            )
          : g.segments,
      }))
      .filter((g) => g.segments.length > 0);
  }, [query]);

  return (
    <div className="w-full max-w-4xl">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Crie a conta do seu negócio</h1>
          <p className="mt-1 text-sm text-slate-500">
            Escolha o seu segmento e o plano. Sua conta já fica ativa e pronta para usar.
          </p>
        </div>

        <form action={formAction} className="space-y-8 p-8">
          {/* Seletor de segmento */}
          <div>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="label mb-0">1. Qual é o seu segmento?</span>
              <input
                type="search"
                placeholder="Buscar segmento..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input sm:max-w-xs"
              />
            </div>

            <div className="max-h-72 space-y-5 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              {groups.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                  Nenhum segmento encontrado. Você ainda pode criar a conta e personalizar depois.
                </p>
              )}
              {groups.map((group) => (
                <div key={group.category}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {group.segments.map((seg) => (
                      <button
                        type="button"
                        key={seg.id}
                        onClick={() => setSegmentId(seg.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border bg-white p-3 text-left transition-all",
                          segmentId === seg.id
                            ? "border-brand-600 ring-1 ring-brand-600"
                            : "border-slate-200 hover:border-brand-300",
                        )}
                      >
                        <Icon name={seg.icon} className="h-5 w-5 shrink-0 text-brand-600" />
                        <span className="truncate text-sm font-medium text-slate-700">
                          {seg.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <input type="hidden" name="segmentId" value={segmentId} />
          </div>

          {/* Seletor de plano */}
          <div>
            <span className="label">2. Escolha o seu plano</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYABLE_PLANS.map((plan) => {
                const selected = planId === plan.id;
                return (
                  <button
                    type="button"
                    key={plan.id}
                    onClick={() => setPlanId(plan.id)}
                    className={cn(
                      "relative rounded-xl border bg-white p-4 text-left transition-all",
                      selected
                        ? "border-brand-600 ring-1 ring-brand-600"
                        : "border-slate-200 hover:border-brand-300",
                    )}
                  >
                    {plan.badge && (
                      <span
                        className={cn(
                          "absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white",
                          plan.highlight ? "bg-brand-600" : "bg-slate-900",
                        )}
                      >
                        {plan.badge}
                      </span>
                    )}
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{plan.name}</span>
                      {selected && <Check className="h-4 w-4 text-brand-600" />}
                    </span>
                    <span className="mt-1 block">
                      <span className="text-xl font-bold text-slate-900">
                        {formatCurrency(plan.priceMonthly as number)}
                      </span>
                      <span className="text-xs text-slate-500">/mês</span>
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-slate-500">
                      {plan.description}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Sem fidelidade. Você pode trocar de plano ou cancelar quando quiser nas configurações.
              Rede ou franquia?{" "}
              <Link href="/suporte" className="font-semibold text-brand-700 hover:text-brand-800">
                Fale com o time sobre o Enterprise
              </Link>
              .
            </p>
            <input type="hidden" name="planId" value={planId} />
          </div>

          {/* Dados */}
          <div>
            <span className="label">3. Seus dados</span>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="businessName">
                  Nome do negócio
                </label>
                <input id="businessName" name="businessName" className="input" placeholder="Ex.: Barbearia do João" required />
              </div>
              <div>
                <label className="label" htmlFor="name">
                  Seu nome
                </label>
                <input id="name" name="name" className="input" placeholder="Seu nome completo" required />
              </div>
              <div>
                <label className="label" htmlFor="email">
                  E-mail
                </label>
                <input id="email" name="email" type="email" className="input" placeholder="voce@email.com" required />
              </div>
              <div>
                <label className="label" htmlFor="password">
                  Senha
                </label>
                <input id="password" name="password" type="password" className="input" placeholder="Mínimo 6 caracteres" required />
              </div>
            </div>
          </div>

          {state.error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
          )}

          <SubmitButton className="w-full py-3 text-base" pendingText="Criando conta...">
            Criar conta e começar
          </SubmitButton>

          <p className="text-center text-sm text-slate-500">
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
