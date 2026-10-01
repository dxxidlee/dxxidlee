import type { Metadata } from "next";
import { FoundryIntake } from "@/components/FoundryIntake";

export const metadata: Metadata = { title: "Foundry" };

export default function FoundryPage() {
  return (
    <section className="foundry">
      <FoundryIntake />
    </section>
  );
}
