"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AppLoading() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite" aria-label="Carregando">
      <div className="flex flex-col items-center gap-4">
        {reduceMotion ? (
          <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary" />
        ) : (
          <motion.div
            className="h-8 w-8 rounded-full border-2 border-muted border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        )}
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
