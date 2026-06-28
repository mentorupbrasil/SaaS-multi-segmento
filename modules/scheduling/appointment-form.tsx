"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createAppointment, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

interface ServiceOption extends Option {
  staffIds: string[];
}

export function AppointmentForm({
  appointmentLabel,
  customerLabel,
  serviceLabel,
  professionalLabel,
  customers,
  services,
  staff,
}: {
  appointmentLabel: string;
  customerLabel: string;
  serviceLabel: string;
  professionalLabel: string;
  customers: Option[];
  services: ServiceOption[];
  staff: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [state, action] = useActionState(createAppointment, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  const filteredServices =
    selectedStaff.length === 0
      ? services
      : services.filter((s) => s.staffIds.length === 0 || s.staffIds.includes(selectedStaff));

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Icon name="Plus" className="h-4 w-4" />
        Novo {appointmentLabel.toLowerCase()}
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo {appointmentLabel.toLowerCase()}</h2>
      {customers.length === 0 ? (
        <p className="text-sm text-slate-500">
          Cadastre ao menos um {customerLabel.toLowerCase()} antes de agendar.
        </p>
      ) : (
        <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
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
            <label className="label">{serviceLabel}</label>
            <select name="serviceId" className="input">
              <option value="">Sem {serviceLabel.toLowerCase()}</option>
              {filteredServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{professionalLabel}</label>
            <select
              name="staffId"
              className="input"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Sem {professionalLabel.toLowerCase()}</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Data e hora</label>
            <input name="startAt" type="datetime-local" className="input" required />
          </div>
          <div>
            <label className="label">Observações</label>
            <input name="notes" className="input" />
          </div>

          {state.error && (
            <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
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
