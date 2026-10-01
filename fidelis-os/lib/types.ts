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
});

export type Category = z.infer<typeof CategorySchema>;
export type Status = z.infer<typeof StatusSchema>;
export type TrustDevice = z.infer<typeof TrustDeviceSchema>;
export type Packaging = z.infer<typeof PackagingSchema>;
export type Subsidiary = z.infer<typeof SubsidiarySchema>;

/** Fields supplied when founding a subsidiary. The rest are assigned by the database. */
export type NewSubsidiary = Omit<
  Subsidiary,
  "id" | "slug" | "created_at" | "believers" | "status"
> & {
  status?: Status;
};
