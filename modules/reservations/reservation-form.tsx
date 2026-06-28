"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createReservation, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function ReservationForm({
  rooms,
  customers,
  customerLabel,
}: {
  rooms: Option[];
  customers: Option[];
  customerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createReservation, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  if (!open) {
    return (
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        <Icon name="Plus" className="h-4 w-4" />
        Nova reserva
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Nova reserva</h2>
      {rooms.length === 0 || customers.length === 0 ? (
        <p className="text-sm text-slate-500">
          Cadastre quartos e {customerLabel.toLowerCase()}s antes de criar reservas.
        </p>
      ) : (
        <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Quarto</label>
            <select name="roomId" className="input" required>
              <option value="">Selecione</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{customerLabel}</label>
            <select name="customerId" className="input" required>
              <option value="">Selecione</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Check-in</label>
            <input name="checkIn" type="date" className="input" required />
          </div>
          <div>
            <label className="label">Check-out</label>
            <input name="checkOut" type="date" className="input" required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Observações</label>
            <input name="notes" className="input" />
          </div>
          {state.error && (
            <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}
          <div className="flex gap-2 sm:col-span-2">
            <SubmitButton>Salvar</SubmitButton>
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
