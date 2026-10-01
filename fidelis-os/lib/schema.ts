// SQLite schema for v1. Mirrors the data model in CLAUDE.md.
// Arrays (text[]) and packaging (jsonb) are stored as JSON text.
// Timestamps are ISO 8601 UTC strings, so they sort and compare as text.

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS subsidiaries (
  id                 TEXT PRIMARY KEY,
  slug               TEXT NOT NULL UNIQUE,
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  desire             TEXT NOT NULL,
  category           TEXT NOT NULL CHECK (category IN ('object', 'ritual', 'subscription', 'service', 'institution')),
  company_name       TEXT NOT NULL,
  product_name       TEXT NOT NULL,
  tagline            TEXT NOT NULL,
  claim              TEXT NOT NULL,
  format             TEXT NOT NULL,
  active_ingredients TEXT NOT NULL DEFAULT '[]',
  side_effects       TEXT NOT NULL DEFAULT '[]',
  price_cents        INTEGER NOT NULL CHECK (price_cents >= 0),
  trust_devices      TEXT NOT NULL DEFAULT '[]',
  manual_entry       TEXT NOT NULL,
  packaging          TEXT NOT NULL,
  believers          INTEGER NOT NULL DEFAULT 0 CHECK (believers >= 0),
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'merged', 'acquired', 'discontinued')),
  is_flagship        INTEGER NOT NULL DEFAULT 0 CHECK (is_flagship IN (0, 1))
);

CREATE TABLE IF NOT EXISTS beliefs (
  id            TEXT PRIMARY KEY,
  subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS beliefs_subsidiary_created
  ON beliefs (subsidiary_id, created_at);
`;
