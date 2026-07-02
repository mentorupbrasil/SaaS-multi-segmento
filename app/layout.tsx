import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { RouteChangeCleanup } from "@/components/route-change-cleanup";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "GestorPro | O sistema do seu negócio",
    template: "%s | GestorPro",
  },
  description:
    "Uma plataforma que se adapta ao seu segmento: barbearia, salão, clínica, oficina e muito mais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={outfit.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RouteChangeCleanup />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
