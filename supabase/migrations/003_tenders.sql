/*
  Tenders / opportunities table
  ═══════════════════════════════════════════════════════════════════════════════
  Backs the public /opportunities page and the Tenders tab in /admin.

  RLS
  ───
  • anon role          → SELECT (public opportunities listing)
  • authenticated role → full access
  • service-role key   → bypasses RLS (admin API routes add/edit/delete)

  Safe to re-run. Run in: Supabase Dashboard → SQL Editor → Run
*/

CREATE TABLE IF NOT EXISTS tenders (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no   text,
  title          text        NOT NULL,
  buyer          text        NOT NULL,
  sector         text        NOT NULL CHECK (sector IN ('Government', 'PSU', 'Defence', 'Private')),
  processes      text[]      DEFAULT '{}',
  value          numeric     DEFAULT 0,
  location       text,
  closes_on      date,
  matched        boolean     DEFAULT false,
  status         text        DEFAULT 'Open' CHECK (status IN ('Open', 'Bidding', 'Submitted', 'Awarded', 'Lost', 'Closed')),
  source_url     text,
  notes          text,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenders_closes_on ON tenders(closes_on);
CREATE INDEX IF NOT EXISTS idx_tenders_sector    ON tenders(sector);

DROP TRIGGER IF EXISTS update_tenders_updated_at ON tenders;
CREATE TRIGGER update_tenders_updated_at
  BEFORE UPDATE ON tenders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "anon_select_tenders"
    ON tenders FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_tenders"
    ON tenders FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
