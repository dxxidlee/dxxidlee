// Conversion between SQLite rows and Subsidiary objects.
// Kept free of "server-only" so scripts can use it too.
import type Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { SubsidiarySchema, type NewSubsidiary, type Subsidiary } from "./types";

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
};

export function fromRow(row: SubsidiaryRow): Subsidiary {
  return SubsidiarySchema.parse({
    ...row,
    active_ingredients: JSON.parse(row.active_ingredients),
    side_effects: JSON.parse(row.side_effects),
    trust_devices: JSON.parse(row.trust_devices),
    packaging: JSON.parse(row.packaging),
    is_flagship: row.is_flagship === 1,
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
export function uniqueSlug(db: Database.Database, base: string): string {
  const root = slugify(base);
  const taken = db.prepare("SELECT 1 FROM subsidiaries WHERE slug = ?");
  let slug = root;
  for (let n = 2; taken.get(slug); n++) slug = `${root}-${n}`;
  return slug;
}

export function insertSubsidiary(
  db: Database.Database,
  input: NewSubsidiary,
  options: { believers?: number; created_at?: string } = {},
): Subsidiary {
  const id = randomUUID();
  const slug = uniqueSlug(db, input.company_name);
  const created_at = options.created_at ?? new Date().toISOString();

  db.prepare(
    `INSERT INTO subsidiaries (
      id, slug, created_at, desire, category, company_name, product_name,
      tagline, claim, format, active_ingredients, side_effects, price_cents,
      trust_devices, manual_entry, packaging, believers, status, is_flagship
    ) VALUES (
      @id, @slug, @created_at, @desire, @category, @company_name, @product_name,
      @tagline, @claim, @format, @active_ingredients, @side_effects, @price_cents,
      @trust_devices, @manual_entry, @packaging, @believers, @status, @is_flagship
    )`,
  ).run({
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
  });

  const row = db
    .prepare("SELECT * FROM subsidiaries WHERE id = ?")
    .get(id) as SubsidiaryRow;
  return fromRow(row);
}
