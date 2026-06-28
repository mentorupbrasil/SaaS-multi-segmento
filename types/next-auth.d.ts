import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      orgId: string;
      activeOrgId: string;
      previewSegmentId?: string;
      role: string;
      isPlatformAdmin?: boolean;
    } & DefaultSession["user"];
    activeOrgId?: string;
    previewSegmentId?: string;
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
    previewSegmentId?: string;
    role?: string;
    isPlatformAdmin?: boolean;
  }
}

export interface SessionUpdatePayload {
  activeOrgId?: string;
  previewSegmentId?: string;
}
