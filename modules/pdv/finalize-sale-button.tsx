"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { finalizeSale } from "./actions";
import type { MasterDataOption } from "@/lib/master-data";

const FALLBACK_METHODS: MasterDataOption[] = [
  { value: "cash", label: "Dinheiro" },
  { value: "pix", label: "PIX" },
  { value: "credit_card", label: "Cartão" },
];

export function FinalizeSaleButton({
  saleId,
  paymentMethods = FALLBACK_METHODS,
}: {
  saleId: string;
  paymentMethods?: MasterDataOption[];
}) {
  const methods = paymentMethods.length > 0 ? paymentMethods : FALLBACK_METHODS;
  const [method, setMethod] = useState(methods[0]?.value ?? "cash");
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
        {methods.map((m) => (
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
