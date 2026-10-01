import type { Metadata } from "next";
import { Intro } from "@/components/Intro";

export const metadata: Metadata = { title: "Trust Manual" };

// Placeholder until its milestone is built.
export default function TrustManualPage() {
  return <Intro title="Trust Manual." lead="This division is not yet operational." />;
}
