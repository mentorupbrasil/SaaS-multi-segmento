"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type PasswordActionState } from "../password-actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: PasswordActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  return (
    <div className="w-full max-w-md">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Esqueci minha senha</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {state.ok ? (
          <div className="space-y-4 p-8">
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
              {state.message}
            </p>
            <Link href="/login" className="btn-primary block w-full py-3 text-center">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4 p-8">
            <div>
              <label className="label" htmlFor="email">
                E-mail
              </label>
              <input id="email" name="email" type="email" className="input" required />
            </div>

            {state.error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
            )}

            <SubmitButton className="w-full py-3 text-base" pendingText="Enviando...">
              Enviar link
            </SubmitButton>

            <p className="text-center text-sm text-slate-500">
              <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                Voltar ao login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
