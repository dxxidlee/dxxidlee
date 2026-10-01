import type { Metadata } from "next";
import { KioskShelf } from "@/components/KioskShelf";
import { listStoreSubsidiaries } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shelf" };

export default async function ShelfKioskPage() {
  return <KioskShelf initial={await listStoreSubsidiaries()} />;
}
