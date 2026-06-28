"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { syncCommissionsFromAppointments } from "@/modules/commission/actions";

export function SyncCommissionsButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn-secondary text-sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await syncCommissionsFromAppointments();
          router.refresh();
        });
      }}
    >
      {pending ? "Sincronizando..." : "Gerar comissões de agendamentos"}
    </button>
  );
}
