import { NextResponse } from "next/server";
import { FoundryError, generateSubsidiary } from "@/lib/foundry/generate";
import { DECLINE_MESSAGE } from "@/lib/foundry/prompt";
import { DesireSchema, type FoundryResponse } from "@/lib/foundry/schema";
import { createSubsidiary, listCompanyNames } from "@/lib/subsidiaries";

export const runtime = "nodejs";
export const maxDuration = 120;

const reply = (body: FoundryResponse, status = 200) => NextResponse.json(body, { status });

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { desire?: unknown } | null;
  const desire = DesireSchema.safeParse(body?.desire);
  if (!desire.success) {
    return reply(
      { status: "error", message: "State a desire between 3 and 280 characters." },
      400,
    );
  }

  try {
    const result = await generateSubsidiary(desire.data, listCompanyNames());
    if (result.kind === "declined") {
      return reply({ status: "declined", message: DECLINE_MESSAGE });
    }
    const subsidiary = createSubsidiary({
      ...result.draft,
      desire: desire.data,
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
