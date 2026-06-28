"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelSale } from "./actions";

export function CancelSaleButton({ saleId }: { saleId: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      className="text-sm text-red-600 hover:underline"
      onClick={() =>
        start(async () => {
          const result = await cancelSale(saleId);
          if (result.ok) router.refresh();
        })
      }
    >
      {pending ? "Cancelando..." : "Cancelar venda"}
    </button>
  );
}
