import type { Metadata } from "next";
import { Intro } from "@/components/Intro";
import { SubsidiaryCard } from "@/components/SubsidiaryCard";
import { formatCount } from "@/lib/format";
import { listStoreSubsidiaries } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Store" };

export default function StorePage() {
  const subsidiaries = listStoreSubsidiaries();
  const believers = subsidiaries.reduce((sum, s) => sum + s.believers, 0);

  return (
    <>
      <Intro
        title="Store."
        lead="Every belief Fidelis has manufactured, available to the public. Buying is believing."
        side={
          <ul className="rows">
            <li>
              <span>Beliefs available</span>
              <span>{formatCount(subsidiaries.length)}</span>
            </li>
            <li>
              <span>Believers</span>
              <span>{formatCount(believers)}</span>
            </li>
          </ul>
        }
      />
      {subsidiaries.length === 0 ? (
        <p className="status">No beliefs are currently available.</p>
      ) : (
        <section className="g24 cards" aria-label="Beliefs">
          {subsidiaries.map((subsidiary, i) => (
            <SubsidiaryCard key={subsidiary.id} subsidiary={subsidiary} n={i + 1} />
          ))}
        </section>
      )}
    </>
  );
}
