import "server-only";
import type { Client } from "@libsql/client";
import { connect, initDatabase } from "./database";

// One connection per server process, initialized once. Survives hot reloads in dev.
const globalForDb = globalThis as unknown as { fidelisDb?: Promise<Client> };

async function open(): Promise<Client> {
  const db = await connect();
  await initDatabase(db);
  return db;
}

export function getDb(): Promise<Client> {
  globalForDb.fidelisDb ??= open().catch((error) => {
    globalForDb.fidelisDb = undefined; // let the next request retry
    throw error;
  });
  return globalForDb.fidelisDb;
}
