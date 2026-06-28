"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addRestaurantTableAction, type FormResult } from "@/modules/restaurant/table-actions";
import { SubmitButton } from "@/components/submit-button";

const initial: FormResult = {};

export function TableAddForm() {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(addRestaurantTableAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      setOpen(false);
      formRef.current?.reset();
    }
  }, [state.ok]);

  if (!open) {
    return (
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        Nova mesa
      </button>
    );
  }

  return (
    <form ref={formRef} action={action} className="card flex flex-wrap items-end gap-3 p-4">
      <div>
        <label className="label" htmlFor="label">Nome</label>
        <input id="label" name="label" className="input" required placeholder="Mesa 6" />
      </div>
      <div>
        <label className="label" htmlFor="seats">Lugares</label>
        <input id="seats" name="seats" type="number" min={1} className="input w-24" defaultValue={4} required />
      </div>
      <div>
        <label className="label" htmlFor="zone">Zona</label>
        <input id="zone" name="zone" className="input" placeholder="Salão" />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Adicionar</SubmitButton>
      <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
        Cancelar
      </button>
    </form>
  );
}
