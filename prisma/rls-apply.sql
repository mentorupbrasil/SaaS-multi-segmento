-- RLS apply script — run once on PostgreSQL (Neon) as owner:
--   psql "$DIRECT_URL" -f prisma/rls-apply.sql

CREATE OR REPLACE FUNCTION app_current_organization_id()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '');
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_current_user_id()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '');
$$ LANGUAGE sql STABLE;

-- Macro: tenant isolation for tables with organizationId
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'Customer', 'Service', 'Appointment', 'FinancialEntry', 'WorkOrder',
    'Quote', 'Sale', 'InventoryItem', 'CommissionEntry', 'CustomerRecord',
    'Supplier', 'Vehicle', 'Pet', 'Room', 'Reservation', 'BusinessEvent',
    'Donation', 'Group', 'SchoolClass', 'Enrollment', 'AttendanceRecord',
    'MasterData', 'KitchenOrder', 'HousekeepingTask', 'IntegrationConfig',
    'AutomationJob', 'SessionPackage', 'Vaccination', 'Membership'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('DROP POLICY IF EXISTS tenant_select ON %I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS tenant_insert ON %I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS tenant_update ON %I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS tenant_delete ON %I', tbl);

    EXECUTE format(
      'CREATE POLICY tenant_select ON %I FOR SELECT USING ("organizationId" = app_current_organization_id())',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY tenant_insert ON %I FOR INSERT WITH CHECK ("organizationId" = app_current_organization_id())',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY tenant_update ON %I FOR UPDATE USING ("organizationId" = app_current_organization_id()) WITH CHECK ("organizationId" = app_current_organization_id())',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY tenant_delete ON %I FOR DELETE USING ("organizationId" = app_current_organization_id())',
      tbl
    );
  END LOOP;
END $$;
