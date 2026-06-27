import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "SaaS Multi-Segmento | O sistema do seu negocio",
    template: "%s | SaaS Multi-Segmento",
  },
  description:
    "Uma plataforma que se adapta ao seu segmento: barbearia, salao, clinica, oficina e muito mais.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
