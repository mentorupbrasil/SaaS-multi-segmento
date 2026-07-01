"use client";

import { useState } from "react";
import { Menu, MenuItem, NavLink } from "@/components/ui/navbar-menu";
import { SegmentsMenuPanel } from "@/components/marketing/segments-menu";
import { FeaturesMenuPanel } from "@/components/marketing/features-menu";
import { SolutionsMenuPanel } from "@/components/marketing/solutions-menu";

export function DesktopNav() {
  const [active, setActive] = useState<string | null>(null);

  const close = () => setActive(null);

  return (
    <Menu setActive={setActive}>
      <MenuItem setActive={setActive} active={active} item="Segmentos" dropdownAlign="start">
        <SegmentsMenuPanel onClose={close} />
      </MenuItem>

      <MenuItem setActive={setActive} active={active} item="Funcionalidades" dropdownAlign="center">
        <FeaturesMenuPanel onClose={close} />
      </MenuItem>

      <MenuItem setActive={setActive} active={active} item="Soluções" dropdownAlign="center">
        <SolutionsMenuPanel onClose={close} />
      </MenuItem>

      <NavLink href="/precos">Preços</NavLink>
      <NavLink href="/integracoes">Integrações</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/suporte">Suporte</NavLink>
    </Menu>
  );
}
