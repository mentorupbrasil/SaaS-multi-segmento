-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "AutomationJobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED');

-- AlterTable: User (auth & verification fields)
ALTER TABLE "User"
    ADD COLUMN "emailVerified" TIMESTAMP(3),
    ADD COLUMN "verificationToken" TEXT,
    ADD COLUMN "passwordResetToken" TEXT,
    ADD COLUMN "passwordResetExpires" TIMESTAMP(3);

-- AlterTable: Organization (multi-unit, public booking)
ALTER TABLE "Organization"
    ADD COLUMN "parentOrganizationId" TEXT,
    ADD COLUMN "publicBookingSlug" TEXT,
    ADD COLUMN "publicBookingEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Customer (updatedAt)
ALTER TABLE "Customer"
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Service (updatedAt)
ALTER TABLE "Service"
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Pet (updatedAt)
ALTER TABLE "Pet"
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Vehicle (updatedAt)
ALTER TABLE "Vehicle"
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: CustomerRecord (audit fields)
ALTER TABLE "CustomerRecord"
    ADD COLUMN "createdByUserId" TEXT,
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "CustomerRecord_createdByUserId_idx" ON "CustomerRecord"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_publicBookingSlug_key" ON "Organization"("publicBookingSlug");

-- CreateIndex
CREATE INDEX "Organization_parentOrganizationId_idx" ON "Organization"("parentOrganizationId");

-- CreateIndex
CREATE INDEX "CommissionEntry_workOrderId_idx" ON "CommissionEntry"("workOrderId");

-- AddForeignKey: Organization hierarchy
ALTER TABLE "Organization"
    ADD CONSTRAINT "Organization_parentOrganizationId_fkey"
    FOREIGN KEY ("parentOrganizationId") REFERENCES "Organization"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: FinancialEntry optional relations
ALTER TABLE "FinancialEntry"
    ADD CONSTRAINT "FinancialEntry_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "FinancialEntry"
    ADD CONSTRAINT "FinancialEntry_workOrderId_fkey"
    FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "FinancialEntry"
    ADD CONSTRAINT "FinancialEntry_quoteId_fkey"
    FOREIGN KEY ("quoteId") REFERENCES "Quote"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "FinancialEntry"
    ADD CONSTRAINT "FinancialEntry_saleId_fkey"
    FOREIGN KEY ("saleId") REFERENCES "Sale"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: CommissionEntry -> WorkOrder
ALTER TABLE "CommissionEntry"
    ADD CONSTRAINT "CommissionEntry_workOrderId_fkey"
    FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: CustomerRecord -> User (created by)
ALTER TABLE "CustomerRecord"
    ADD CONSTRAINT "CustomerRecord_createdByUserId_fkey"
    FOREIGN KEY ("createdByUserId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: Branch
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable: AuditLog
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable: SupportTicket
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "userId" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable: IntegrationConfig
CREATE TABLE "IntegrationConfig" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PublicBookingLink
CREATE TABLE "PublicBookingLink" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PublicBookingLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable: AutomationJob
CREATE TABLE "AutomationJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "runAt" TIMESTAMP(3) NOT NULL,
    "status" "AutomationJobStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Branch
CREATE INDEX "Branch_organizationId_idx" ON "Branch"("organizationId");

-- CreateIndex: AuditLog
CREATE INDEX "AuditLog_organizationId_idx" ON "AuditLog"("organizationId");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex: SupportTicket
CREATE INDEX "SupportTicket_organizationId_idx" ON "SupportTicket"("organizationId");
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex: IntegrationConfig
CREATE UNIQUE INDEX "IntegrationConfig_organizationId_provider_key" ON "IntegrationConfig"("organizationId", "provider");
CREATE INDEX "IntegrationConfig_organizationId_idx" ON "IntegrationConfig"("organizationId");

-- CreateIndex: PublicBookingLink
CREATE UNIQUE INDEX "PublicBookingLink_organizationId_key" ON "PublicBookingLink"("organizationId");
CREATE UNIQUE INDEX "PublicBookingLink_slug_key" ON "PublicBookingLink"("slug");

-- CreateIndex: AutomationJob
CREATE INDEX "AutomationJob_organizationId_idx" ON "AutomationJob"("organizationId");
CREATE INDEX "AutomationJob_runAt_status_idx" ON "AutomationJob"("runAt", "status");

-- AddForeignKey: Branch
ALTER TABLE "Branch"
    ADD CONSTRAINT "Branch_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: AuditLog
ALTER TABLE "AuditLog"
    ADD CONSTRAINT "AuditLog_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: SupportTicket
ALTER TABLE "SupportTicket"
    ADD CONSTRAINT "SupportTicket_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupportTicket"
    ADD CONSTRAINT "SupportTicket_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: IntegrationConfig
ALTER TABLE "IntegrationConfig"
    ADD CONSTRAINT "IntegrationConfig_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: PublicBookingLink
ALTER TABLE "PublicBookingLink"
    ADD CONSTRAINT "PublicBookingLink_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: AutomationJob
ALTER TABLE "AutomationJob"
    ADD CONSTRAINT "AutomationJob_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
