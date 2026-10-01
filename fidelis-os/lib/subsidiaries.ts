import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import { fromRow, insertSubsidiary, type SubsidiaryRow } from "./rows";
import type { Holding, HoldingsReport, NewSubsidiary, Subsidiary } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** A subsidiary with no new believers for this long is discontinued (computed on read). */
export const DISCONTINUE_AFTER_DAYS = 14;

// Latest sign of life: the newest belief, the listing date, or the founding date.
const LAST_ACTIVITY = `MAX(
  COALESCE((SELECT MAX(b.created_at) FROM beliefs b WHERE b.subsidiary_id = s.id), ''),
  COALESCE(s.listed_at, ''),
  s.created_at
)`;

// Flagships are never discontinued: their seeded history is relative to when the
// database was created, and the store should not empty itself mid-exhibition.
const EFFECTIVE_STATUS = `CASE
  WHEN s.status = 'active' AND s.is_flagship = 0 AND ${LAST_ACTIVITY} < @cutoff
  THEN 'discontinued' ELSE s.status END`;

const SELECT = `SELECT s.*, ${EFFECTIVE_STATUS} AS effective_status FROM subsidiaries s`;

const cutoff = () => new Date(Date.now() - DISCONTINUE_AFTER_DAYS * DAY_MS).toISOString();

/** Every listed, active subsidiary for the Storefront: flagships first, then newest. */
export function listStoreSubsidiaries(): Subsidiary[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM (${SELECT})
       WHERE effective_status = 'active' AND listed_at IS NOT NULL
       ORDER BY is_flagship DESC, listed_at DESC`,
    )
    .all({ cutoff: cutoff() }) as SubsidiaryRow[];
  return rows.map(fromRow);
}

/** Every subsidiary Fidelis holds, listed or not, ranked by believers. */
export function listAllSubsidiaries(): Subsidiary[] {
  const rows = getDb()
    .prepare(`${SELECT} ORDER BY s.believers DESC, s.created_at ASC`)
    .all({ cutoff: cutoff() }) as SubsidiaryRow[];
  return rows.map(fromRow);
}

/** Any subsidiary, listed or not. */
export function getSubsidiaryBySlug(slug: string): Subsidiary | null {
  const row = getDb()
    .prepare(`${SELECT} WHERE s.slug = @slug`)
    .get({ slug, cutoff: cutoff() }) as SubsidiaryRow | undefined;
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

/** The portfolio: every subsidiary ranked by believers, with the last 24 hours of beliefs. */
export function getHoldings(): HoldingsReport {
  const now = new Date();
  const rows = getDb()
    .prepare(
      `SELECT s.slug, s.company_name, s.product_name, s.category, s.believers,
              s.created_at, s.listed_at,
              ${EFFECTIVE_STATUS} AS status,
              (SELECT COUNT(*) FROM beliefs b
               WHERE b.subsidiary_id = s.id AND b.created_at >= @since) AS delta_24h
       FROM subsidiaries s
       ORDER BY s.believers DESC, s.created_at ASC`,
    )
    .all({
      cutoff: cutoff(),
      since: new Date(now.getTime() - DAY_MS).toISOString(),
    }) as (Omit<Holding, "rank" | "listed"> & { listed_at: string | null })[];

  const holdings = rows.map(({ listed_at, ...row }, i) => ({
    ...row,
    rank: i + 1,
    listed: listed_at !== null,
  }));

  return {
    generated_at: now.toISOString(),
    holdings,
    totals: {
      subsidiaries: holdings.length,
      believers: holdings.reduce((sum, h) => sum + h.believers, 0),
      delta_24h: holdings.reduce((sum, h) => sum + h.delta_24h, 0),
    },
  };
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
 * Returns null unless the subsidiary is listed and, after discontinuation, still active.
 */
export function recordBelief(slug: string): number | null {
  const db = getDb();
  const believe = db.transaction((): number | null => {
    const subsidiary = db
      .prepare(
        `SELECT id FROM (${SELECT})
         WHERE slug = @slug AND effective_status = 'active' AND listed_at IS NOT NULL`,
      )
      .get({ slug, cutoff: cutoff() }) as { id: string } | undefined;
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
