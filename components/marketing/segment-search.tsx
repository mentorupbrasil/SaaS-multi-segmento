"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className={cn("relative", (label || hint) && "mt-3")}>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "pl-10 shadow-sm",
            size === "large" && "py-3.5 pl-11 text-base",
          )}
        />
      </div>
    </form>
  );
}
