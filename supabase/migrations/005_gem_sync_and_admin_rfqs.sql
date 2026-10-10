/*
  GeM tender import + admin-created RFQs
  ═══════════════════════════════════════════════════════════════════════════════
  • tenders.source — 'Manual' (entered in /admin) or 'GeM' (imported by the
    "Refresh from GeM" button). (source, reference_no) is unique so repeated
    imports never duplicate a bid.
  • rfqs.drawing_path becomes optional so admins can log RFQs received by
    phone / email without a file.

  Run after 003_tenders.sql and 004_rfqs.sql. Safe to re-run.
*/

ALTER TABLE tenders ADD COLUMN IF NOT EXISTS source text DEFAULT 'Manual';
UPDATE tenders SET source = 'Manual' WHERE source IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS tenders_source_reference_uidx ON tenders (source, reference_no);

ALTER TABLE rfqs ALTER COLUMN drawing_path DROP NOT NULL;
