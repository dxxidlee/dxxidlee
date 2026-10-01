import { NextResponse } from "next/server";
import { getHoldings } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";

/** Polled by the Holdings table for live updates. */
export function GET() {
  return NextResponse.json(getHoldings(), {
    headers: { "Cache-Control": "no-store" },
  });
}
