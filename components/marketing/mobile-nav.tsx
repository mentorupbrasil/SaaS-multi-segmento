"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/segmentos", label: "Segmentos" },
  { href: "/funcionalidades", label: "Funcionalidades" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/precos", label: "Preços" },
  { href: "/integracoes", label: "Integrações" },
  { href: "/blog", label: "Blog" },
  { href: "/suporte", label: "Suporte" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="h-10 w-10"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 border-b border-border bg-background/95 shadow-lg backdrop-blur-xl transition-all duration-200",
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <nav className="section max-h-[calc(100vh-4rem)] overflow-y-auto py-4">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                Entrar
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/signup" onClick={() => setOpen(false)}>
                Assinar agora
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 top-16 z-30 bg-background/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
