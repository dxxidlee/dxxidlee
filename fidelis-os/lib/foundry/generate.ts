import "server-only";
import { FoundryError, getAnthropic, toFoundryError } from "./anthropic";
import { jsonOutputFormat } from "./json-schema";
import { SYSTEM_PROMPT, userMessage } from "./prompt";
import { FoundryOutputSchema, type FoundryDraft } from "./schema";

export const MODEL = "claude-sonnet-5-5";

export type GenerationResult =
  | { kind: "manufactured"; draft: FoundryDraft }
  | { kind: "declined" };

const OUTPUT_FORMAT = jsonOutputFormat(FoundryOutputSchema);

type Attempt =
  | GenerationResult
  | { kind: "invalid"; reason: string };

async function attempt(desire: string, existingNames: string[]): Promise<Attempt> {
  const response = await getAnthropic().messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "medium", format: OUTPUT_FORMAT },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userMessage(desire, existingNames) }],
  });

  // A safety refusal gets the same corporate decline as a declined desire.
  if (response.stop_reason === "refusal") return { kind: "declined" };
  if (response.stop_reason === "max_tokens") {
    return { kind: "invalid", reason: "output was cut off at max_tokens" };
  }

  const text = response.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("");

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { kind: "invalid", reason: "output was not valid JSON" };
  }

  const parsed = FoundryOutputSchema.safeParse(json);
  if (!parsed.success) {
    return { kind: "invalid", reason: parsed.error.message };
  }

  const { decision, subsidiary } = parsed.data;
  if (decision === "decline") return { kind: "declined" };
  if (!subsidiary) {
    return { kind: "invalid", reason: "decision was manufacture but subsidiary was null" };
  }

  return {
    kind: "manufactured",
    draft: { ...subsidiary, trust_devices: [...new Set(subsidiary.trust_devices)] },
  };
}

/** Manufactures a belief for a desire. Retries once if the output fails validation. */
export async function generateSubsidiary(
  desire: string,
  existingNames: string[],
): Promise<GenerationResult> {
  try {
    for (let i = 1; i <= 2; i++) {
      const result = await attempt(desire, existingNames);
      if (result.kind !== "invalid") return result;
      console.warn(`[foundry] attempt ${i} failed validation: ${result.reason}`);
    }
  } catch (error) {
    toFoundryError(error);
  }
  throw new FoundryError("The Foundry could not complete this order.", 502);
}
