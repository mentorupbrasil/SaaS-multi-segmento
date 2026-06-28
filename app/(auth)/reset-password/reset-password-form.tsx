"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction, type PasswordActionState } from "../password-actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: PasswordActionState = {};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  if (!token) {
    return (
      <div className="card w-full max-w-md p-8 text-center text-sm text-red-700">
        Link inválido.{" "}
        <Link href="/forgot-password" className="font-semibold text-brand-700 hover:underline">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Nova senha</h1>
          <p className="mt-1 text-sm text-slate-500">Escolha uma senha segura para sua conta.</p>
        </div>

        {state.ok ? (
          <div className="space-y-4 p-8">
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
              {state.message}
            </p>
            <Link href="/login" className="btn-primary block w-full py-3 text-center">
              Ir para login
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4 p-8">
            <input type="hidden" name="token" value={token} />

            <div>
              <label className="label" htmlFor="password">
                Nova senha
              </label>
              <input id="password" name="password" type="password" className="input" required minLength={6} />
            </div>
            <div>
              <label className="label" htmlFor="confirmPassword">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="input"
                required
                minLength={6}
              />
            </div>

            {state.error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
            )}

            <SubmitButton className="w-full py-3 text-base" pendingText="Salvando...">
              Redefinir senha
            </SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
