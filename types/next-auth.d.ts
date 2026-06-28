import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      orgId: string;
      activeOrgId: string;
      role: string;
      isPlatformAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    orgId?: string;
    role?: string;
    isPlatformAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    orgId?: string;
    activeOrgId?: string;
    role?: string;
    isPlatformAdmin?: boolean;
  }
}

declare module "next-auth/react" {
  interface Session {
    activeOrgId?: string;
  }
}

export interface SessionUpdatePayload {
  activeOrgId?: string;
}

declare module "next-auth" {
  interface Session {
    activeOrgId?: string;
  }
}
