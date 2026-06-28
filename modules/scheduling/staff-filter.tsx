"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Option {
  id: string;
  label: string;
}

export function StaffFilter({ staff, label }: { staff: Option[]; label: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("staff") ?? "";

  return (
    <div className="mb-4 flex items-center gap-2">
      <label className="text-sm text-slate-600">{label}:</label>
      <select
        className="input w-auto min-w-[180px]"
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) params.set("staff", e.target.value);
          else params.delete("staff");
          router.push(`/agenda?${params.toString()}`);
        }}
      >
        <option value="">Todos</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
