-- Full schema mirrored from the original project (kgfktnhsjjzzwugvpjcr),
-- applied to the supabase-pink-elephant integration database.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Lookup tables ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id uuid REFERENCES states(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS machine_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS machine_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS machine_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  axis text NOT NULL,
  label text NOT NULL,
  min_value numeric,
  max_value numeric,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programming_subtypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employee_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cam_softwares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programming_manuals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ── Core tables ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  owner_name text NOT NULL,
  phone_number text NOT NULL,
  pancard_number text,
  gst_no text NOT NULL,
  address text NOT NULL,
  number_of_skill integer DEFAULT 0,
  number_of_programmer integer DEFAULT 0,
  number_of_quality_tools integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by text,
  number_of_machines integer DEFAULT 0,
  state_id uuid,
  city_id uuid,
  email text,
  state text,
  city text,
  industries text[],
  total_manpower text,
  design_type text,
  expertise text,
  vice text,
  angle_plates text,
  special_fixture text,
  boring_bar text,
  anti_vibration_tool text,
  high_feed_tool text,
  advance_tooling text,
  pincode text
);

CREATE TABLE IF NOT EXISTS machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  machine_name text,
  machine_type text,
  purchase_date date,
  status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  machine_code text,
  machine_type_id uuid REFERENCES machine_types(id),
  mapped_subtype text,
  size_choice text,
  diameter text,
  size_x text,
  size_y text,
  accuracy text,
  power text,
  advance_software text,
  specs jsonb,
  created_by text,
  diameter_value text,
  machine_category_id uuid REFERENCES machine_categories(id),
  size_z text,
  machine_category text
);

CREATE TABLE IF NOT EXISTS vendor_staff_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  technical_staff_count integer DEFAULT 0,
  programmer_count integer DEFAULT 0,
  programming_type text,
  programming_mode text,
  programming_manual text,
  programming_cam text,
  notes text,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS technical_staff_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  technical_staff_count integer DEFAULT 0,
  notes text,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programmer_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  programmer_count integer DEFAULT 0,
  notes text,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vendor_programmings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  programming_mode text,
  programming_detail text,
  notes text,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  programming_subtype_id uuid REFERENCES programming_subtypes(id)
);

CREATE TABLE IF NOT EXISTS vendor_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  design_text text NOT NULL,
  notes text,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  programming_subtype_id uuid REFERENCES programming_subtypes(id)
);

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name text NOT NULL,
  role_id uuid REFERENCES employee_roles(id),
  role_text text,
  experience_years numeric,
  contact text,
  notes text,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_machines_vendor_id    ON machines(vendor_id);
CREATE INDEX IF NOT EXISTS idx_machines_created_at   ON machines(created_at);
CREATE INDEX IF NOT EXISTS idx_machines_machine_type ON machines(machine_type);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at    ON vendors(created_at);
CREATE INDEX IF NOT EXISTS idx_vendors_state         ON vendors(state);
CREATE INDEX IF NOT EXISTS idx_vendors_industries    ON vendors USING GIN(industries);

-- ── updated_at trigger ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_vendors_updated_at ON vendors;
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_machines_updated_at ON machines;
CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON machines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ─────────────────────────────────────────────────────
DO $$
DECLARE t text;
BEGIN
  -- vendor data: anon may submit, authenticated may do everything
  FOREACH t IN ARRAY ARRAY['vendors','machines','vendor_staff_summary','technical_staff_counts',
    'programmer_counts','vendor_programmings','vendor_designs','employees','programming_subtypes']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'anon_insert_' || t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR INSERT TO anon WITH CHECK (true)', 'anon_insert_' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'auth_all_' || t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', 'auth_all_' || t, t);
  END LOOP;

  -- reference/lookup data: anon may read
  FOREACH t IN ARRAY ARRAY['machine_categories','machine_types','machine_sizes','employee_roles',
    'cam_softwares','programming_manuals','states','cities']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'anon_select_' || t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT TO anon USING (true)', 'anon_select_' || t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'auth_all_' || t, t);
    EXECUTE format('CREATE POLICY %I ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', 'auth_all_' || t, t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS anon_insert_states ON states;
CREATE POLICY anon_insert_states ON states FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS anon_insert_cities ON cities;
CREATE POLICY anon_insert_cities ON cities FOR INSERT TO anon WITH CHECK (true);

-- ── View: vendor_full_export ───────────────────────────────────────────────
DROP VIEW IF EXISTS vendor_full_export;
CREATE VIEW vendor_full_export WITH (security_invoker = true) AS
SELECT
  v.id, v.company_name, v.owner_name, v.phone_number, v.email, v.pancard_number,
  v.gst_no, v.address, v.state, v.city, v.pincode, v.industries,
  v.number_of_machines, v.number_of_skill, v.number_of_programmer, v.number_of_quality_tools,
  v.vice, v.angle_plates, v.special_fixture, v.boring_bar, v.anti_vibration_tool,
  v.high_feed_tool, v.advance_tooling, v.created_by, v.created_at, v.updated_at,
  (
    SELECT json_agg(json_build_object(
      'machine_code', m.machine_code, 'machine_type', m.machine_type,
      'machine_category', m.machine_category, 'mapped_subtype', m.mapped_subtype,
      'size_choice', m.size_choice, 'diameter_value', m.diameter_value,
      'size_x', m.size_x, 'size_y', m.size_y, 'size_z', m.size_z,
      'accuracy', m.accuracy, 'power', m.power, 'status', m.status,
      'purchase_date', m.purchase_date
    ))
    FROM machines m WHERE m.vendor_id = v.id
  ) AS machines
FROM vendors v;

NOTIFY pgrst, 'reload schema';
