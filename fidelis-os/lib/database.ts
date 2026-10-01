// Database connection, shared by the app and scripts. No "server-only" here.
//
// Local development uses a SQLite file. Deployed, TURSO_DATABASE_URL points at a
// Turso (hosted SQLite) database. The SQL is the same either way.
import { createClient, type Client } from "@libsql/client";
import { applySchema } from "./schema";
import { seedIfEmpty } from "./seed";

export const DEFAULT_DATABASE_URL = "file:data/fidelis.db";

export function databaseUrl(): string {
  return process.env.TURSO_DATABASE_URL?.trim() || DEFAULT_DATABASE_URL;
}

export const isLocalFile = (url: string) => url.startsWith("file:");

export async function connect(): Promise<Client> {
  const url = databaseUrl();
  if (isLocalFile(url)) {
    const fs = await import("node:fs");
    const path = await import("node:path");
    fs.mkdirSync(path.dirname(url.slice("file:".length)), { recursive: true });
  }
  const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined });
  if (isLocalFile(url)) {
    await db.execute("PRAGMA journal_mode = WAL");
    await db.execute("PRAGMA busy_timeout = 5000");
  }
  await db.execute("PRAGMA foreign_keys = ON");
  return db;
}

/** Creates tables, applies migrations, and seeds the flagships into an empty database. */
export async function initDatabase(db: Client): Promise<void> {
  await applySchema(db);
  await seedIfEmpty(db);
}
