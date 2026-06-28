"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { finalizeSale } from "./actions";

const METHODS = [
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "PIX", label: "PIX" },
  { value: "CARTAO", label: "Cartão" },
];

export function FinalizeSaleButton({ saleId }: { saleId: string }) {
  const [method, setMethod] = useState("DINHEIRO");
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
      <select
        className="input w-auto text-sm"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        disabled={pending}
      >
        {METHODS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        className="btn-primary"
        onClick={() =>
          start(async () => {
            const result = await finalizeSale(saleId, method);
            if (result.ok) router.refresh();
          })
        }
      >
        {pending ? "Finalizando..." : "Finalizar venda"}
      </button>
    </div>
  );
}
