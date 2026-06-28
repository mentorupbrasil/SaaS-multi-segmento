"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { switchSegmentAction } from "@/app/admin/actions";

export interface SegmentOption {
  id: string;
  label: string;
  category: string;
}

interface SegmentSwitcherProps {
  segments: SegmentOption[];
  activeSegmentId: string;
}

export function SegmentSwitcher({ segments, activeSegmentId }: SegmentSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mb-4 px-3">
      <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Sistema / segmento
      </p>
      <select
        className="input text-sm"
        value={activeSegmentId}
        disabled={pending}
        onChange={(e) => {
          const segmentId = e.target.value;
          startTransition(async () => {
            await switchSegmentAction(segmentId);
            router.refresh();
          });
        }}
      >
        {segments.map((seg) => (
          <option key={seg.id} value={seg.id}>
            {seg.label} ({seg.category})
          </option>
        ))}
      </select>
      {pending && <p className="mt-1 px-1 text-xs text-slate-400">Carregando sistema...</p>}
      <p className="mt-1.5 px-1 text-[11px] leading-snug text-slate-400">
        Troca menus, termos e módulos do painel operacional.
      </p>
    </div>
  );
}
