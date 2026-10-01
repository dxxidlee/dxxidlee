import type { Metadata } from "next";
import { KioskHoldings } from "@/components/KioskHoldings";
import { getHoldings } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Holdings kiosk" };

export default async function HoldingsKioskPage() {
  return <KioskHoldings initial={await getHoldings()} />;
}
