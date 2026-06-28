"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { switchSegmentAction } from "@/app/admin/actions";

export interface SegmentOption {
  id: string;
  label: string;
  tagline: string;
  category: string;
}

interface SegmentSwitcherProps {
  segments: SegmentOption[];
  activeSegmentId: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function SegmentSwitcher({ segments, activeSegmentId }: SegmentSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return segments;
    return segments.filter(
      (s) => normalize(s.label).includes(q) || normalize(s.tagline).includes(q),
    );
  }, [query, segments]);

  return (
    <div className="mb-4 px-3">
      <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Sistema / segmento
      </p>
      <input
        type="search"
        placeholder="Buscar segmento..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input mb-2 text-sm"
      />
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
        {filtered.length === 0 && (
          <option value="" disabled>
            Nenhum segmento encontrado
          </option>
        )}
        {filtered.map((seg) => (
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
