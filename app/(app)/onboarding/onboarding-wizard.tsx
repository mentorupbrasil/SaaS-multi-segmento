"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  onboardingCreateService,
  onboardingEnableBooking,
  completeOnboarding,
  type FormResult,
} from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface OnboardingWizardProps {
  orgName: string;
  segmentLabel: string;
}

export function OnboardingWizard({ orgName, segmentLabel }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [serviceState, serviceAction] = useActionState(onboardingCreateService, initial);
  const [bookingState, bookingAction] = useActionState(onboardingEnableBooking, initial);
  const router = useRouter();

  useEffect(() => {
    if (serviceState.ok) setStep(3);
  }, [serviceState.ok]);

  useEffect(() => {
    if (bookingState.ok) {
      completeOnboarding();
    }
  }, [bookingState.ok]);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              s === step
                ? "bg-brand-600 text-white"
                : s < step
                  ? "bg-brand-100 text-brand-700"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card p-8 text-center">
          <Icon name="Sparkles" className="mx-auto mb-4 h-12 w-12 text-brand-600" />
          <h2 className="mb-2 text-xl font-semibold">Bem-vindo ao GestorPro!</h2>
          <p className="mb-6 text-sm text-slate-600">
            Sua conta <strong>{orgName}</strong> está pronta no segmento{" "}
            <strong>{segmentLabel}</strong>. Vamos configurar o essencial em 3 passos.
          </p>
          <button type="button" className="btn-primary" onClick={() => setStep(2)}>
            Começar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card p-6">
          <h2 className="mb-2 text-lg font-semibold">Passo 2: Primeiro serviço</h2>
          <p className="mb-4 text-sm text-slate-500">
            Cadastre um serviço ou pule para configurar depois.
          </p>
          <form action={serviceAction} className="grid gap-4">
            <div>
              <label className="label">Nome do serviço</label>
              <input name="name" className="input" placeholder="Ex: Corte masculino" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Preço (R$)</label>
                <input name="price" type="number" step="0.01" className="input" defaultValue={0} />
              </div>
              <div>
                <label className="label">Duração (min)</label>
                <input name="durationMin" type="number" className="input" defaultValue={30} />
              </div>
            </div>
            {serviceState.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serviceState.error}</p>
            )}
            <div className="flex gap-2">
              <SubmitButton>Salvar serviço</SubmitButton>
              <button type="button" className="btn-secondary" onClick={() => setStep(3)}>
                Pular
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="card p-6">
          <h2 className="mb-2 text-lg font-semibold">Passo 3: Agendamento online</h2>
          <p className="mb-4 text-sm text-slate-500">
            Permita que clientes agendem pelo link público.
          </p>
          <form action={bookingAction} className="grid gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="publicBookingEnabled"
                value="true"
                defaultChecked
                className="rounded border-slate-300"
              />
              Habilitar agendamento online agora
            </label>
            {bookingState.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{bookingState.error}</p>
            )}
            <div className="flex gap-2">
              <SubmitButton>Concluir</SubmitButton>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => completeOnboarding()}
              >
                Pular e ir ao painel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
