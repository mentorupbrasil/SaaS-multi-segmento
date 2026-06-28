"use client";

import { useRouter } from "next/navigation";
import { switchOrganizationAction } from "@/app/admin/actions";

export function EnterOrganizationButton({
  orgId,
  label = "Entrar nesta organização",
}: {
  orgId: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="btn-primary"
      onClick={async () => {
        await switchOrganizationAction(orgId);
        router.push("/clientes");
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
