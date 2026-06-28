"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createKitchenOrder } from "./actions";

export function SendToKitchenButton({ workOrderId, title }: { workOrderId: string; title: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
      onClick={() =>
        start(async () => {
          const result = await createKitchenOrder(workOrderId);
          if (result.error) {
            alert(result.error);
            return;
          }
          router.refresh();
        })
      }
    >
      {pending ? "Enviando..." : title}
    </button>
  );
}
