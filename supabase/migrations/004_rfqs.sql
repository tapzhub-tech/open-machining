/*
  Manufacturing requests (RFQs) from /manufacture-with-us
  ═══════════════════════════════════════════════════════════════════════════════
  • rfqs table — written only by the server (service-role key), so RLS is on
    with no anon policies. Admins manage rows from the RFQs tab in /admin.
  • rfq-files storage bucket (private) — drawings and CAD files. The browser
    uploads via short-lived signed upload URLs issued by /api/rfq/upload-urls.

  Safe to re-run. Run in: Supabase Dashboard → SQL Editor → Run
*/

CREATE TABLE IF NOT EXISTS rfqs (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  status              text        DEFAULT 'New' CHECK (status IN ('New', 'Reviewing', 'Quoted', 'Won', 'Lost', 'Closed')),
  company             text        NOT NULL,
  contact_name        text        NOT NULL,
  email               text        NOT NULL,
  phone               text,
  reference_no        text,
  part_name           text        NOT NULL,
  drawing_no          text        NOT NULL,
  drawing_revision    text,
  quantity            integer     NOT NULL CHECK (quantity > 0),
  unit                text        NOT NULL,
  order_type          text        NOT NULL,
  process             text        NOT NULL,
  material            text        NOT NULL,
  material_grade      text,
  surface_finish      text,
  tolerance           text,
  heat_treatment      text,
  quality_requirement text        NOT NULL,
  material_cert       text,
  coc                 text,
  delivery_date       date        NOT NULL,
  delivery_location   text        NOT NULL,
  repeat_order        text,
  notes               text,
  drawing_path        text        NOT NULL,
  cad_path            text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rfqs_created_at ON rfqs(created_at);

DROP TRIGGER IF EXISTS update_rfqs_updated_at ON rfqs;
CREATE TRIGGER update_rfqs_updated_at
  BEFORE UPDATE ON rfqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "auth_all_rfqs"
    ON rfqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Private bucket, 50 MB per file
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('rfq-files', 'rfq-files', false, 52428800)
ON CONFLICT (id) DO NOTHING;
