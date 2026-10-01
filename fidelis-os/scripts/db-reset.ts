// Usage:
//   npm run db:init                   create tables and seed the flagships if empty (safe)
//   npm run db:reset                  delete the local database and reseed
//   npm run db:reset -- --remote      wipe the Turso database named in TURSO_DATABASE_URL and reseed
import { loadEnvConfig } from "@next/env";
import fs from "node:fs";
import { connect, databaseUrl, initDatabase, isLocalFile } from "../lib/database";

// Read .env.local and friends the same way Next does, so TURSO_* settings apply here too.
loadEnvConfig(process.cwd());

const reset = process.argv.includes("--reset");
const remote = process.argv.includes("--remote");
const url = databaseUrl();

async function main() {
  if (reset && !isLocalFile(url) && !remote) {
    console.error(
      `Refusing to wipe the remote database at ${url}.\n` +
        "Run with --remote to confirm: npm run db:reset -- --remote",
    );
    process.exit(1);
  }

  if (reset && isLocalFile(url)) {
    const file = url.slice("file:".length);
    for (const suffix of ["", "-wal", "-shm"]) fs.rmSync(file + suffix, { force: true });
  }

  const db = await connect();

  if (reset && !isLocalFile(url)) {
    await db.batch(
      ["DROP TABLE IF EXISTS beliefs", "DROP TABLE IF EXISTS foundry_requests", "DROP TABLE IF EXISTS subsidiaries"],
      "write",
    );
  }

  await initDatabase(db);

  const rs = await db.execute(
    "SELECT company_name, believers FROM subsidiaries ORDER BY believers DESC",
  );
  console.log(`${reset ? "Database reset" : "Database ready"}: ${url}`);
  for (const r of rs.rows) console.log(`  ${String(r.company_name).padEnd(12)} ${r.believers}`);
  db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
