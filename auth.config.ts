import type { NextAuthConfig } from "next-auth";
import { ALL_PROTECTED_PREFIXES } from "@/lib/app-routes";
import { isPlatformAdminEmail } from "@/lib/platform-admin-emails";

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
      const pathname = nextUrl.pathname;
      const isLoggedIn = !!auth?.user;

      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        return auth?.user?.isPlatformAdmin === true;
      }

      const isProtected = ALL_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
      if (isProtected) return isLoggedIn;

      // Se ja logado e tentando acessar login/signup, manda pro painel correto.
      if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
        return Response.redirect(new URL(homeForUser(auth.user?.email), nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
