import { z } from "zod";
import { CategorySchema, TrustDeviceSchema } from "../types";

// What the Foundry asks Claude to return. Sent to the API as a JSON schema
// (structured outputs), then validated again here with zod.
// Length and range limits are enforced by zod, not by the API.

const line = (max: number) => z.string().trim().min(1).max(max);

export const FoundryDraftSchema = z.object({
  category: CategorySchema,
  company_name: line(40),
  product_name: line(80),
  tagline: line(120),
  claim: line(300),
  format: line(60),
  active_ingredients: z.array(line(100)).min(3).max(6),
  side_effects: z.array(line(120)).min(3).max(6),
  price_cents: z.number().int().min(100).max(10_000_000),
  trust_devices: z.array(TrustDeviceSchema).min(2).max(4),
  manual_entry: line(2000),
  packaging: z.object({
    width: z.number().min(20).max(600),
    height: z.number().min(20).max(600),
    depth: z.number().min(10).max(600),
    panels: z.object({
      front: line(200),
      back: line(400),
      left: line(300),
      right: line(200),
      top: line(120),
      bottom: line(120),
    }),
  }),
});

export const FoundryOutputSchema = z.object({
  decision: z.enum(["manufacture", "decline"]),
  subsidiary: FoundryDraftSchema.nullable(),
});

export type FoundryDraft = z.infer<typeof FoundryDraftSchema>;
export type FoundryOutput = z.infer<typeof FoundryOutputSchema>;

/** The desire as typed into the intake. */
export const DesireSchema = z.string().trim().min(3).max(280);

/** Body returned by POST /api/foundry. */
export type FoundryResponse =
  | { status: "manufactured"; slug: string }
  | { status: "declined"; message: string }
  | { status: "error"; message: string };
