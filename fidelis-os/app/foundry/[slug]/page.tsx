import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Dieline } from "@/components/Dieline";
import { DownloadDielineButton } from "@/components/DownloadDielineButton";
import { Intro } from "@/components/Intro";
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
    <>
      <Intro
        title={`${subsidiary.company_name}.`}
        lead={subsidiary.tagline}
        side={
          <>
            <p className="bar">
              <span>Subsidiary founded</span>
              <span className="dim">Foundry</span>
            </p>
            <ListInStoreButton slug={subsidiary.slug} listed={subsidiary.listed_at !== null} />
            <DownloadDielineButton svgId="dieline" filename={`${subsidiary.slug}-dieline.pdf`} />
            <Link className="bar go" href="/foundry">
              <span>Manufacture another belief</span>
              <span>+</span>
            </Link>
          </>
        }
      >
        <p className="line">{subsidiary.claim}</p>
      </Intro>

      <section className="g24 mod">
        <figure className="m-media sheet">
          <Dieline subsidiary={subsidiary} id="dieline" />
        </figure>
        <div className="m-info">
          <SubsidiaryDossier subsidiary={subsidiary} internal />
        </div>
      </section>
    </>
  );
}
