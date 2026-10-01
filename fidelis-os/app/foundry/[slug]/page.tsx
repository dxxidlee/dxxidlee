import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListInStoreButton } from "@/components/ListInStoreButton";
import { SubsidiaryDossier } from "@/components/SubsidiaryDossier";
import { getSubsidiaryBySlug } from "@/lib/subsidiaries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subsidiary = getSubsidiaryBySlug((await params).slug);
  return { title: subsidiary ? `${subsidiary.company_name} | Foundry` : "Not found" };
}

export default async function FoundryResultPage({ params }: Props) {
  const subsidiary = getSubsidiaryBySlug((await params).slug);
  if (!subsidiary) notFound();

  return (
    <section className="foundry-result">
      <p className="foundry-result__notice">Subsidiary founded.</p>
      <SubsidiaryDossier subsidiary={subsidiary} />
      <nav className="foundry-result__actions" aria-label="Next steps">
        <ListInStoreButton slug={subsidiary.slug} listed={subsidiary.listed_at !== null} />
        <Link href="/foundry">Manufacture another belief</Link>
      </nav>
    </section>
  );
}
