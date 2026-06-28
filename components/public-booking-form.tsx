"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { SubmitButton } from "@/components/submit-button";
import { formatCurrency } from "@/lib/utils";
import {
  createPublicAppointment,
  type PublicBookingResult,
} from "@/lib/public-booking";

const initialState: PublicBookingResult = {};

interface PublicBookingFormProps {
  slug: string;
  orgName: string;
  services: Array<{ id: string; name: string; price: number; durationMin: number }>;
}

export function PublicBookingForm({ slug, orgName, services }: PublicBookingFormProps) {
  const [state, formAction] = useActionState(createPublicAppointment, initialState);

  if (state.ok) {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <Icon name="Check" className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Agendamento confirmado!</h2>
        <p className="mt-2 text-sm text-slate-500">
          {orgName} receberá seu pedido. Guarde o comprovante enviado por e-mail, se informado.
        </p>
        <Link href={`/portal/${slug}`} className="btn-primary mt-6 inline-flex px-6 py-2.5">
          Voltar ao portal
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="card space-y-4 p-8">
      <input type="hidden" name="slug" value={slug} />

      <div>
        <label className="label" htmlFor="serviceId">
          Serviço
        </label>
        <select id="serviceId" name="serviceId" className="input" required defaultValue="">
          <option value="" disabled>
            Selecione um serviço
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {formatCurrency(s.price)} ({s.durationMin} min)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="startAt">
          Data e hora
        </label>
        <input id="startAt" name="startAt" type="datetime-local" className="input" required />
      </div>

      <div>
        <label className="label" htmlFor="customerName">
          Seu nome
        </label>
        <input id="customerName" name="customerName" className="input" placeholder="Nome completo" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="customerEmail">
            E-mail
          </label>
          <input id="customerEmail" name="customerEmail" type="email" className="input" placeholder="opcional" />
        </div>
        <div>
          <label className="label" htmlFor="customerPhone">
            Telefone
          </label>
          <input id="customerPhone" name="customerPhone" className="input" placeholder="(11) 99999-9999" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="notes">
          Observações
        </label>
        <textarea id="notes" name="notes" className="input min-h-[80px]" placeholder="Opcional" />
      </div>

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <SubmitButton className="w-full py-3 text-base" pendingText="Agendando...">
        Confirmar agendamento
      </SubmitButton>
    </form>
  );
}
