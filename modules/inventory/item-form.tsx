"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createInventoryItem, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { LookupSelect } from "@/components/lookup-select";
import { Icon } from "@/components/icon";
import type { MasterDataOption } from "@/lib/master-data";

const initial: FormResult = {};

export function InventoryForm({
  categoryItems = [],
  unitItems = [],
}: {
  categoryItems?: MasterDataOption[];
  unitItems?: MasterDataOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createInventoryItem, initial);
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
        Novo item
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo item de estoque</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Nome</label>
          <input name="name" className="input" required />
        </div>
        <div>
          <label className="label">SKU / código</label>
          <input name="sku" className="input" />
        </div>
        <div>
          <label className="label">Código de barras</label>
          <input name="barcode" className="input" />
        </div>
        <div>
          <label className="label">Marca</label>
          <input name="brand" className="input" />
        </div>
        <div>
          <label className="label">Categoria</label>
          <LookupSelect
            name="category"
            type="PRODUCT_CATEGORY"
            items={categoryItems}
            allowCustom
            placeholder="Selecione a categoria"
          />
        </div>
        <div>
          <label className="label">Unidade</label>
          <LookupSelect
            name="unit"
            type="PRODUCT_UNIT"
            items={unitItems}
            allowCustom
            defaultValue="un"
            placeholder="Selecione a unidade"
          />
        </div>
        <div>
          <label className="label">Quantidade</label>
          <input name="quantity" type="number" min="0" className="input" defaultValue={0} required />
        </div>
        <div>
          <label className="label">Estoque mínimo</label>
          <input name="minQuantity" type="number" min="0" className="input" defaultValue={0} />
        </div>
        <div>
          <label className="label">Preço unitário (R$)</label>
          <input name="price" type="number" step="0.01" min="0" className="input" defaultValue={0} />
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
    </div>
  );
}
