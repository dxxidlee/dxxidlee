import { NextResponse } from "next/server";
import { FoundryError } from "@/lib/foundry/anthropic";
import { generateSubsidiary } from "@/lib/foundry/generate";
import { CARE_MESSAGE, moderateDesire, screenDesire } from "@/lib/foundry/moderate";
import { DECLINE_MESSAGE } from "@/lib/foundry/prompt";
import { DesireSchema, type FoundryResponse } from "@/lib/foundry/schema";
import { clientKey, takeFoundrySlot } from "@/lib/rate-limit";
import { createSubsidiary, listCompanyNames } from "@/lib/subsidiaries";

export const runtime = "nodejs";
export const maxDuration = 120;

const reply = (body: FoundryResponse, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers });

const declined = (message = DECLINE_MESSAGE) => reply({ status: "declined", message });

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { desire?: unknown } | null;
  const parsed = DesireSchema.safeParse(body?.desire);
  if (!parsed.success) {
    return reply(
      { status: "error", message: "State a desire between 3 and 280 characters." },
      400,
    );
  }
  const desire = parsed.data;

  // Free checks first, so a declined desire never costs a slot.
  if (screenDesire(desire).verdict !== "allow") return declined();

  try {
    const slot = await takeFoundrySlot(clientKey(request));
    if (!slot.allowed) {
      const minutes = Math.ceil(slot.retryAfterSeconds / 60);
      return reply(
        {
          status: "error",
          message: `The Foundry is at capacity for your address. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`,
        },
        429,
        { "Retry-After": String(slot.retryAfterSeconds) },
      );
    }

    const moderation = await moderateDesire(desire);
    if (moderation.verdict === "care") return declined(CARE_MESSAGE);
    if (moderation.verdict === "decline") return declined();

    const result = await generateSubsidiary(desire, await listCompanyNames());
    if (result.kind === "declined") return declined();

    const subsidiary = await createSubsidiary({
      ...result.draft,
      desire,
      is_flagship: false,
    });
    return reply({ status: "manufactured", slug: subsidiary.slug });
  } catch (error) {
    if (error instanceof FoundryError) {
      return reply({ status: "error", message: error.message }, error.status);
    }
    console.error("[foundry]", error);
    return reply({ status: "error", message: "The Foundry could not complete this order." }, 500);
  }
}
