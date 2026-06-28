"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

interface SegmentSearchProps {
  id?: string;
  placeholder?: string;
  label?: string;
  hint?: string;
  size?: "default" | "large";
}

export function SegmentSearch({
  id = "segment-search",
  placeholder = 'Digite "restaurante", "clínica", "barbearia"...',
  label = "Qual é o seu negócio?",
  hint,
  size = "default",
}: SegmentSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/segmentos?q=${encodeURIComponent(q)}` : "/segmentos");
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-900">
          {label}
        </label>
      )}
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      <div className={label || hint ? "relative mt-3" : "relative"}>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={
            size === "large"
              ? "w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-base shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
              : "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          }
        />
      </div>
    </form>
  );
}
