"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "../actions";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20">
        <CardHeader className="border-b border-border bg-muted/30 pb-6">
          <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
          <CardDescription>Acesse o sistema do seu negócio.</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="voce@email.com" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" placeholder="Sua senha" required autoComplete="current-password" />
              <p className="text-right text-xs">
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </p>
            </div>

            {state.error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                {state.error}
              </p>
            )}

            <SubmitButton className="btn-primary w-full py-3 text-base" pendingText="Entrando...">
              Entrar
            </SubmitButton>

            <p className="text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Criar minha conta
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
