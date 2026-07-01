"use client";

import { Calendar, Users, Wallet, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function HeroMockup() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="relative mx-auto w-full max-w-md">
        <HeroMockupContent />
      </div>
    );
  }

  return (
    <motion.div
      className="relative mx-auto w-full max-w-md"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] as const }}
    >
      <HeroMockupContent animated />
    </motion.div>
  );
}

function HeroMockupContent({ animated = false }: { animated?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-400/20 via-violet-400/20 to-fuchsia-400/20 blur-2xl dark:from-brand-600/30 dark:via-violet-600/20 dark:to-fuchsia-600/20" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 dark:shadow-black/40">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">Painel</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Clientes</span>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">248</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Hoje</span>
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">12</p>
            </div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Receita do mês</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">R$ 18.430</p>
            <div className="mt-3 flex items-end gap-1.5">
              {[40, 65, 50, 80, 60, 90, 75].map((h, i) =>
                animated && !reduceMotion ? (
                  <motion.span
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-brand-300 to-brand-500 dark:from-brand-700 dark:to-brand-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}px` }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                  />
                ) : (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-brand-300 to-brand-500 dark:from-brand-700 dark:to-brand-400"
                    style={{ height: `${h}px` }}
                  />
                ),
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            +24% em relação ao mês passado
          </div>
        </div>
      </div>
    </>
  );
}
