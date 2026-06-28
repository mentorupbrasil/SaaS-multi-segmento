"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { switchOrganizationAction } from "@/app/admin/actions";
import { getSegment } from "@/segments";

export interface OrgOption {
  id: string;
  name: string;
  segmentId: string;
  slug: string;
}

interface OrgSwitcherProps {
  organizations: OrgOption[];
  activeOrgId: string;
  compact?: boolean;
}

export function OrgSwitcher({ organizations, activeOrgId, compact }: OrgSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className={compact ? "" : "mb-4 px-3"}>
      {!compact && (
        <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Organização ativa
        </p>
      )}
      <select
        className="input text-sm"
        value={activeOrgId}
        disabled={pending}
        onChange={(e) => {
          const orgId = e.target.value;
          startTransition(async () => {
            await switchOrganizationAction(orgId);
            router.refresh();
          });
        }}
      >
        {organizations.map((org) => {
          const seg = getSegment(org.segmentId);
          return (
            <option key={org.id} value={org.id}>
              {org.name} · {seg?.label ?? org.segmentId}
            </option>
          );
        })}
      </select>
      {pending && <p className="mt-1 px-1 text-xs text-slate-400">Alternando...</p>}
    </div>
  );
}
