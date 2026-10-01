// Conversion between SQLite rows and Subsidiary objects.
// Kept free of "server-only" so scripts can use it too.
import type { Client, ResultSet, Transaction } from "@libsql/client";
import { randomUUID } from "node:crypto";
import { SubsidiarySchema, type NewSubsidiary, type Subsidiary } from "./types";

/** Anything that can run a statement: the client or an open transaction. */
export type Executor = Client | Transaction;

/** Result rows as plain objects of the expected shape. */
export const rowsOf = <T>(rs: ResultSet) => rs.rows as unknown as T[];

export type SubsidiaryRow = {
  id: string;
  slug: string;
  created_at: string;
  desire: string;
  category: string;
  company_name: string;
  product_name: string;
  tagline: string;
  claim: string;
  format: string;
  active_ingredients: string;
  side_effects: string;
  price_cents: number;
  trust_devices: string;
  manual_entry: string;
  packaging: string;
  believers: number;
  status: string;
  is_flagship: number;
  listed_at: string | null;
  /** Status with discontinuation applied, when the query computes it. */
  effective_status?: string;
};

export function fromRow(row: SubsidiaryRow): Subsidiary {
  return SubsidiarySchema.parse({
    ...row,
    active_ingredients: JSON.parse(row.active_ingredients),
    side_effects: JSON.parse(row.side_effects),
    trust_devices: JSON.parse(row.trust_devices),
    packaging: JSON.parse(row.packaging),
    is_flagship: row.is_flagship === 1,
    status: row.effective_status ?? row.status,
  });
}

export function slugify(text: string): string {
  return (
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "subsidiary"
  );
}

/** Returns a slug not yet used by any subsidiary: "quiet", "quiet-2", ... */
export async function uniqueSlug(db: Executor, base: string): Promise<string> {
  const root = slugify(base);
  const rs = await db.execute({
    sql: "SELECT slug FROM subsidiaries WHERE slug = ? OR slug LIKE ?",
    args: [root, `${root}-%`],
  });
  const taken = new Set(rowsOf<{ slug: string }>(rs).map((r) => r.slug));
  let slug = root;
  for (let n = 2; taken.has(slug); n++) slug = `${root}-${n}`;
  return slug;
}

export async function insertSubsidiary(
  db: Executor,
  input: NewSubsidiary,
  options: { believers?: number; created_at?: string; listed_at?: string | null } = {},
): Promise<Subsidiary> {
  const id = randomUUID();
  const slug = await uniqueSlug(db, input.company_name);
  const created_at = options.created_at ?? new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO subsidiaries (
      id, slug, created_at, desire, category, company_name, product_name,
      tagline, claim, format, active_ingredients, side_effects, price_cents,
      trust_devices, manual_entry, packaging, believers, status, is_flagship,
      listed_at
    ) VALUES (
      @id, @slug, @created_at, @desire, @category, @company_name, @product_name,
      @tagline, @claim, @format, @active_ingredients, @side_effects, @price_cents,
      @trust_devices, @manual_entry, @packaging, @believers, @status, @is_flagship,
      @listed_at
    )`,
    args: {
      id,
      slug,
      created_at,
      desire: input.desire,
      category: input.category,
      company_name: input.company_name,
      product_name: input.product_name,
      tagline: input.tagline,
      claim: input.claim,
      format: input.format,
      active_ingredients: JSON.stringify(input.active_ingredients),
      side_effects: JSON.stringify(input.side_effects),
      price_cents: input.price_cents,
      trust_devices: JSON.stringify(input.trust_devices),
      manual_entry: input.manual_entry,
      packaging: JSON.stringify(input.packaging),
      believers: options.believers ?? 0,
      status: input.status ?? "active",
      is_flagship: input.is_flagship ? 1 : 0,
      listed_at: options.listed_at ?? null,
    },
  });

  const rs = await db.execute({ sql: "SELECT * FROM subsidiaries WHERE id = ?", args: [id] });
  return fromRow(rowsOf<SubsidiaryRow>(rs)[0]);
}
