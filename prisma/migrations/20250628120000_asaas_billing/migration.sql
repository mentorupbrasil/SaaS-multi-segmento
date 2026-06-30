-- AlterTable
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "asaasCustomerId" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "asaasSubscriptionId" TEXT;
