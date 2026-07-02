"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowRight, Check, Loader2, Search } from "lucide-react";
import { enterSegmentFlow } from "@/lib/client/enter-segment-flow";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export interface SegmentOption {
  id: string;
  label: string;
  tagline: string;
  category: string;
  icon: string;
}

interface SegmentSwitcherProps {
  segments: SegmentOption[];
  activeSegmentId: string;
  /** Fecha menu mobile após entrar no segmento */
  onNavigate?: () => void;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function SegmentSwitcher({ segments, activeSegmentId, onNavigate }: SegmentSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return segments;
    return segments.filter(
      (s) =>
        normalize(s.label).includes(q) ||
        normalize(s.tagline).includes(q) ||
        normalize(s.category).includes(q),
    );
  }, [query, segments]);

  const activeSegment = segments.find((s) => s.id === activeSegmentId);

  function enterSegment(segmentId: string) {
    if (pending) return;
    setPendingId(segmentId);
    (document.activeElement as HTMLElement | null)?.blur();

    startTransition(async () => {
      try {
        const result = await enterSegmentFlow(segmentId);
        if (result.error) return;
        onNavigate?.();
        router.push("/dashboard");
        router.refresh();
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="px-3">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Explorar segmento
      </p>

      {activeSegment && (
        <div className="mb-3 rounded-xl border border-primary/25 bg-primary/5 p-3 dark:bg-primary/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
              <Icon name={activeSegment.icon} className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{activeSegment.label}</p>
              <p className="truncate text-xs text-muted-foreground">{activeSegment.category}</p>
            </div>
            <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          </div>
          <Button
            type="button"
            className="mt-3 w-full gap-2"
            size="sm"
            disabled={pending}
            onClick={() => enterSegment(activeSegmentId)}
          >
            {pending && pendingId === activeSegmentId ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Abrindo painel...
              </>
            ) : (
              <>
                Entrar no painel
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar segmento..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input pl-9 text-sm"
        />
      </div>

      <ScrollArea className="h-52 rounded-xl border border-border bg-background">
        <div className="p-1">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Nenhum segmento encontrado</p>
          )}
          {filtered.map((seg) => {
            const isActive = seg.id === activeSegmentId;
            const isLoading = pending && pendingId === seg.id;

            return (
              <button
                key={seg.id}
                type="button"
                disabled={pending}
                onClick={() => enterSegment(seg.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  isActive ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-accent",
                  pending && !isLoading && "opacity-60",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon name={seg.icon} className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{seg.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{seg.category}</p>
                </div>
                {isActive && !isLoading && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <p className="mt-2 px-1 text-[11px] leading-snug text-muted-foreground">
        Clique em um segmento para abrir o painel completo — clientes, agenda, financeiro e todos os módulos.
      </p>
    </div>
  );
}
