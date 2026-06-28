import type { NextAuthConfig } from "next-auth";
import { isPlatformAdminEmail } from "@/lib/platform-admin";

function homeForUser(email: string | null | undefined) {
  return isPlatformAdminEmail(email) ? "/admin" : "/dashboard";
}
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    // Protege as rotas do app. Retorna false -> redireciona para /login.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPrefixes = [
        "/dashboard",
        "/clientes",
        "/agenda",
        "/servicos",
        "/financeiro",
        "/equipe",
        "/estoque",
        "/ordens-de-servico",
        "/prontuario",
        "/configuracoes",
        "/assinatura",
        "/admin",
      ];
      const isProtected = protectedPrefixes.some((p) =>
        nextUrl.pathname.startsWith(p),
      );

      if (isProtected) return isLoggedIn;

      // Se ja logado e tentando acessar login/signup, manda pro painel correto.
      if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
        return Response.redirect(new URL(homeForUser(auth.user?.email), nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
