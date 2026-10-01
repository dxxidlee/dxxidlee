import { z } from "zod";

export const CATEGORIES = [
  "object",
  "ritual",
  "subscription",
  "service",
  "institution",
] as const;

export const STATUSES = ["active", "merged", "acquired", "discontinued"] as const;

export const TRUST_DEVICES = [
  "authority",
  "proof",
  "scarcity",
  "belonging",
  "purity",
  "testimony",
  "origin_myth",
  "ritual",
] as const;

export const CategorySchema = z.enum(CATEGORIES);
export const StatusSchema = z.enum(STATUSES);
export const TrustDeviceSchema = z.enum(TRUST_DEVICES);

/** Copy for each face of a tuck-end box. Newlines separate lines. */
export const PanelsSchema = z.object({
  front: z.string(),
  back: z.string(),
  left: z.string(),
  right: z.string(),
  top: z.string(),
  bottom: z.string(),
});

/** Box dimensions in millimetres, plus panel copy. */
export const PackagingSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  depth: z.number().positive(),
  panels: PanelsSchema,
});

export const SubsidiarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  created_at: z.string(),
  desire: z.string(),
  category: CategorySchema,
  company_name: z.string(),
  product_name: z.string(),
  tagline: z.string(),
  claim: z.string(),
  format: z.string(),
  active_ingredients: z.array(z.string()),
  side_effects: z.array(z.string()),
  price_cents: z.number().int().nonnegative(),
  trust_devices: z.array(TrustDeviceSchema),
  manual_entry: z.string(),
  packaging: PackagingSchema,
  believers: z.number().int().nonnegative(),
  status: StatusSchema,
  is_flagship: z.boolean(),
  /** When the subsidiary was listed in the Store. Null until then. */
  listed_at: z.string().nullable(),
});

export type Category = z.infer<typeof CategorySchema>;
export type Status = z.infer<typeof StatusSchema>;
export type TrustDevice = z.infer<typeof TrustDeviceSchema>;
export type Packaging = z.infer<typeof PackagingSchema>;
export type Subsidiary = z.infer<typeof SubsidiarySchema>;

/** Fields supplied when founding a subsidiary. The rest are assigned by the database. */
export type NewSubsidiary = Omit<
  Subsidiary,
  "id" | "slug" | "created_at" | "believers" | "status" | "listed_at"
> & {
  status?: Status;
};

/** One row of the Holdings table. */
export type Holding = {
  rank: number;
  slug: string;
  company_name: string;
  product_name: string;
  category: Category;
  believers: number;
  /** Beliefs recorded in the last 24 hours. */
  delta_24h: number;
  /** Includes discontinuation computed on read. */
  status: Status;
  created_at: string;
  listed: boolean;
};

export type HoldingsReport = {
  generated_at: string;
  holdings: Holding[];
  totals: { subsidiaries: number; believers: number; delta_24h: number };
};
