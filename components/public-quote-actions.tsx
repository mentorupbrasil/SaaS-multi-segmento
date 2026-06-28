"use client";

import { useActionState } from "react";
import { publicApproveQuote, publicRejectQuote, type PublicActionResult } from "@/modules/quotes/public-actions";
import { SubmitButton } from "@/components/submit-button";

const initial: PublicActionResult = {};

export function PublicQuoteActions({
  orgId,
  quoteId,
  token,
  status,
}: {
  orgId: string;
  quoteId: string;
  token: string;
  status: string;
}) {
  const approveAction = publicApproveQuote.bind(null, orgId, quoteId, token);
  const rejectAction = publicRejectQuote.bind(null, orgId, quoteId, token);
  const [approveState, approveFormAction] = useActionState(approveAction, initial);
  const [rejectState, rejectFormAction] = useActionState(rejectAction, initial);

  if (status === "APPROVED" || status === "CONVERTED" || status === "REJECTED") {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <form action={approveFormAction}>
        <SubmitButton className="btn-primary">Aprovar orçamento</SubmitButton>
      </form>
      <form action={rejectFormAction}>
        <SubmitButton className="btn-secondary">Rejeitar</SubmitButton>
      </form>
      {(approveState.error || rejectState.error) && (
        <p className="w-full text-sm text-red-600">{approveState.error ?? rejectState.error}</p>
      )}
      {(approveState.ok || rejectState.ok) && (
        <p className="w-full text-sm text-green-600">Resposta registrada. Obrigado!</p>
      )}
    </div>
  );
}
