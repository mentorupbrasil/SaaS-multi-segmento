"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent, type SidebarProps } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileAppHeader(props: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <SidebarContent {...props} onNavigate={() => setOpen(false)} className="h-full" />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-bold tracking-tight">
          Gestor<span className="text-primary">Pro</span>
        </span>
      </div>
      <ThemeToggle compact className="shrink-0" />
    </header>
  );
}
