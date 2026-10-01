import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/** Raised for failures the intake should report, with a status code for the route. */
export class FoundryError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey || apiKey === "paste-your-key-here") {
    throw new FoundryError(
      "The Foundry is offline. ANTHROPIC_API_KEY is not set.",
      503,
    );
  }
  client ??= new Anthropic({ apiKey });
  return client;
}

/** Maps SDK errors to messages the intake can show. Rethrows anything else. */
export function toFoundryError(error: unknown): never {
  if (error instanceof FoundryError) throw error;
  if (error instanceof Anthropic.AuthenticationError) {
    throw new FoundryError("The Foundry is offline. ANTHROPIC_API_KEY was rejected.", 503);
  }
  if (error instanceof Anthropic.RateLimitError) {
    throw new FoundryError("The Foundry is at capacity. Try again shortly.", 503);
  }
  if (error instanceof Anthropic.APIError) {
    console.error(`[foundry] API error ${error.status}:`, error.message);
    throw new FoundryError("The Foundry could not complete this order.", 502);
  }
  throw error;
}
