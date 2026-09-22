-- SmartDesk Assistant — PostgreSQL schema
-- Run via `npm run migrate` (backend/src/db/migrate.js), or automatically
-- through docker-compose's backend startup command.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Troubleshooting categories (Network, Printer, Display, ...)
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  icon        TEXT,
  description TEXT
);

-- The local/offline knowledge base, now backed by Postgres instead of the
-- bundled frontend/src/data/issues.js array. Seeded from that same data
-- (see db/seed.js) so behavior is unchanged on first run.
CREATE TABLE IF NOT EXISTS issues (
  id                 TEXT PRIMARY KEY,
  category_id        TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title              TEXT NOT NULL,
  description        TEXT,
  difficulty         TEXT,
  estimated_time     TEXT,
  visual_guide       TEXT,
  offline_available  BOOLEAN NOT NULL DEFAULT true,
  symptoms           JSONB NOT NULL DEFAULT '[]',
  steps              JSONB NOT NULL DEFAULT '[]',
  solution           TEXT
);

CREATE INDEX IF NOT EXISTS idx_issues_category ON issues (category_id);
CREATE INDEX IF NOT EXISTS idx_issues_title_trgm ON issues (lower(title));

-- Diagnostic session history, scoped per device (X-Device-Id header) so
-- multiple browsers/devices for the same user can sync. Replaces the
-- previous in-memory placeholder store.
CREATE TABLE IF NOT EXISTS history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     TEXT NOT NULL,
  issue_id      TEXT REFERENCES issues(id) ON DELETE SET NULL,
  issue_title   TEXT NOT NULL,
  category      TEXT,
  result        TEXT,
  duration_sec  INTEGER,
  mode          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_history_device ON history (device_id, created_at DESC);

-- One settings row per device, mirroring frontend/src/services/settingsService.js.
CREATE TABLE IF NOT EXISTS settings (
  device_id                 TEXT PRIMARY KEY,
  theme                     TEXT NOT NULL DEFAULT 'dark',
  automatic_diagnostics     BOOLEAN NOT NULL DEFAULT true,
  save_history               BOOLEAN NOT NULL DEFAULT true,
  online_ai_enabled          BOOLEAN NOT NULL DEFAULT true,
  offline_fallback_enabled   BOOLEAN NOT NULL DEFAULT true,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lightweight log of AI Assistant exchanges, for future analytics /
-- knowledge-base gap analysis. Not read back by the frontend today.
CREATE TABLE IF NOT EXISTS ai_conversations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id         TEXT,
  message           TEXT NOT NULL,
  reply             TEXT,
  source            TEXT,
  related_issue_id  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_device ON ai_conversations (device_id, created_at DESC);
