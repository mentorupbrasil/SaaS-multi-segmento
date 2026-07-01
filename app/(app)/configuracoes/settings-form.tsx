"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateOrganizationSettings, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";

const initial: FormResult = {};

interface SettingsFormProps {
  defaultName: string;
  defaultBookingSlug: string;
  defaultBookingEnabled: boolean;
  canPublicBooking: boolean;
  termKeys: { key: string; label: string; value: string }[];
}

export function SettingsForm({
  defaultName,
  defaultBookingSlug,
  defaultBookingEnabled,
  canPublicBooking,
  termKeys,
}: SettingsFormProps) {
  const [state, action] = useActionState(updateOrganizationSettings, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action} className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold">Negócio</h2>
        <div className="grid gap-4">
          <div>
            <label className="label">Nome do negócio</label>
            <input name="name" className="input" defaultValue={defaultName} required />
          </div>
        </div>
      </div>

      {canPublicBooking ? (
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Agendamento público</h2>
          <div className="grid gap-4">
            <div>
              <label className="label">Slug público</label>
              <input
                name="publicBookingSlug"
                className="input"
                defaultValue={defaultBookingSlug}
                placeholder="minha-barbearia"
              />
              <p className="mt-1 text-xs text-muted-foreground">URL: /agendar/seu-slug</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="publicBookingEnabled"
                value="true"
                defaultChecked={defaultBookingEnabled}
                className="rounded border-border"
              />
              Habilitar agendamento online
            </label>
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="mb-2 text-lg font-semibold">Agendamento público</h2>
          <p className="text-sm text-muted-foreground">
            Link para clientes agendarem sozinhos está disponível a partir do plano{" "}
            <strong>Profissional</strong>.
          </p>
          <Link href="/assinatura" className="mt-3 inline-block text-sm font-semibold text-primary underline">
            Fazer upgrade
          </Link>
        </div>
      )}

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold">Nomenclatura personalizada</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Sobrescreva termos do segmento. Deixe em branco para usar o padrão.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {termKeys.map(({ key, label, value }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input name={`term_${key}`} className="input" defaultValue={value} placeholder={label} />
            </div>
          ))}
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Configurações salvas.
        </p>
      )}

      <SubmitButton>Salvar configurações</SubmitButton>
    </form>
  );
}
