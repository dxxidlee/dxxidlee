import type { Metadata } from "next";
import { Intro } from "@/components/Intro";

export const metadata: Metadata = { title: "Holdings" };

// Placeholder until its milestone is built.
export default function HoldingsPage() {
  return <Intro title="Holdings." lead="This division is not yet operational." />;
}
