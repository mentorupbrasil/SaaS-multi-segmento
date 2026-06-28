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
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <div className="mt-2 flex flex-col items-end gap-2">
      {error && (
        <p className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <div className="flex flex-wrap items-center justify-end gap-2">
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
            setError(null);
            const result = await finalizeSale(saleId, method);
            if (result.error) {
              setError(result.error);
              return;
            }
            if (result.ok) router.refresh();
          })
        }
      >
        {pending ? "Finalizando..." : "Finalizar venda"}
      </button>
      </div>
    </div>
  );
}
