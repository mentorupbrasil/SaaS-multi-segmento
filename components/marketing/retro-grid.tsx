"use client";

import { cn } from "@/lib/utils";

export interface RetroGridProps {
  angle?: number;
  cellSize?: number;
  opacity?: number;
  className?: string;
}

export function RetroGrid({
  angle = 65,
  cellSize = 60,
  opacity = 0.45,
  className,
}: RetroGridProps) {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [perspective:200px] opacity-[var(--opacity)] motion-reduce:opacity-30",
        className,
      )}
      style={gridStyles}
      aria-hidden
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "absolute inset-0 [margin-left:-200%] [width:600vw] [height:300vh] [transform-origin:100%_0_0]",
            "[background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_0),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_0)]",
            "[background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)]",
            "motion-safe:animate-grid",
          )}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent to-90%" />
    </div>
  );
}
