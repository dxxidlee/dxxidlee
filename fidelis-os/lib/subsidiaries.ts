import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import { fromRow, insertSubsidiary, type SubsidiaryRow } from "./rows";
import type { NewSubsidiary, Subsidiary } from "./types";

/** Every listed, active subsidiary for the Storefront: flagships first, then newest. */
export function listStoreSubsidiaries(): Subsidiary[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM subsidiaries
       WHERE status = 'active' AND listed_at IS NOT NULL
       ORDER BY is_flagship DESC, listed_at DESC`,
    )
    .all() as SubsidiaryRow[];
  return rows.map(fromRow);
}

/** Any subsidiary, listed or not. */
export function getSubsidiaryBySlug(slug: string): Subsidiary | null {
  const row = getDb()
    .prepare("SELECT * FROM subsidiaries WHERE slug = ?")
    .get(slug) as SubsidiaryRow | undefined;
  return row ? fromRow(row) : null;
}

/** Only subsidiaries that have been listed in the Store. */
export function getStoreSubsidiaryBySlug(slug: string): Subsidiary | null {
  const subsidiary = getSubsidiaryBySlug(slug);
  return subsidiary?.listed_at ? subsidiary : null;
}

/** Names already in the portfolio, so the Foundry does not found a duplicate. */
export function listCompanyNames(): string[] {
  const rows = getDb()
    .prepare("SELECT DISTINCT company_name FROM subsidiaries ORDER BY company_name")
    .all() as { company_name: string }[];
  return rows.map((r) => r.company_name);
}

/** Founds a new, unlisted subsidiary from Foundry output. */
export function createSubsidiary(input: NewSubsidiary): Subsidiary {
  const db = getDb();
  return db.transaction(() => insertSubsidiary(db, input)).immediate();
}

/**
 * Lists a subsidiary in the Store. Listing twice keeps the first date.
 * Returns null if the subsidiary does not exist.
 */
export function listInStore(slug: string): string | null {
  const row = getDb()
    .prepare(
      `UPDATE subsidiaries SET listed_at = COALESCE(listed_at, ?)
       WHERE slug = ? RETURNING listed_at`,
    )
    .get(new Date().toISOString(), slug) as { listed_at: string } | undefined;
  return row?.listed_at ?? null;
}

/**
 * Records one purchase (a belief) and returns the new believer count.
 * Returns null if the subsidiary does not exist, is not active, or is not listed.
 */
export function recordBelief(slug: string): number | null {
  const db = getDb();
  const believe = db.transaction((): number | null => {
    const subsidiary = db
      .prepare(
        `SELECT id FROM subsidiaries
         WHERE slug = ? AND status = 'active' AND listed_at IS NOT NULL`,
      )
      .get(slug) as { id: string } | undefined;
    if (!subsidiary) return null;

    db.prepare(
      "INSERT INTO beliefs (id, subsidiary_id, created_at) VALUES (?, ?, ?)",
    ).run(randomUUID(), subsidiary.id, new Date().toISOString());

    const { believers } = db
      .prepare(
        "UPDATE subsidiaries SET believers = believers + 1 WHERE id = ? RETURNING believers",
      )
      .get(subsidiary.id) as { believers: number };
    return believers;
  });
  return believe.immediate();
}
