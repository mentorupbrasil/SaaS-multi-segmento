"use server";

import type { MasterDataType } from "@prisma/client";
import { getAuthContext } from "@/lib/auth-context";
import { getMasterDataOptions, type MasterDataOption } from "@/lib/master-data";

export async function fetchMasterDataOptions(type: MasterDataType): Promise<MasterDataOption[]> {
  const ctx = await getAuthContext();
  return getMasterDataOptions(ctx.orgId, type);
}
