import { NextResponse } from "next/server";
import { listStoreSubsidiaries } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";

/** Everything currently in the store, for the shelf kiosk. */
export async function GET() {
  return NextResponse.json(await listStoreSubsidiaries(), {
    headers: { "Cache-Control": "no-store" },
  });
}
