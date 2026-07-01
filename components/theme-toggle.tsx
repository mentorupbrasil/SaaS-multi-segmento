"use client";

import * as React from "react";
import { Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeChoice = "light" | "dark" | "system";

interface ThemeToggleProps {
  className?: string;
  /** Ícones apenas — ideal para sidebar e mobile */
  compact?: boolean;
}

function ThemeButton({
  active,
  onClick,
  label,
  icon: Icon,
  position,
  compact,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: typeof Sun;
  position: "first" | "middle" | "last";
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "group flex items-center gap-2 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        compact ? "px-2.5 py-2" : "px-3 py-2 sm:px-4",
        position === "first" && "rounded-l-lg border-r border-border/80",
        position === "middle" && "border-r border-border/80",
        position === "last" && "rounded-r-lg",
        active
          ? "bg-accent text-foreground shadow-sm"
          : "bg-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      <Icon
        className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:h-[1.125rem] sm:w-[1.125rem]"
        aria-hidden
      />
      {!compact && <span className="hidden select-none text-sm font-medium sm:inline">{label}</span>}
    </button>
  );
}

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex animate-pulse rounded-lg border border-border bg-muted/40",
          compact ? "h-9 w-[7.5rem]" : "h-9 w-32 sm:w-44",
          className,
        )}
        aria-hidden
      />
    );
  }

  const current = (theme ?? "system") as ThemeChoice;

  const items: { id: ThemeChoice; label: string; icon: typeof Sun; position: "first" | "middle" | "last" }[] = [
    { id: "light", label: "Claro", icon: Sun, position: "first" },
    { id: "dark", label: "Escuro", icon: Moon, position: "middle" },
    { id: "system", label: "Sistema", icon: Settings, position: "last" },
  ];

  return (
    <div
      className={cn(
        "relative inline-flex overflow-hidden rounded-lg border border-border/80 bg-card/60 shadow-sm shadow-black/5 backdrop-blur-md transition-colors duration-500 dark:bg-card/40 dark:shadow-black/20",
        className,
      )}
      role="group"
      aria-label="Tema da interface"
    >
      {items.map((item) => (
        <ThemeButton
          key={item.id}
          active={current === item.id}
          onClick={() => setTheme(item.id)}
          label={item.label}
          icon={item.icon}
          position={item.position}
          compact={compact}
        />
      ))}
    </div>
  );
}
