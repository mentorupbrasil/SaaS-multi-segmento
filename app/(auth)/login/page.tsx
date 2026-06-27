"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "../actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {};

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="w-full max-w-md">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-slate-500">Acesse o sistema do seu negócio.</p>
        </div>

        <form action={formAction} className="space-y-4 p-8">
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
            <input id="password" name="password" type="password" className="input" placeholder="Sua senha" required />
          </div>

          {state.error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
          )}

          <SubmitButton className="w-full py-3 text-base" pendingText="Entrando...">
            Entrar
          </SubmitButton>

          <p className="text-center text-sm text-slate-500">
            Não tem conta?{" "}
            <Link href="/signup" className="font-semibold text-brand-700 hover:text-brand-800">
              Criar minha conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
