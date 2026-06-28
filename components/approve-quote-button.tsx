"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { approveAndConvertQuote } from "@/modules/quotes/actions";

export function ApproveQuoteButton({ quoteId }: { quoteId: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      className="btn-primary"
      onClick={() =>
        start(async () => {
          const result = await approveAndConvertQuote(quoteId);
          if (result.ok && result.id) {
            router.push(`/ordens-de-servico/${result.id}`);
          } else {
            router.refresh();
          }
        })
      }
    >
      {pending ? "Convertendo..." : "Aprovar e converter em OS"}
    </button>
  );
}

export function QuoteWorkOrderLink({ workOrderId }: { workOrderId: string }) {
  return (
    <Link href={`/ordens-de-servico/${workOrderId}`} className="text-sm text-brand-600 hover:underline">
      Ver ordem de serviço →
    </Link>
  );
}
