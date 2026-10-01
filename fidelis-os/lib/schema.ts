// SQLite schema for v1. Mirrors the data model in CLAUDE.md.
// Arrays (text[]) and packaging (jsonb) are stored as JSON text.
// Timestamps are ISO 8601 UTC strings, so they sort and compare as text.
import type { Client } from "@libsql/client";

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
  is_flagship        INTEGER NOT NULL DEFAULT 0 CHECK (is_flagship IN (0, 1)),
  listed_at          TEXT
);

CREATE TABLE IF NOT EXISTS beliefs (
  id            TEXT PRIMARY KEY,
  subsidiary_id TEXT NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS beliefs_subsidiary_created
  ON beliefs (subsidiary_id, created_at);

-- Foundry requests per client, for rate limiting. Addresses are stored hashed.
CREATE TABLE IF NOT EXISTS foundry_requests (
  client_hash TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS foundry_requests_client_created
  ON foundry_requests (client_hash, created_at);
`;

/** Creates tables and brings an older database up to date. */
export async function applySchema(db: Client): Promise<void> {
  await db.executeMultiple(SCHEMA_SQL);

  // Milestone 2 added listed_at. Everything that existed before was already in the store.
  const columns = await db.execute("PRAGMA table_info(subsidiaries)");
  if (!columns.rows.some((c) => c.name === "listed_at")) {
    await db.batch(
      [
        "ALTER TABLE subsidiaries ADD COLUMN listed_at TEXT",
        "UPDATE subsidiaries SET listed_at = created_at",
      ],
      "write",
    );
  }
}
