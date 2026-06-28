"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateQuoteStatus } from "@/modules/quotes/actions";

export function QuoteStatusButtons({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  if (status !== "DRAFT" && status !== "SENT") return null;

  return (
    <div className="flex flex-wrap gap-2">
      {status === "DRAFT" && (
        <button
          type="button"
          disabled={pending}
          className="btn-secondary text-sm"
          onClick={() =>
            start(async () => {
              await updateQuoteStatus(id, "SENT");
              router.refresh();
            })
          }
        >
          Marcar como enviado
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        className="btn-secondary text-sm"
        onClick={() =>
          start(async () => {
            await updateQuoteStatus(id, "REJECTED");
            router.refresh();
          })
        }
      >
        Rejeitar
      </button>
    </div>
  );
}
