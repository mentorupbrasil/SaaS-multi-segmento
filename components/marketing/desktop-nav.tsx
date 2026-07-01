"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MenuTrigger, NavLink } from "@/components/ui/navbar-menu";
import { SegmentsMenuPanel } from "@/components/marketing/segments-menu";
import { FeaturesMenuPanel } from "@/components/marketing/features-menu";
import { SolutionsMenuPanel } from "@/components/marketing/solutions-menu";
import { menuTransition } from "@/components/marketing/mega-menu-transition";

const DROPDOWN_ITEMS = ["Segmentos", "Funcionalidades", "Soluções"] as const;

export function DesktopNav() {
  const [active, setActive] = useState<string | null>(null);

  const close = () => setActive(null);

  return (
    <div className="relative hidden flex-1 lg:block" onMouseLeave={() => setActive(null)}>
      <nav className="flex items-center gap-6" aria-label="Menu principal">
        {DROPDOWN_ITEMS.map((item) => (
          <MenuTrigger key={item} item={item} active={active} setActive={setActive} />
        ))}
        <NavLink href="/precos">Preços</NavLink>
        <NavLink href="/integracoes">Integrações</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/suporte">Suporte</NavLink>
      </nav>

      <AnimatePresence>
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={menuTransition}
            className="absolute left-0 top-full z-50 pt-3"
            onMouseEnter={() => setActive(active)}
          >
            <div className="overflow-hidden rounded-xl border border-border/80 bg-popover shadow-2xl shadow-black/10">
              {active === "Segmentos" && <SegmentsMenuPanel onClose={close} />}
              {active === "Funcionalidades" && <FeaturesMenuPanel onClose={close} />}
              {active === "Soluções" && <SolutionsMenuPanel onClose={close} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
