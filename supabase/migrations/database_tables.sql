/*
  Vendor Management System — Complete Database Schema
  ═══════════════════════════════════════════════════════════════════════════════

  Tables
  ───────
  vendors               Core vendor record
  machines              Machines owned by a vendor
  vendor_staff_summary  Staff / programming summary per vendor
  technical_staff_counts Normalised skilled-staff count per vendor
  programmer_counts     Normalised programmer count per vendor
  programming_subtypes  Lookup: CNC programming sub-types
  vendor_programmings   Programming capability detail per vendor
  machine_categories    Lookup: CNC / Conventional
  machine_types         Lookup: Turn, Milling, 5-Axis, …
  states                Reference: Indian states
  cities                Reference: Indian cities

  Views
  ─────
  vendor_full_export    Used by /api/admin/export (Excel download)

  RLS Security Model
  ──────────────────
  • anon role          → INSERT on transactional tables (vendor self-registration)
                         SELECT on lookup/reference tables
  • authenticated role → full access (covers future auth layer)
  • service-role key   → bypasses RLS entirely (all server-side API routes)

  Safe to re-run: every DDL statement uses IF NOT EXISTS / OR REPLACE / DO $$ guards.

  Run in: Supabase Dashboard → SQL Editor → Run
*/

-- ═══════════════════════════════════════════════════════════════════════════════
-- CORE TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- vendors
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name         text        NOT NULL,
  owner_name           text        NOT NULL,
  aadhar_number        text,
  pancard_number       text        NOT NULL,
  gst_no               text        NOT NULL,
  address              text        NOT NULL,
  phone_number         text,
  email                text,
  state                text,
  city                 text,
  pincode              text,
  number_of_skill      integer     DEFAULT 0,
  number_of_programmer integer     DEFAULT 0,
  number_of_quality_tools integer  DEFAULT 0,
  number_of_machines   integer     DEFAULT 0,
  industries           text[]      DEFAULT '{}',
  vice                 text,
  angle_plates         text,
  special_fixture      text,
  boring_bar           text,
  anti_vibration_tool  text,
  high_feed_tool       text,
  advance_tooling      text,
  created_by           text,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- machines
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS machines (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id            uuid        REFERENCES vendors(id) ON DELETE CASCADE,
  machine_name         text,
  machine_type         text,
  machine_code         text,
  mapped_subtype       text,
  machine_category     text,
  size_choice          text,
  diameter_value       text,
  size_x               text,
  size_y               text,
  size_z               text,
  accuracy             text,
  power                text,
  advance_software     text,
  specs                jsonb,
  purchase_date        date,
  status               text        CHECK (status IN ('Operational', 'Under Maintenance', 'Retired')),
  created_by           text,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- vendor_staff_summary
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_staff_summary (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id             uuid        NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  technical_staff_count integer     DEFAULT 0,
  programmer_count      integer     DEFAULT 0,
  programming_type      text,
  programming_mode      text,
  programming_manual    text,
  programming_cam       text,
  notes                 text,
  created_by            text,
  created_at            timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- technical_staff_counts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS technical_staff_counts (
  vendor_id             uuid        PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
  technical_staff_count integer     DEFAULT 0,
  created_by            text,
  created_at            timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- programmer_counts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programmer_counts (
  vendor_id        uuid        PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
  programmer_count integer     DEFAULT 0,
  created_by       text,
  created_at       timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- programming_subtypes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programming_subtypes (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- vendor_programmings
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_programmings (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id              uuid        UNIQUE NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  programming_subtype_id uuid        REFERENCES programming_subtypes(id),
  programming_mode       text,
  programming_detail     text,
  notes                  text,
  created_by             text,
  created_at             timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- LOOKUP / REFERENCE TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- machine_categories
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS machine_categories (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- machine_types
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS machine_types (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- states
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS states (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- cities
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  state_id   uuid        REFERENCES states(id),
  created_at timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_machines_vendor_id      ON machines(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at      ON vendors(created_at);
CREATE INDEX IF NOT EXISTS idx_machines_created_at     ON machines(created_at);
CREATE INDEX IF NOT EXISTS idx_vendors_state           ON vendors(state);
CREATE INDEX IF NOT EXISTS idx_vendors_industries      ON vendors USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_machines_machine_type   ON machines(machine_type);

-- ═══════════════════════════════════════════════════════════════════════════════
-- AUTO-UPDATE updated_at TRIGGER
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_vendors_updated_at  ON vendors;
DROP TRIGGER IF EXISTS update_machines_updated_at ON machines;

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
  BEFORE UPDATE ON machines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA  (only inserted when table is empty)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO machine_categories (name)
SELECT name FROM (VALUES ('CNC'), ('Conventional')) AS t(name)
WHERE NOT EXISTS (SELECT 1 FROM machine_categories LIMIT 1);

INSERT INTO machine_types (name)
SELECT name FROM (VALUES
  ('Turn'), ('Milling'), ('5-Axis'), ('Gear Cutting'),
  ('Grinding'), ('Wire Cutting'), ('3-D Printing')
) AS t(name)
WHERE NOT EXISTS (SELECT 1 FROM machine_types LIMIT 1);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE vendors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines              ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_staff_summary  ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_staff_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmer_counts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE programming_subtypes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_programmings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_types         ENABLE ROW LEVEL SECURITY;
ALTER TABLE states                ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities                ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- vendors
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Anyone can read vendors"      ON vendors; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Anyone can insert vendors"    ON vendors; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Anyone can update vendors"    ON vendors; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_vendors"
    ON vendors FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_vendors"
    ON vendors FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- machines
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Anyone can read machines"     ON machines; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Anyone can insert machines"   ON machines; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Anyone can update machines"   ON machines; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_machines"
    ON machines FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_machines"
    ON machines FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- vendor_staff_summary
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read vendor_staff_summary"   ON vendor_staff_summary; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public insert vendor_staff_summary" ON vendor_staff_summary; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_vendor_staff_summary"
    ON vendor_staff_summary FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_vendor_staff_summary"
    ON vendor_staff_summary FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- technical_staff_counts
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read technical_staff_counts"   ON technical_staff_counts; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public insert technical_staff_counts" ON technical_staff_counts; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public update technical_staff_counts" ON technical_staff_counts; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_technical_staff_counts"
    ON technical_staff_counts FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_technical_staff_counts"
    ON technical_staff_counts FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- programmer_counts
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read programmer_counts"   ON programmer_counts; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public insert programmer_counts" ON programmer_counts; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public update programmer_counts" ON programmer_counts; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_programmer_counts"
    ON programmer_counts FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_programmer_counts"
    ON programmer_counts FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- programming_subtypes
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read programming_subtypes"   ON programming_subtypes; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public insert programming_subtypes" ON programming_subtypes; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_programming_subtypes"
    ON programming_subtypes FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_programming_subtypes"
    ON programming_subtypes FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- vendor_programmings
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read vendor_programmings"   ON vendor_programmings; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public insert vendor_programmings" ON vendor_programmings; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public update vendor_programmings" ON vendor_programmings; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_vendor_programmings"
    ON vendor_programmings FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_vendor_programmings"
    ON vendor_programmings FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- machine_categories  (lookup — anon may read)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read machine_categories" ON machine_categories; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_select_machine_categories"
    ON machine_categories FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_machine_categories"
    ON machine_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- machine_types  (lookup — anon may read)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read machine_types" ON machine_types; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_select_machine_types"
    ON machine_types FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_machine_types"
    ON machine_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- states  (reference — anon may read and insert)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read states"   ON states; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public insert states" ON states; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_select_states"
    ON states FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_states"
    ON states FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_states"
    ON states FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- cities  (reference — anon may read and insert)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN DROP POLICY "Public read cities"   ON cities; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN DROP POLICY "Public insert cities" ON cities; EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_select_cities"
    ON cities FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "anon_insert_cities"
    ON cities FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "auth_all_cities"
    ON cities FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- VIEW: vendor_full_export
-- security_invoker = true → runs as the calling role, RLS is respected.
-- The admin export uses the service-role key which bypasses RLS, so it always
-- returns all rows. Non-service-role callers are restricted by the policies above.
-- ═══════════════════════════════════════════════════════════════════════════════

DROP VIEW IF EXISTS vendor_full_export;
CREATE VIEW vendor_full_export WITH (security_invoker = true) AS
SELECT
  v.id,
  v.company_name,
  v.owner_name,
  v.phone_number,
  v.email,
  v.pancard_number,
  v.gst_no,
  v.address,
  v.state,
  v.city,
  v.pincode,
  v.industries,
  v.number_of_machines,
  v.number_of_skill,
  v.number_of_programmer,
  v.number_of_quality_tools,
  v.vice,
  v.angle_plates,
  v.special_fixture,
  v.boring_bar,
  v.anti_vibration_tool,
  v.high_feed_tool,
  v.advance_tooling,
  v.created_by,
  v.created_at,
  v.updated_at,
  (
    SELECT json_agg(json_build_object(
      'machine_code',     m.machine_code,
      'machine_type',     m.machine_type,
      'machine_category', m.machine_category,
      'mapped_subtype',   m.mapped_subtype,
      'size_choice',      m.size_choice,
      'diameter_value',   m.diameter_value,
      'size_x',           m.size_x,
      'size_y',           m.size_y,
      'size_z',           m.size_z,
      'accuracy',         m.accuracy,
      'power',            m.power,
      'status',           m.status,
      'purchase_date',    m.purchase_date
    ))
    FROM machines m
    WHERE m.vendor_id = v.id
  ) AS machines
FROM vendors v;
