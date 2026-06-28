-- =============================================================================
-- PostgreSQL Row-Level Security (RLS) — optional template
-- =============================================================================
--
-- PURPOSE
--   Enforce multi-tenant isolation at the database layer so each organization
--   can only read/write its own rows, even if application code passes a wrong
--   organizationId.
--
-- WHEN TO USE
--   - Supabase / direct Postgres connections where the app sets session vars
--   - Defense-in-depth alongside application-level tenant checks
--
-- HOW TO APPLY (run as superuser or table owner)
--   1. Review and adjust table list below for your deployment.
--   2. Uncomment the blocks you need.
--   3. Run:  psql "$DATABASE_URL" -f prisma/rls.sql
--   4. In your app, set the tenant before queries:
--        SET LOCAL app.current_organization_id = '<org-id>';
--        SET LOCAL app.current_user_id = '<user-id>';  -- optional, for audit
--
-- PRISMA NOTE
--   Prisma uses a single DB role by default. RLS works best when:
--   - You use a connection pooler hook / middleware to SET LOCAL per request, OR
--   - You use Supabase auth.uid() / custom JWT claims instead of app.* vars.
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helper: read current tenant from session (returns NULL if unset)
-- -----------------------------------------------------------------------------
-- CREATE OR REPLACE FUNCTION app_current_organization_id()
-- RETURNS TEXT AS $$
--   SELECT NULLIF(current_setting('app.current_organization_id', true), '');
-- $$ LANGUAGE sql STABLE;

-- CREATE OR REPLACE FUNCTION app_current_user_id()
-- RETURNS TEXT AS $$
--   SELECT NULLIF(current_setting('app.current_user_id', true), '');
-- $$ LANGUAGE sql STABLE;

-- =============================================================================
-- ENABLE RLS ON TENANT-SCOPED TABLES
-- Uncomment each table your deployment uses.
-- =============================================================================

-- ALTER TABLE "Organization"          ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Membership"            ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Customer"              ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Service"               ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Appointment"           ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "FinancialEntry"        ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "WorkOrder"             ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Quote"                 ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Sale"                  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Branch"                ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "AuditLog"              ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "SupportTicket"         ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "IntegrationConfig"     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "PublicBookingLink"     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "AutomationJob"         ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "CustomerRecord"        ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "InventoryItem"         ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "CommissionEntry"       ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- STANDARD POLICY: organizationId must match session tenant
-- Apply to all tables that have a non-null organizationId column.
-- =============================================================================

-- Example for Customer (copy pattern to other tenant tables):
--
-- CREATE POLICY "tenant_isolation_select" ON "Customer"
--   FOR SELECT
--   USING ("organizationId" = app_current_organization_id());
--
-- CREATE POLICY "tenant_isolation_insert" ON "Customer"
--   FOR INSERT
--   WITH CHECK ("organizationId" = app_current_organization_id());
--
-- CREATE POLICY "tenant_isolation_update" ON "Customer"
--   FOR UPDATE
--   USING ("organizationId" = app_current_organization_id())
--   WITH CHECK ("organizationId" = app_current_organization_id());
--
-- CREATE POLICY "tenant_isolation_delete" ON "Customer"
--   FOR DELETE
--   USING ("organizationId" = app_current_organization_id());

-- =============================================================================
-- MEMBERSHIP / USER ACCESS
-- Users should only see organizations they belong to.
-- =============================================================================

-- CREATE POLICY "membership_select_own" ON "Membership"
--   FOR SELECT
--   USING (
--     "userId" = app_current_user_id()
--     OR "organizationId" = app_current_organization_id()
--   );

-- CREATE POLICY "organization_select_member" ON "Organization"
--   FOR SELECT
--   USING (
--     "id" = app_current_organization_id()
--     OR EXISTS (
--       SELECT 1 FROM "Membership" m
--       WHERE m."organizationId" = "Organization"."id"
--         AND m."userId" = app_current_user_id()
--     )
--   );

-- =============================================================================
-- OPTIONAL NULLABLE organizationId (AuditLog, SupportTicket)
-- Allow org-scoped rows; global/platform rows visible only to service role.
-- =============================================================================

-- CREATE POLICY "audit_log_tenant_or_global" ON "AuditLog"
--   FOR SELECT
--   USING (
--     "organizationId" IS NULL
--     OR "organizationId" = app_current_organization_id()
--   );

-- CREATE POLICY "audit_log_insert" ON "AuditLog"
--   FOR INSERT
--   WITH CHECK (
--     "organizationId" IS NULL
--     OR "organizationId" = app_current_organization_id()
--   );

-- =============================================================================
-- PUBLIC BOOKING (read-only anonymous access by slug)
-- Use a separate DB role without app.current_organization_id for public pages,
-- or a dedicated policy when app.public_booking_slug is set.
-- =============================================================================

-- CREATE POLICY "public_booking_read_by_slug" ON "PublicBookingLink"
--   FOR SELECT
--   USING (
--     "enabled" = true
--     AND "slug" = NULLIF(current_setting('app.public_booking_slug', true), '')
--   );

-- =============================================================================
-- BYPASS FOR MIGRATIONS / SERVICE ROLE
-- Prisma migrate and admin tasks need a role with BYPASSRLS or superuser.
-- Do NOT use the application role for migrations if RLS is enabled.
-- =============================================================================

-- GRANT BYPASSRLS TO prisma_migrate_role;  -- example only; prefer separate role

-- =============================================================================
-- VERIFICATION QUERIES (run manually after enabling)
-- =============================================================================
--
-- SET LOCAL app.current_organization_id = 'org_test_1';
-- SELECT * FROM "Customer";  -- should return only org_test_1 rows
--
-- RESET app.current_organization_id;
-- SELECT * FROM "Customer";  -- should return no rows (or error if policy rejects NULL tenant)
