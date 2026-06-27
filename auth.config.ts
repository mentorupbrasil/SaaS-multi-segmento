import type { NextAuthConfig } from "next-auth";

// Config edge-safe (sem Prisma/bcrypt) usada pelo middleware.
export const authConfig = {
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
      ];
      const isProtected = protectedPrefixes.some((p) =>
        nextUrl.pathname.startsWith(p),
      );

      if (isProtected) return isLoggedIn;

      // Se ja logado e tentando acessar login/signup, manda pro dashboard.
      if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
