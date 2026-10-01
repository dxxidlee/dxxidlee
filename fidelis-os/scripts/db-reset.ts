// Deletes the local SQLite database and recreates it with the flagship seed.
// Usage: npm run db:reset
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "../lib/schema";
import { seedIfEmpty } from "../lib/seed";

const file =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "fidelis.db");

for (const suffix of ["", "-wal", "-shm"]) fs.rmSync(file + suffix, { force: true });
fs.mkdirSync(path.dirname(file), { recursive: true });

const db = new Database(file);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);
seedIfEmpty(db);

const rows = db
  .prepare("SELECT company_name, believers FROM subsidiaries ORDER BY believers DESC")
  .all() as { company_name: string; believers: number }[];
db.close();

console.log(`Database reset: ${file}`);
for (const r of rows) console.log(`  ${r.company_name.padEnd(12)} ${r.believers}`);
