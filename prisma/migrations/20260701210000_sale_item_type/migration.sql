-- Add type column to SaleItem (align with QuoteItem/WorkOrderItem)
ALTER TABLE "SaleItem" ADD COLUMN IF NOT EXISTS "type" "WorkOrderItemType" NOT NULL DEFAULT 'SERVICE';
