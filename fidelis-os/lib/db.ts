import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "./schema";
import { seedIfEmpty } from "./seed";

export const DATABASE_PATH =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "fidelis.db");

// Reuse one connection across hot reloads in development.
const globalForDb = globalThis as unknown as { fidelisDb?: Database.Database };

function open(): Database.Database {
  fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
  const db = new Database(DATABASE_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.exec(SCHEMA_SQL);
  seedIfEmpty(db);
  return db;
}

export function getDb(): Database.Database {
  globalForDb.fidelisDb ??= open();
  return globalForDb.fidelisDb;
}
