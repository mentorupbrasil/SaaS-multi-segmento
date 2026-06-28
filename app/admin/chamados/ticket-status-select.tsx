"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SupportTicketStatus } from "@prisma/client";
import type { TicketActionState } from "./actions";

export function TicketStatusSelect({
  ticketId,
  currentStatus,
  action,
}: {
  ticketId: string;
  currentStatus: SupportTicketStatus;
  action: (
    prev: TicketActionState,
    formData: FormData,
  ) => Promise<TicketActionState>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(status: string) {
    const formData = new FormData();
    formData.set("ticketId", ticketId);
    formData.set("status", status);
    startTransition(async () => {
      await action({}, formData);
      router.refresh();
    });
  }

  return (
    <select
      className="input py-1.5 text-xs"
      defaultValue={currentStatus}
      disabled={pending}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="OPEN">Aberto</option>
      <option value="IN_PROGRESS">Em andamento</option>
      <option value="RESOLVED">Resolvido</option>
      <option value="CLOSED">Fechado</option>
    </select>
  );
}
