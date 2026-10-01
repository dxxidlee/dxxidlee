import "server-only";
import { createHash } from "node:crypto";
import { getDb } from "./db";

// Foundry requests per client address, within a sliding window. Set
// FOUNDRY_RATE_LIMIT=0 to switch it off (for example on a gallery network
// where every visitor shares one address).
const limit = () => Number(process.env.FOUNDRY_RATE_LIMIT ?? 6);
const windowMinutes = () => Number(process.env.FOUNDRY_RATE_WINDOW_MINUTES ?? 10);

/** A stable, anonymous key for the requesting client. Raw addresses are never stored. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "local";
  return createHash("sha256").update(`fidelis-foundry:${address}`).digest("hex").slice(0, 32);
}

export type SlotResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/** Takes one Foundry slot for this client if it is under the limit. Atomic. */
export async function takeFoundrySlot(key: string): Promise<SlotResult> {
  const max = limit();
  if (!(max > 0)) return { allowed: true };

  const windowMs = windowMinutes() * 60 * 1000;
  const now = Date.now();
  const since = new Date(now - windowMs).toISOString();

  const [, inserted, oldest] = await (await getDb()).batch(
    [
      // Rows older than the window no longer matter to anyone.
      { sql: "DELETE FROM foundry_requests WHERE created_at < ?", args: [since] },
      {
        sql: `INSERT INTO foundry_requests (client_hash, created_at)
              SELECT @key, @now
              WHERE (SELECT COUNT(*) FROM foundry_requests
                     WHERE client_hash = @key AND created_at >= @since) < @max`,
        args: { key, now: new Date(now).toISOString(), since, max },
      },
      {
        sql: `SELECT MIN(created_at) AS oldest FROM foundry_requests
              WHERE client_hash = ? AND created_at >= ?`,
        args: [key, since],
      },
    ],
    "write",
  );

  if (inserted.rowsAffected === 1) return { allowed: true };
  const first = Date.parse(String(oldest.rows[0]?.oldest ?? new Date(now).toISOString()));
  return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((first + windowMs - now) / 1000)) };
}
