import type { Metadata } from "next";
import { SubsidiaryCard } from "@/components/SubsidiaryCard";
import { listActiveSubsidiaries } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Store" };

export default function StorePage() {
  const subsidiaries = listActiveSubsidiaries();

  return (
    <section>
      <h1 className="page-title">Store</h1>
      {subsidiaries.length === 0 ? (
        <p>No beliefs are currently available.</p>
      ) : (
        <ul className="store-grid">
          {subsidiaries.map((subsidiary) => (
            <li key={subsidiary.id}>
              <SubsidiaryCard subsidiary={subsidiary} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
