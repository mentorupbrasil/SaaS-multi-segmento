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
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
        <p className="mt-1 text-sm text-slate-500">Acesse o sistema do seu negocio.</p>

        <form action={formAction} className="mt-6 space-y-4">
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
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}

          <SubmitButton className="w-full" pendingText="Entrando...">
            Entrar
          </SubmitButton>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Nao tem conta?{" "}
          <Link href="/signup" className="font-medium text-brand-700 hover:text-brand-800">
            Criar conta gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
