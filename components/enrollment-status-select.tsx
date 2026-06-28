"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEnrollmentStatus } from "@/modules/education/actions";

const OPTIONS = [
  { value: "ACTIVE", label: "Ativa" },
  { value: "SUSPENDED", label: "Suspensa" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "CANCELED", label: "Cancelada" },
] as const;

export function EnrollmentStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <select
      className="input w-auto text-sm"
      value={status}
      disabled={pending}
      onChange={(e) =>
        start(async () => {
          await updateEnrollmentStatus(id, e.target.value as (typeof OPTIONS)[number]["value"]);
          router.refresh();
        })
      }
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
