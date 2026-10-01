import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import { fromRow, insertSubsidiary, rowsOf, type SubsidiaryRow } from "./rows";
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
export async function listStoreSubsidiaries(): Promise<Subsidiary[]> {
  const rs = await (await getDb()).execute({
    sql: `SELECT * FROM (${SELECT})
          WHERE effective_status = 'active' AND listed_at IS NOT NULL
          ORDER BY is_flagship DESC, listed_at DESC`,
    args: { cutoff: cutoff() },
  });
  return rowsOf<SubsidiaryRow>(rs).map(fromRow);
}

/** Every subsidiary Fidelis holds, listed or not, ranked by believers. */
export async function listAllSubsidiaries(): Promise<Subsidiary[]> {
  const rs = await (await getDb()).execute({
    sql: `${SELECT} ORDER BY s.believers DESC, s.created_at ASC`,
    args: { cutoff: cutoff() },
  });
  return rowsOf<SubsidiaryRow>(rs).map(fromRow);
}

/** Any subsidiary, listed or not. */
export async function getSubsidiaryBySlug(slug: string): Promise<Subsidiary | null> {
  const rs = await (await getDb()).execute({
    sql: `${SELECT} WHERE s.slug = @slug`,
    args: { slug, cutoff: cutoff() },
  });
  const row = rowsOf<SubsidiaryRow>(rs)[0];
  return row ? fromRow(row) : null;
}

/** Only subsidiaries that have been listed in the Store. */
export async function getStoreSubsidiaryBySlug(slug: string): Promise<Subsidiary | null> {
  const subsidiary = await getSubsidiaryBySlug(slug);
  return subsidiary?.listed_at ? subsidiary : null;
}

/** Names already in the portfolio, so the Foundry does not found a duplicate. */
export async function listCompanyNames(): Promise<string[]> {
  const rs = await (await getDb()).execute(
    "SELECT DISTINCT company_name FROM subsidiaries ORDER BY company_name",
  );
  return rowsOf<{ company_name: string }>(rs).map((r) => r.company_name);
}

/** The portfolio: every subsidiary ranked by believers, with the last 24 hours of beliefs. */
export async function getHoldings(): Promise<HoldingsReport> {
  const now = new Date();
  const rs = await (await getDb()).execute({
    sql: `SELECT s.slug, s.company_name, s.product_name, s.category, s.believers,
                 s.created_at, s.listed_at,
                 ${EFFECTIVE_STATUS} AS status,
                 (SELECT COUNT(*) FROM beliefs b
                  WHERE b.subsidiary_id = s.id AND b.created_at >= @since) AS delta_24h
          FROM subsidiaries s
          ORDER BY s.believers DESC, s.created_at ASC`,
    args: {
      cutoff: cutoff(),
      since: new Date(now.getTime() - DAY_MS).toISOString(),
    },
  });
  const rows = rowsOf<Omit<Holding, "rank" | "listed"> & { listed_at: string | null }>(rs);

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
export async function createSubsidiary(input: NewSubsidiary): Promise<Subsidiary> {
  const tx = await (await getDb()).transaction("write");
  try {
    const subsidiary = await insertSubsidiary(tx, input);
    await tx.commit();
    return subsidiary;
  } finally {
    tx.close();
  }
}

/**
 * Lists a subsidiary in the Store. Listing twice keeps the first date.
 * Returns null if the subsidiary does not exist.
 */
export async function listInStore(slug: string): Promise<string | null> {
  const rs = await (await getDb()).execute({
    sql: `UPDATE subsidiaries SET listed_at = COALESCE(listed_at, @now)
          WHERE slug = @slug RETURNING listed_at`,
    args: { now: new Date().toISOString(), slug },
  });
  return rowsOf<{ listed_at: string }>(rs)[0]?.listed_at ?? null;
}

/**
 * Records one purchase (a belief) and returns the new believer count.
 * Returns null unless the subsidiary is listed and, after discontinuation, still active.
 */
export async function recordBelief(slug: string): Promise<number | null> {
  // One atomic batch: the insert only happens for an eligible subsidiary, and the
  // count is then recomputed from the beliefs themselves.
  const [inserted, updated] = await (await getDb()).batch(
    [
      {
        sql: `INSERT INTO beliefs (id, subsidiary_id, created_at)
              SELECT @id, id, @now FROM (${SELECT})
              WHERE slug = @slug AND effective_status = 'active' AND listed_at IS NOT NULL`,
        args: { id: randomUUID(), now: new Date().toISOString(), slug, cutoff: cutoff() },
      },
      {
        sql: `UPDATE subsidiaries
              SET believers = (SELECT COUNT(*) FROM beliefs WHERE subsidiary_id = subsidiaries.id)
              WHERE slug = @slug RETURNING believers`,
        args: { slug },
      },
    ],
    "write",
  );
  if (inserted.rowsAffected === 0) return null;
  return Number(updated.rows[0].believers);
}
