import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import { fromRow, type SubsidiaryRow } from "./rows";
import type { Subsidiary } from "./types";

/** Every active subsidiary for the Storefront: flagships first, then newest. */
export function listActiveSubsidiaries(): Subsidiary[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM subsidiaries
       WHERE status = 'active'
       ORDER BY is_flagship DESC, created_at DESC`,
    )
    .all() as SubsidiaryRow[];
  return rows.map(fromRow);
}

export function getSubsidiaryBySlug(slug: string): Subsidiary | null {
  const row = getDb()
    .prepare("SELECT * FROM subsidiaries WHERE slug = ?")
    .get(slug) as SubsidiaryRow | undefined;
  return row ? fromRow(row) : null;
}

/**
 * Records one purchase (a belief) and returns the new believer count.
 * Returns null if the subsidiary does not exist or is not active.
 */
export function recordBelief(slug: string): number | null {
  const db = getDb();
  const believe = db.transaction((): number | null => {
    const subsidiary = db
      .prepare("SELECT id FROM subsidiaries WHERE slug = ? AND status = 'active'")
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
