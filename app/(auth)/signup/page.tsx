"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ALL_SEGMENTS } from "@/segments";
import { signupAction, type ActionState } from "../actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const initialState: ActionState = {};

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, initialState);
  const [segmentId, setSegmentId] = useState<string>("");

  return (
    <div className="w-full max-w-3xl">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-900">Crie a conta do seu negocio</h1>
        <p className="mt-1 text-sm text-slate-500">
          Escolha o seu segmento e o sistema se adapta a voce. 14 dias de teste gratis.
        </p>

        <form action={formAction} className="mt-6 space-y-6">
          <div>
            <span className="label">Qual e o seu segmento?</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ALL_SEGMENTS.map((seg) => (
                <button
                  type="button"
                  key={seg.id}
                  onClick={() => setSegmentId(seg.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors",
                    segmentId === seg.id
                      ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                      : "border-slate-200 bg-white hover:border-brand-300",
                  )}
                >
                  <Icon name={seg.icon} className="h-6 w-6 text-brand-600" />
                  <span className="text-sm font-medium text-slate-700">{seg.label}</span>
                </button>
              ))}
            </div>
            <input type="hidden" name="segmentId" value={segmentId} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="businessName">
                Nome do negocio
              </label>
              <input id="businessName" name="businessName" className="input" placeholder="Ex.: Barbearia do Joao" required />
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
              <input id="password" name="password" type="password" className="input" placeholder="Minimo 6 caracteres" required />
            </div>
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}

          <SubmitButton className="w-full" pendingText="Criando conta...">
            Criar conta gratis
          </SubmitButton>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Ja tem conta?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:text-brand-800">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
