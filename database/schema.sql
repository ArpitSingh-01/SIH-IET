-- ============================================================
-- SIH 2026 | IET DDUGU — Database Schema
-- Run this in Supabase SQL editor
-- ============================================================

-- ============================================================
-- ANNOUNCEMENTS
-- Stores both announcements and schedule entries (type column)
-- ============================================================
CREATE TABLE announcements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL CHECK (type IN ('announcement', 'schedule')),
  message         TEXT NOT NULL,
  pinned          BOOLEAN NOT NULL DEFAULT false,
  urgent          BOOLEAN NOT NULL DEFAULT false,
  published       BOOLEAN NOT NULL DEFAULT true,
  internal_name   TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_published ON announcements(published);
CREATE INDEX idx_announcements_pinned ON announcements(pinned);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_published" ON announcements
  FOR SELECT USING (published = true);

-- ============================================================
-- TIMELINE
-- Event timeline with manual ordering
-- ============================================================
CREATE TABLE timeline (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  event_date      DATE NOT NULL,
  event_time      TIME,
  display_order   INT NOT NULL DEFAULT 0,
  visible         BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_visible ON timeline(visible);
CREATE INDEX idx_timeline_order ON timeline(display_order ASC);

ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_visible" ON timeline
  FOR SELECT USING (visible = true);

-- ============================================================
-- CONTACTS
-- Committee member contact cards
-- ============================================================
CREATE TABLE contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  visible         BOOLEAN NOT NULL DEFAULT true,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_visible" ON contacts
  FOR SELECT USING (visible = true);

-- ============================================================
-- SETTINGS
-- Key-value store for editable sections
-- ============================================================
CREATE TABLE settings (
  key             TEXT PRIMARY KEY,
  value           TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      TEXT
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_settings" ON settings
  FOR SELECT USING (true);

-- Seed default settings
INSERT INTO settings (key, value, updated_by) VALUES
  ('about_content', NULL, 'system'),
  ('whatsapp_link', NULL, 'system'),
  ('whatsapp_enabled', 'false', 'system'),
  ('render_last_wake_attempt', NULL, 'system'),
  ('render_status', 'unknown', 'system');

-- ============================================================
-- NOTIFICATION TOKENS
-- FCM device tokens — backend service role only
-- ============================================================
CREATE TABLE notification_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token           TEXT NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notification_tokens ENABLE ROW LEVEL SECURITY;
-- No public read policy — backend service role only

-- ============================================================
-- ACTIVITY LOGS
-- Immutable audit trail — backend service role only
-- ============================================================
CREATE TABLE activity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor           TEXT NOT NULL,
  action          TEXT NOT NULL,
  detail          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
-- No public read policy — admin only via backend

-- ============================================================
-- UPDATED_AT TRIGGER
-- Auto-updates updated_at on row changes
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_updated_at_announcements
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_timeline
  BEFORE UPDATE ON timeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_contacts
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- GOOGLE FORMS
-- Links to registration and feedback forms
-- ============================================================
CREATE TABLE google_forms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  url             TEXT NOT NULL,
  visible         BOOLEAN NOT NULL DEFAULT true,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE google_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_forms" ON google_forms FOR SELECT USING (visible = true);

-- ============================================================
-- UNIFIED DOCUMENTS
-- Notices, templates, PPTX guides, rules stored in Supabase Bucket
-- ============================================================
CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  type            TEXT NOT NULL CHECK (type IN ('notice', 'resource')),
  file_url        TEXT,
  file_path       TEXT,
  link_url        TEXT,
  visible         BOOLEAN NOT NULL DEFAULT true,
  display_order   INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_documents" ON documents FOR SELECT USING (visible = true);
